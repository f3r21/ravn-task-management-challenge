import { describe, expect, it } from 'vitest'
import {
  taskFormReducer,
  validateTaskForm,
  type TaskFormAction,
  type TaskFormFields,
} from './task-form-state'

const fields: TaskFormFields = {
  name: 'Slack',
  status: 'TODO',
  tags: ['IOS'],
  dueDate: '2026-08-14',
  pointEstimate: 'FOUR',
  assigneeId: 'user-1',
}

describe('taskFormReducer', () => {
  it('updates only the field its action names', () => {
    const next = taskFormReducer(fields, { type: 'set-name', name: 'Google' })

    expect(next.name).toBe('Google')
    expect(next.status).toBe('TODO')
    expect(next.tags).toEqual(['IOS'])
  })

  it('does not mutate the state it was given', () => {
    // A reducer that mutates works until something memoises on identity, and
    // then fails in a way that looks unrelated.
    taskFormReducer(fields, { type: 'set-name', name: 'Google' })

    expect(fields.name).toBe('Slack')
  })

  it('handles every field the form exposes', () => {
    const actions: TaskFormAction[] = [
      { type: 'set-name', name: 'x' },
      { type: 'set-status', status: 'DONE' },
      { type: 'set-tags', tags: ['REACT', 'RAILS'] },
      { type: 'set-due-date', dueDate: '2026-12-01' },
      { type: 'set-point-estimate', pointEstimate: 'EIGHT' },
      { type: 'set-assignee', assigneeId: 'user-9' },
    ]

    const result = actions.reduce(taskFormReducer, fields)

    expect(result).toEqual({
      name: 'x',
      status: 'DONE',
      tags: ['REACT', 'RAILS'],
      dueDate: '2026-12-01',
      pointEstimate: 'EIGHT',
      assigneeId: 'user-9',
    })
  })

  it('clears the assignee when it is set to null', () => {
    expect(
      taskFormReducer(fields, { type: 'set-assignee', assigneeId: null }).assigneeId,
    ).toBeNull()
  })

  it('throws on an action it does not know, rather than silently doing nothing', () => {
    expect(() =>
      taskFormReducer(fields, { type: 'set-colour' } as unknown as TaskFormAction),
    ).toThrow(/Unhandled task form action/)
  })
})

describe('validateTaskForm', () => {
  it('accepts a complete form', () => {
    expect(validateTaskForm(fields)).toBeUndefined()
  })

  it('rejects an empty name', () => {
    expect(validateTaskForm({ ...fields, name: '' })).toMatch(/name/i)
  })

  it('rejects a name that is only whitespace', () => {
    // Otherwise a task called "   " reaches the API and renders as a blank card.
    expect(validateTaskForm({ ...fields, name: '   ' })).toMatch(/name/i)
  })

  it('rejects a missing due date', () => {
    expect(validateTaskForm({ ...fields, dueDate: '' })).toMatch(/due date/i)
  })

  it('accepts a task with no tags and no assignee, both of which are optional', () => {
    expect(validateTaskForm({ ...fields, tags: [], assigneeId: null })).toBeUndefined()
  })
})
