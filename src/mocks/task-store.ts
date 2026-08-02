import type {
  CreateTaskInput,
  DeleteTaskInput,
  FilterTaskInput,
  UpdateTaskInput,
} from '@/graphql/generated/graphql'
import type { Task, User } from '@/features/board/task-types'
import { SEED_TASKS, SEED_USERS } from './task-fixtures'

/**
 * An in-memory stand-in for the API's database.
 *
 * This exists so the mock behaves like a server rather than a fixture: creating
 * a task makes it appear in later queries, filters actually narrow results, and
 * deleting removes it. A handler that always returned the same seven tasks would
 * let a broken cache invalidation pass its own test.
 *
 * `reset()` is called between tests so one test's created task cannot leak into
 * the next one's assertions.
 */
class TaskStore {
  private tasks: Task[] = []
  private users: User[] = []
  private nextId = 1

  constructor() {
    this.reset()
  }

  reset(): void {
    // Structured copies, so mutating a stored task cannot reach back into the
    // shared seed arrays and corrupt every later reset.
    this.tasks = SEED_TASKS.map((task) => ({ ...task }))
    this.users = SEED_USERS.map((user) => ({ ...user }))
    this.nextId = 1
  }

  listUsers(): User[] {
    return this.users
  }

  profile(): User {
    return this.users[0]
  }

  /**
   * Applies the same filter semantics the real API documents: a field that is
   * absent or null does not narrow the result, and `tags` matches a task
   * carrying *any* of the requested tags.
   */
  listTasks(filters: FilterTaskInput): Task[] {
    return this.tasks.filter((task) => {
      if (filters.name && !task.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false
      }
      if (filters.status && task.status !== filters.status) {
        return false
      }
      if (filters.pointEstimate && task.pointEstimate !== filters.pointEstimate) {
        return false
      }
      if (filters.assigneeId && task.assignee?.id !== filters.assigneeId) {
        return false
      }
      if (filters.ownerId && task.creator.id !== filters.ownerId) {
        return false
      }
      if (filters.tags?.length && !filters.tags.some((tag) => task.tags.includes(tag))) {
        return false
      }
      if (filters.dueDate && task.dueDate.slice(0, 10) !== filters.dueDate.slice(0, 10)) {
        return false
      }
      return true
    })
  }

  createTask(input: CreateTaskInput): Task {
    const task: Task = {
      id: `mock-task-${String(this.nextId++)}`,
      name: input.name,
      status: input.status,
      tags: input.tags,
      dueDate: input.dueDate,
      pointEstimate: input.pointEstimate,
      position: this.tasks.length,
      createdAt: new Date().toISOString(),
      assignee: this.users.find((user) => user.id === input.assigneeId) ?? null,
      creator: this.users[0],
    }
    this.tasks = [task, ...this.tasks]
    return task
  }

  updateTask(input: UpdateTaskInput): Task | undefined {
    const existing = this.tasks.find((task) => task.id === input.id)
    if (!existing) {
      return undefined
    }
    // Only fields actually present in the input are applied: `UpdateTaskInput`
    // is a patch, and spreading it wholesale would blank every omitted field.
    const updated: Task = {
      ...existing,
      ...(input.name != null && { name: input.name }),
      ...(input.status != null && { status: input.status }),
      ...(input.tags != null && { tags: input.tags }),
      ...(input.dueDate != null && { dueDate: input.dueDate }),
      ...(input.pointEstimate != null && { pointEstimate: input.pointEstimate }),
      ...(input.position != null && { position: input.position }),
      ...(input.assigneeId != null && {
        assignee: this.users.find((user) => user.id === input.assigneeId) ?? null,
      }),
    }
    this.tasks = this.tasks.map((task) => (task.id === input.id ? updated : task))
    return updated
  }

  deleteTask(input: DeleteTaskInput): Task | undefined {
    const existing = this.tasks.find((task) => task.id === input.id)
    if (!existing) {
      return undefined
    }
    this.tasks = this.tasks.filter((task) => task.id !== input.id)
    return existing
  }
}

export const taskStore = new TaskStore()
