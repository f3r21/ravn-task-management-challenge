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

  it('sends nothing but the id when the dialog was opened and saved unchanged', () => {
    // The two mappers are each other's inverse for every field the form owns, and this
    // is the assertion that keeps them that way. It also pins the patch contract: an
    // edit that changes nothing must send nothing, because every field it sends is a
    // field it would overwrite if a colleague had changed it in the meantime.
    const task = makeTask({ position: 3, assignee: makeUser({ id: 'user-7' }) })

    expect(toUpdateInput(task, toFormFields(task))).toEqual({ id: task.id })
  })
})

describe('toUpdateInput', () => {
  // Every case below edits exactly one field of a real task and asserts that exactly
  // that field travels. `edited` keeps each test to the change it is about.
  const baseline = makeTask({ position: 3, assignee: makeUser({ id: 'user-7' }) })
  const edited = (patch: Partial<TaskFormFields>) => ({ ...toFormFields(baseline), ...patch })

  it('carries the id', () => {
    expect(toUpdateInput(baseline, toFormFields(baseline)).id).toBe(baseline.id)
  })

  it('sends only the field that changed', () => {
    // The regression test for the clobbering defect. Before this, saving a due-date
    // edit also replayed the name and status the dialog was seeded with, overwriting
    // a concurrent edit with a stale snapshot and reporting success.
    const input = toUpdateInput(baseline, edited({ dueDate: '2030-01-02' }))

    expect(input).toEqual({ id: baseline.id, dueDate: '2030-01-02T00:00:00.000Z' })
    expect(Object.hasOwn(input, 'name')).toBe(false)
    expect(Object.hasOwn(input, 'status')).toBe(false)
  })

  it('does not treat reordered tags as an edit', () => {
    // Sending them back would overwrite a colleague's tag change for no gain.
    const reversed = [...toFormFields(baseline).tags].reverse()

    expect(Object.hasOwn(toUpdateInput(baseline, edited({ tags: reversed })), 'tags')).toBe(false)
  })

  it('trims the name', () => {
    // Deliberately not the fixture's own name — padding `Slack` is not an edit, which
    // is the case the test below covers.
    expect(toUpdateInput(baseline, edited({ name: '  Ship the API  ' })).name).toBe('Ship the API')
  })

  it('does not send a name whose only change is surrounding whitespace', () => {
    const padded = `  ${toFormFields(baseline).name}  `

    expect(Object.hasOwn(toUpdateInput(baseline, edited({ name: padded })), 'name')).toBe(false)
  })

  it('sends assigneeId as null when nobody is assigned, rather than omitting it', () => {
    const input = toUpdateInput(baseline, edited({ assigneeId: null }))

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

  it('sends a reassignment through unchanged', () => {
    expect(toUpdateInput(baseline, edited({ assigneeId: 'user-2' })).assigneeId).toBe('user-2')
  })

  it.each([
    ['blank', ''],
    ['only whitespace', '   '],
  ])('omits position when the field is %s', (_label, position) => {
    const input = toUpdateInput(baseline, edited({ position }))

    // `position` is a `Float!`, so `null` is a request to *unset* it rather than a
    // request to leave it alone. Omitting is what leaves the server's ordering
    // untouched — the mirror image of the assigneeId rule directly above.
    expect(Object.hasOwn(input, 'position')).toBe(false)
  })

  it.each([
    ['0', 0],
    ['2.5', 2.5],
    ['-1', -1],
  ])('coerces the position text %s to the number %s', (position, expected) => {
    // Zero matters: it is falsy, so a truthiness check here would drop a legitimate
    // "move to the top of the column". `baseline` sits at 3, so each of these is a
    // real change and travels.
    expect(toUpdateInput(baseline, edited({ position })).position).toBe(expected)
  })

  it('omits position when the number is the one the task already has', () => {
    // `3` is `baseline.position`. Re-sending it would overwrite a colleague's
    // reorder with the value this dialog happened to open on.
    expect(Object.hasOwn(toUpdateInput(baseline, edited({ position: '3' })), 'position')).toBe(
      false,
    )
  })
})
