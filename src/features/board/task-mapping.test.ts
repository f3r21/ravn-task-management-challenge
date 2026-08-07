import { describe, expect, it } from 'vitest'
import { makeTask, makeUser } from '@/mocks/task-fixtures'
import { toApiDateTime, toCreateInput, toFormFields, toUpdateInput } from './task-mapping'
import type { TaskFormFields } from './task-form-state'

/**
 * The transport rules, tested where they can actually be tested.
 *
 * These four rules are the ones `CLAUDE.md` records as having already cost
 * defects, and until now they lived as closures inside `BoardPage` — so the only
 * thing asserting that an edit sends `assigneeId: null` was an integration test
 * that drives a menu, a dialog, a Select popover and a mutation to check one
 * field. Excellent as an integration test, poor as the sole coverage of a
 * serialisation rule: it cannot enumerate cases, and it fails for a dozen reasons
 * that have nothing to do with the mapping.
 */

function fields(overrides: Partial<TaskFormFields> = {}): TaskFormFields {
  return {
    name: 'Slack',
    status: 'TODO',
    tags: ['IOS'],
    dueDate: '2026-08-14',
    pointEstimate: 'FOUR',
    assigneeId: 'user-1',
    position: '',
    ...overrides,
  }
}

describe('toApiDateTime', () => {
  // The one place the suffix is written down, rather than the three it used to be.
  it.each([
    ['2026-08-14', '2026-08-14T00:00:00.000Z'],
    ['2026-01-01', '2026-01-01T00:00:00.000Z'],
    ['2026-12-31', '2026-12-31T00:00:00.000Z'],
  ])('turns %s into the midnight-UTC instant %s', (input, expected) => {
    expect(toApiDateTime(input)).toBe(expected)
  })

  it('reads back as the same calendar day, which is the whole point', () => {
    // The suite runs at UTC+14 on purpose (see vite.config.ts), so a mapping that
    // reached for a local calendar field would land on the 13th here.
    const instant = toApiDateTime('2026-08-14')

    expect(new Date(instant).toISOString().slice(0, 10)).toBe('2026-08-14')
  })
})

describe('toCreateInput', () => {
  it('trims the name, because a trailing space is not a different task', () => {
    expect(toCreateInput(fields({ name: '  Slack  ' })).name).toBe('Slack')
  })

  it('carries the fields the form collected', () => {
    expect(toCreateInput(fields())).toMatchObject({
      name: 'Slack',
      status: 'TODO',
      tags: ['IOS'],
      dueDate: '2026-08-14T00:00:00.000Z',
      pointEstimate: 'FOUR',
      assigneeId: 'user-1',
    })
  })

  it.each([
    ['null', null],
    ['an empty string', ''],
  ])('omits assigneeId entirely when it is %s', (_label, assigneeId) => {
    const input = toCreateInput(fields({ assigneeId }))

    // Key presence, not `toBeUndefined()`: the rule is "do not send the field",
    // and `{ assigneeId: undefined }` would satisfy an undefined check while
    // reading as though the field were deliberately being sent as empty.
    expect(Object.hasOwn(input, 'assigneeId')).toBe(false)
  })

  it('has no position field at all, because CreateTaskInput has nowhere to put one', () => {
    // The server assigns position on create. Collecting it would be a value with
    // no destination, which is why the form only shows that control in edit mode.
    expect(Object.hasOwn(toCreateInput(fields({ position: '3' })), 'position')).toBe(false)
  })
})

describe('toFormFields', () => {
  it('seeds every field from the task', () => {
    const task = makeTask({
      name: 'Slack',
      status: 'IN_PROGRESS',
      tags: ['IOS', 'ANDROID'],
      dueDate: '2026-08-14T00:00:00.000Z',
      pointEstimate: 'EIGHT',
      position: 3,
      assignee: makeUser({ id: 'user-7' }),
    })

    expect(toFormFields(task)).toEqual({
      name: 'Slack',
      status: 'IN_PROGRESS',
      tags: ['IOS', 'ANDROID'],
      dueDate: '2026-08-14',
      pointEstimate: 'EIGHT',
      position: '3',
      assigneeId: 'user-7',
    })
  })

  it('reads the due date as the calendar day the API meant, not the local one', () => {
    // The round trip that matters, and the reason the suite runs at UTC+14: a
    // mapping that read local calendar fields would hand the form the 13th.
    expect(toFormFields(makeTask({ dueDate: '2026-08-14T00:00:00.000Z' })).dueDate).toBe(
      '2026-08-14',
    )
  })

  it('reports an unassigned task as null rather than undefined', () => {
    // `null` is what the form's "Unassigned" option means, and what `toUpdateInput`
    // then sends to clear the field. `undefined` would round-trip as "leave it".
    expect(toFormFields(makeTask({ assignee: null })).assigneeId).toBeNull()
  })

  it('leaves the date field empty when the task carries an unparseable one', () => {
    expect(toFormFields(makeTask({ dueDate: 'not-a-date' })).dueDate).toBe('')
  })

  it('round-trips through toUpdateInput without changing the task', () => {
    // The two mappers are each other's inverse for every field the form owns, and
    // this is the assertion that keeps them that way — an edit that opens a dialog
    // and saves it again with no changes must not alter the task.
    const task = makeTask({ position: 3, assignee: makeUser({ id: 'user-7' }) })

    const input = toUpdateInput(task.id, toFormFields(task))

    expect(input).toEqual({
      id: task.id,
      name: task.name,
      status: task.status,
      tags: task.tags,
      dueDate: task.dueDate,
      pointEstimate: task.pointEstimate,
      position: 3,
      assigneeId: 'user-7',
    })
  })
})

describe('toUpdateInput', () => {
  it('carries the id it was given', () => {
    expect(toUpdateInput('task-9', fields()).id).toBe('task-9')
  })

  it('trims the name', () => {
    expect(toUpdateInput('task-9', fields({ name: '  Slack  ' })).name).toBe('Slack')
  })

  it('sends assigneeId as null when nobody is assigned, rather than omitting it', () => {
    const input = toUpdateInput('task-9', fields({ assigneeId: null }))

    // The opposite rule to create, and the reason unassigning was once impossible:
    // `UpdateTaskInput` is a patch, so an omitted field means "leave it alone".
    // `null` is the only way to say "nobody".
    expect(Object.hasOwn(input, 'assigneeId')).toBe(true)
    expect(input.assigneeId).toBeNull()
  })

  // No empty-string case here, unlike `toCreateInput` above, and the asymmetry is
  // deliberate rather than an oversight. `TaskFormFields.assigneeId` is typed
  // `string | null` but the form's reducer only ever writes `null` or a real user
  // id (`task-form-dialog.tsx` maps its "Unassigned" sentinel to `null`), so `''`
  // does not reach either mapper from the UI. Create's rule is a falsy check, so
  // it absorbs `''` for free and the test above records that; update passes the
  // value through, so asserting anything about `''` here would be pinning
  // behaviour for a state the app cannot produce — and inventing a normalisation
  // to satisfy it would add a branch no path exercises.

  it('sends assigneeId through unchanged when somebody is assigned', () => {
    expect(toUpdateInput('task-9', fields({ assigneeId: 'user-2' })).assigneeId).toBe('user-2')
  })

  it.each([
    ['blank', ''],
    ['only whitespace', '   '],
  ])('omits position when the field is %s', (_label, position) => {
    const input = toUpdateInput('task-9', fields({ position }))

    // `position` is a `Float!`, so `null` is a request to *unset* it rather than a
    // request to leave it alone. Omitting is what leaves the server's ordering
    // untouched — the mirror image of the assigneeId rule directly above.
    expect(Object.hasOwn(input, 'position')).toBe(false)
  })

  it.each([
    ['3', 3],
    ['0', 0],
    ['2.5', 2.5],
    ['-1', -1],
  ])('coerces the position text %s to the number %s', (position, expected) => {
    // Zero matters: it is falsy, so a truthiness check here would drop a
    // legitimate "move to the top of the column".
    expect(toUpdateInput('task-9', fields({ position })).position).toBe(expected)
  })
})
