import { beforeEach, describe, expect, it } from 'vitest'
import { taskStore } from './task-store'

/**
 * The mock API's behaviour, tested directly.
 *
 * The store is excluded from the coverage metric — it is a test double, not app
 * code — but its correctness still matters: the filter tests in a later phase
 * assert that a filtered request returns the right tasks, and they can only do
 * that if the fake filters the way the real API documents. A wrong fake would
 * let a broken filter pass.
 */
beforeEach(() => {
  taskStore.reset()
})

describe('listTasks', () => {
  it('returns everything when no filter is given', () => {
    expect(taskStore.listTasks({}).length).toBe(7)
  })

  it('matches a name case-insensitively', () => {
    expect(taskStore.listTasks({ name: 'sLaCk' }).map((task) => task.name)).toEqual(['Slack'])
  })

  it('matches on a substring anywhere in the name, not just a prefix', () => {
    // "sla" is inside both "Slack" and "Tesla", which is the behaviour a search
    // box should have — and a reminder that these are substrings, not prefixes.
    expect(
      taskStore
        .listTasks({ name: 'sla' })
        .map((task) => task.name)
        .sort(),
    ).toEqual(['Slack', 'Tesla'])
  })

  it('narrows by status', () => {
    const todo = taskStore.listTasks({ status: 'TODO' })

    expect(todo).toHaveLength(2)
    expect(todo.every((task) => task.status === 'TODO')).toBe(true)
  })

  it('matches a task carrying any of the requested tags, not all of them', () => {
    const railsOrNode = taskStore.listTasks({ tags: ['RAILS', 'NODE_JS'] })

    expect(railsOrNode.map((task) => task.name).sort()).toEqual(['Maxxis Tyres', 'Samsung'])
  })

  it('narrows by assignee, and does not match the creator', () => {
    const mine = taskStore.listTasks({ assigneeId: 'user-3' })

    expect(mine.map((task) => task.name)).toEqual(['Twitter'])
  })

  it('combines filters, narrowing further with each one', () => {
    expect(taskStore.listTasks({ status: 'TODO', tags: ['REACT'] }).map((t) => t.name)).toEqual([
      'Google',
    ])
  })

  it('returns nothing when a combination matches no task', () => {
    expect(taskStore.listTasks({ status: 'DONE', tags: ['RAILS'] })).toEqual([])
  })

  it('compares due dates by day, ignoring the time part', () => {
    expect(taskStore.listTasks({ dueDate: '2026-08-14T17:31:00.000Z' }).map((t) => t.name)).toEqual(
      ['Slack'],
    )
  })
})

describe('createTask', () => {
  it('makes the new task visible to the next query', () => {
    taskStore.createTask({
      name: 'New task',
      status: 'BACKLOG',
      tags: ['REACT'],
      dueDate: '2026-09-01T00:00:00.000Z',
      pointEstimate: 'TWO',
    })

    expect(taskStore.listTasks({ name: 'New task' })).toHaveLength(1)
  })

  it('leaves a task unassigned when no assignee is given', () => {
    const created = taskStore.createTask({
      name: 'Unassigned',
      status: 'TODO',
      tags: [],
      dueDate: '2026-09-01T00:00:00.000Z',
      pointEstimate: 'ZERO',
    })

    expect(created.assignee).toBeNull()
  })
})

describe('updateTask', () => {
  it('applies only the fields present in the patch', () => {
    const updated = taskStore.updateTask({ id: 'task-1', status: 'DONE' })

    // `UpdateTaskInput` is a patch, so an omitted field must survive rather than
    // being blanked by a wholesale spread.
    expect(updated?.status).toBe('DONE')
    expect(updated?.name).toBe('Slack')
    expect(updated?.tags).toEqual(['IOS', 'ANDROID'])
  })

  it('reports a miss for an id that does not exist', () => {
    expect(taskStore.updateTask({ id: 'nope', name: 'x' })).toBeUndefined()
  })
})

describe('deleteTask', () => {
  it('removes the task from later queries', () => {
    taskStore.deleteTask({ id: 'task-1' })

    expect(taskStore.listTasks({ name: 'Slack' })).toEqual([])
  })

  it('reports a miss for an id that does not exist', () => {
    expect(taskStore.deleteTask({ id: 'nope' })).toBeUndefined()
  })
})

describe('reset', () => {
  it('rolls back changes, so one test cannot leak into the next', () => {
    taskStore.deleteTask({ id: 'task-1' })
    taskStore.reset()

    expect(taskStore.listTasks({}).length).toBe(7)
  })

  it('restores a task that a previous test mutated', () => {
    taskStore.updateTask({ id: 'task-1', name: 'Renamed' })
    taskStore.reset()

    // Without copying the seed array on reset, the mutation would have reached
    // back into the shared fixtures and survived.
    expect(taskStore.listTasks({ name: 'Slack' })).toHaveLength(1)
  })
})
