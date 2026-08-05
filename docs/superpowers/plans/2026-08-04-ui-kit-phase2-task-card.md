# UI Kit Migration Phase 2 — TaskCard/TaskListView/TaskTable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the app's own `TaskCard` with `@ravn/ui-kit`'s `TaskCard`/`TaskListView` (grid/board
view) and `TaskTable` (list view), via one adapter module, while preserving every piece of real
functionality (edit, delete, filtering, position reorder) the app has today.

**Architecture:** One pure adapter (`to-kit-props.ts`) maps the app's `Task` domain type onto the
kit's three flattened prop shapes. `board-column.tsx` becomes a thin per-status wrapper supplying
landmark semantics the kit doesn't (`<section aria-label>`) around the kit's `TaskListView`.
`board.tsx`'s list branch collapses into a single kit `TaskTable` call (the kit groups by status
internally). Per-task Edit/Delete, previously a card-level options `Menu`, moves to: click the
card/row to open the edit dialog directly (the kit's only per-item interaction hook is a single
`onClick`), and a new "Delete task" action inside `TaskFormDialog` itself opens the existing
(unchanged, permanently app-owned) `DeleteTaskDialog`.

**Tech Stack:** React 19, TypeScript (strict, zero `any`/`@ts-ignore`), Vitest + Testing Library +
MSW, `@ravn/ui-kit` (vendored at `vendor/ravn-ui-kit/`), Tailwind v4, React Aria/React Stately.

## Global Constraints

- `npm run gate` (typecheck → lint → format:check → coverage) must stay green throughout, with only
  the same 2 pre-existing failures noted in `UI_KIT_MIGRATION_PLAN.md` (`client.test.ts`'s
  non-JSON-body test, `board-page.test.tsx`'s mock-banner assertion) — confirmed present via a gate
  run before this plan was written.
- Zero `any`, zero `@ts-ignore` (lint errors in this repo). The one deliberate exception below is a
  narrow, commented `as` cast at a single, documented type-only kit inconsistency — not a laundered
  `any`.
- No test ids — query by role, label, text.
- `date-fns` only for `isValid`/`parseISO`; all formatting via `Intl` with explicit `timeZone: 'UTC'`
  (`@/lib/due-date`) — never reintroduce local-timezone formatting.
- No domain type (`Task`, `User`) gets reshaped to fit the kit. Only the adapter bridges the two
  shapes.
- **Standing migration policy (set by the user this session, applies beyond this phase too):**
  adopt the kit's real components as designed. When the kit is missing something or its declared
  types/behavior are wrong, do not build an app-side workaround to route around it — document the
  gap precisely (what's missing, why it matters, where in the kit) in
  `UI_KIT_MIGRATION_PLAN.md` so a future session working in the sibling `ravn-ui-kit` repo can fix
  it upstream, the same way the Phase 1 `FocusScope` bug was fixed. Never edit
  `vendor/ravn-ui-kit/` or the sibling `ravn-ui-kit` repo directly from this repo's sessions.
- Branch fresh off `dev` (per this repo's branch layout), not off `feat/consume-ui-kit`.
- No credentials needed — pure component-swap work against the mock API.

## Kit facts this plan depends on (confirmed by reading `vendor/ravn-ui-kit/dist/`, not assumed)

- `TaskCardProps`/`TaskListViewProps`/`TaskTableRowProps` have **no slot for a per-item actions
  menu** — only a single `onClick` on the whole card/row (`task-card.d.ts`, `task-table.d.ts`).
- The kit's `TaskCard` (`ar` in `dist/index.js`) renders as a plain `<div>` with
  `role={onClick ? 'button' : undefined}` — **not** an `<article>`, and its title is an `<h3>`
  (via the shared `ProjectInfo` component, `tt`) but the div itself carries no `aria-labelledby`.
  When `onClick` is set, the whole card becomes one unlabeled `role="button"` region whose
  accessible name is computed from all its visible text.
- `TaskListView` (`Ur`) is a plain `<div>` wrapper: `ProjectInfo` header (`<h3>`) + a vertical stack
  of `TaskCard`s, own empty-state text `"No tasks in this view."` when `tasks.length === 0`. No
  `<section>`/landmark role of its own.
- `TaskTable` (`Yr`) renders **one real `<table><tbody>` per group**, each starting with an `<h3>`
  group-title row, then one `<tr>` (`TaskTableRow`, `gr`) per task. A task's title inside a row is a
  plain `<span>`, **not a heading** — only the group title is an `<h3>`. `TaskTable`'s own
  `"No tasks yet."` empty text only appears when the whole `groups` array is empty, not per empty
  group.
- `TaskTableRowProps.index` is rendered via `String(index).padStart(2, '0')` with **no +1 offset**
  applied internally — callers must pass a 1-based index themselves to get the documented "01",
  "02", … numbering.
- `TaskTableRowProps` always renders a real, always-visible checkbox
  (`aria-label: Select ${title}`) — there is no prop to omit the selection UI entirely, even when
  no `onSelectedChange` is passed (it simply becomes an inert, unwired checkbox).
- `TaskCardProps.tags[number].variant` is typed as
  `'primary' | 'secondary' | 'tertiary' | 'neutral'` — **missing `'blue'`**, unlike the kit's own
  `Tag` component (`tag.d.ts`) and `TaskTableRowProps.tags[number].variant`/`TagCellProps`, both of
  which declare the full 5-value union. Confirmed via the bundled implementation (`ar`'s
  `s.map((v, h) => t(Y, { variant: v.variant || "neutral", ... }))`) that this is a **type-only**
  gap: the value is forwarded verbatim to the real `Tag`, which renders `'blue'` correctly at
  runtime — the declared `.d.ts` union is just stale.
- From `ar`'s own `dueDateUrgency`→`Tag` variant map (`{ normal: "neutral", warning: "tertiary",
overdue: "primary" }`) and `TaskCard`'s Figma doc comment ("Type=General/Green/Blue/Yellow/Red"),
  the kit's 5 tag variants resolve to: `neutral`=General(gray), `secondary`=Green, `blue`=Blue,
  `tertiary`=Yellow, `primary`=Red.

---

### Task 1: The adapter module — `to-kit-props.ts`

**Files:**

- Create: `src/features/board/task-card/to-kit-props.ts`
- Create: `src/features/board/task-card/to-kit-props.test.ts`
- Delete (end of this task, once nothing imports them — verify with grep first):
  `src/features/board/task-card/task-card.tsx`,
  `src/features/board/task-card/task-card.test.tsx`,
  `src/features/board/task-card/due-date-badge.tsx`

**Interfaces:**

- Produces: `toKitCardProps(task: Task, now: Date, onClick?: () => void): TaskCardProps` and
  `toKitTableRowProps(task: Task, index: number, now: Date, onClick?: () => void):
TaskTableRowProps`, both exported from `to-kit-props.ts`. Task 2 and Task 3 call these directly.

- [ ] **Step 1: Write the failing tests for `toKitCardProps`**

```typescript
// src/features/board/task-card/to-kit-props.test.ts
import { describe, expect, it } from 'vitest'
import { makeTask, makeUser } from '@/mocks/task-fixtures'
import { toKitCardProps, toKitTableRowProps } from './to-kit-props'

const now = new Date('2026-08-02T12:00:00.000Z')

describe('toKitCardProps', () => {
  it('carries the name and numeric point value straight through', () => {
    const props = toKitCardProps(makeTask({ name: 'Slack', pointEstimate: 'EIGHT' }), now)

    expect(props.title).toBe('Slack')
    expect(props.points).toBe(8)
  })

  it('formats the due date and marks it overdue, reusing the shared due-date logic', () => {
    const props = toKitCardProps(makeTask({ dueDate: '2026-07-20T00:00:00.000Z' }), now)

    expect(props.dueDateText).toBe('20 July, 2026')
    expect(props.dueDateUrgency).toBe('overdue')
  })

  it('marks a date due today or tomorrow as warning, not overdue', () => {
    const props = toKitCardProps(makeTask({ dueDate: '2026-08-02T00:00:00.000Z' }), now)

    expect(props.dueDateText).toBe('Today')
    expect(props.dueDateUrgency).toBe('warning')
  })

  it('marks a date further out as normal', () => {
    const props = toKitCardProps(makeTask({ dueDate: '2026-12-01T00:00:00.000Z' }), now)

    expect(props.dueDateUrgency).toBe('normal')
  })

  it('omits the due date fields entirely when the API date does not parse', () => {
    const props = toKitCardProps(makeTask({ dueDate: 'nonsense' }), now)

    expect(props.dueDateText).toBeUndefined()
    expect(props.dueDateUrgency).toBeUndefined()
  })

  it("maps every tag accent onto the kit's 5-value variant enum", () => {
    const props = toKitCardProps(
      makeTask({ tags: ['IOS', 'ANDROID', 'REACT', 'RAILS', 'NODE_JS'] }),
      now,
    )

    expect(props.tags).toEqual([
      { label: 'iOS app', variant: 'secondary' },
      { label: 'Android', variant: 'tertiary' },
      { label: 'React', variant: 'blue' },
      { label: 'Rails', variant: 'primary' },
      { label: 'Node js', variant: 'neutral' },
    ])
  })

  it('flattens the assignee to a name and avatar string', () => {
    const props = toKitCardProps(
      makeTask({
        assignee: makeUser({ fullName: 'Priya Nair', avatar: 'https://example.com/p.png' }),
      }),
      now,
    )

    expect(props.assigneeName).toBe('Priya Nair')
    expect(props.assigneeAvatar).toBe('https://example.com/p.png')
  })

  it('leaves assignee fields undefined, not null, when the task has nobody assigned', () => {
    const props = toKitCardProps(makeTask({ assignee: null }), now)

    expect(props.assigneeName).toBeUndefined()
    expect(props.assigneeAvatar).toBeUndefined()
  })

  it('does not invent metaBadges data the domain model has no field for', () => {
    const props = toKitCardProps(makeTask(), now)

    expect(props.metaBadges).toBeUndefined()
  })

  it('wires the onClick it was given straight through', () => {
    const onClick = () => {}
    const props = toKitCardProps(makeTask(), now, onClick)

    expect(props.onClick).toBe(onClick)
  })
})

describe('toKitTableRowProps', () => {
  it('passes the index straight through, undoing no offset of its own', () => {
    // The kit's own TaskTableRow pads whatever `index` it is given — callers are
    // responsible for the 1-based numbering the design shows ("01", not "00").
    const props = toKitTableRowProps(makeTask(), 1, now)

    expect(props.index).toBe(1)
  })

  it("uses the row shape's field name for the due date, not the card's", () => {
    const props = toKitTableRowProps(makeTask({ dueDate: '2026-07-20T00:00:00.000Z' }), 1, now)

    expect(props.dueDate).toBe('20 July, 2026')
    expect(props.dueDateUrgency).toBe('overdue')
  })

  it('names the estimation field estimationPoints, not points', () => {
    const props = toKitTableRowProps(makeTask({ pointEstimate: 'TWO' }), 1, now)

    expect(props.estimationPoints).toBe(2)
  })

  it('reuses the same tag variant mapping as the card path', () => {
    const props = toKitTableRowProps(makeTask({ tags: ['REACT'] }), 1, now)

    expect(props.tags).toEqual([{ label: 'React', variant: 'blue' }])
  })
})
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run: `npx vitest run src/features/board/task-card/to-kit-props.test.ts`
Expected: FAIL — `to-kit-props.ts` does not exist yet.

- [ ] **Step 3: Implement the adapter**

```typescript
// src/features/board/task-card/to-kit-props.ts
import type { TaskCardProps, TaskTableRowProps } from '@ravn/ui-kit'
import { dueDateTone, formatDueDate, parseApiDate, type DueDateTone } from '@/lib/due-date'
import { pointValue, tagAccent, tagLabel, type TagAccent } from '../task-display'
import type { Task } from '../task-types'

type KitTagVariant = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'blue'
type KitUrgency = 'normal' | 'warning' | 'overdue'

/**
 * The kit's own 5 tag variants, read off `TaskCard`'s Figma doc comment
 * ("Type=General/Green/Blue/Yellow/Red") and confirmed against its
 * `dueDateUrgency`→`Tag`-variant map (`overdue`→`primary`, `warning`→`tertiary`):
 * neutral=General, secondary=Green, blue=Blue, tertiary=Yellow, primary=Red.
 * Defined once and reused by both target shapes below, per the migration prompt's
 * own instruction not to duplicate this mapping per call site.
 */
const TAG_TO_KIT_VARIANT: Record<TagAccent, KitTagVariant> = {
  green: 'secondary',
  amber: 'tertiary',
  blue: 'blue',
  red: 'primary',
  neutral: 'neutral',
}

const TONE_TO_KIT_URGENCY: Record<DueDateTone, KitUrgency> = {
  overdue: 'overdue',
  soon: 'warning',
  normal: 'normal',
}

function kitTags(task: Task): { label: string; variant: KitTagVariant }[] {
  return task.tags.map((tag) => ({
    label: tagLabel(tag),
    variant: TAG_TO_KIT_VARIANT[tagAccent(tag)],
  }))
}

function dueDateInfo(task: Task, now: Date): { text: string; urgency: KitUrgency } | undefined {
  const dueDate = parseApiDate(task.dueDate)
  if (!dueDate) {
    return undefined
  }
  return {
    text: formatDueDate(dueDate, now),
    urgency: TONE_TO_KIT_URGENCY[dueDateTone(dueDate, now)],
  }
}

export function toKitCardProps(task: Task, now: Date, onClick?: () => void): TaskCardProps {
  const due = dueDateInfo(task, now)
  return {
    title: task.name,
    points: pointValue(task.pointEstimate),
    dueDateText: due?.text,
    dueDateUrgency: due?.urgency,
    // `TaskCardProps['tags'][number]['variant']` is missing `'blue'` relative to the
    // kit's own `Tag` component and `TaskTableRowProps` — a type-only gap, verified
    // against the kit's bundled implementation (forwards the value as-is to the real
    // `Tag`). See UI_KIT_MIGRATION_PLAN.md's Phase 2 gap list. One cast, here only.
    tags: kitTags(task) as TaskCardProps['tags'],
    assigneeName: task.assignee?.fullName,
    assigneeAvatar: task.assignee?.avatar ?? undefined,
    onClick,
  }
}

export function toKitTableRowProps(
  task: Task,
  index: number,
  now: Date,
  onClick?: () => void,
): TaskTableRowProps {
  const due = dueDateInfo(task, now)
  return {
    index,
    title: task.name,
    tags: kitTags(task),
    estimationPoints: pointValue(task.pointEstimate),
    assigneeName: task.assignee?.fullName,
    assigneeAvatar: task.assignee?.avatar ?? undefined,
    dueDate: due?.text,
    dueDateUrgency: due?.urgency,
    onClick,
  }
}
```

- [ ] **Step 4: Run the tests to confirm they pass**

Run: `npx vitest run src/features/board/task-card/to-kit-props.test.ts`
Expected: PASS, all cases above green.

- [ ] **Step 5: Confirm nothing outside `task-card.tsx`/`task-card.test.tsx` imports the old component or `DueDateBadge`, then delete both files and `due-date-badge.tsx`**

Run: `grep -rn "task-card/task-card'\|DueDateBadge" src --include="*.ts" --include="*.tsx"`
Expected: only `board-column.tsx` (handled in Task 2) and the three files being deleted show up.
Delete `task-card.tsx`, `task-card.test.tsx`, `due-date-badge.tsx`.

- [ ] **Step 6: Typecheck and commit**

Run: `npx tsc --noEmit`
Expected: no new errors (Task 2 hasn't updated `board-column.tsx` yet, so this may still show
unused-import errors there — if so, confirm they're confined to `board-column.tsx`, which Task 2
fixes next, and commit anyway since this task's own files are complete and independently correct).

```bash
git add src/features/board/task-card/to-kit-props.ts src/features/board/task-card/to-kit-props.test.ts
git rm src/features/board/task-card/task-card.tsx src/features/board/task-card/task-card.test.tsx src/features/board/task-card/due-date-badge.tsx
git commit -m "feat: adapt Task onto @ravn/ui-kit's TaskCard/TaskTableRow prop shapes"
```

---

### Task 2: Grid/board view — `board-column.tsx` onto the kit's `TaskListView`

**Files:**

- Modify: `src/features/board/board-column.tsx`
- Modify: `src/features/board/board.tsx` (drop `itemLayout`/`onDeleteTask` from the grid branch's
  props to `BoardColumn`, add a concrete `now`)

**Interfaces:**

- Consumes: `toKitCardProps` from Task 1.
- Produces: `BoardColumn({ status, tasks, now, className, onEditTask }: BoardColumnProps)` — same
  name, `onDeleteTask`/`itemLayout` props removed (Task 3 handles list view separately; there is no
  more shared `layout` flag once grid and list are different kit components).

- [ ] **Step 1: Rewrite `board-column.tsx`**

```typescript
import { TaskListView } from '@ravn/ui-kit'
import { cn } from '@/lib/cn'
import { statusLabel } from './task-display'
import { toKitCardProps } from './task-card/to-kit-props'
import type { Status, Task } from './task-types'

interface BoardColumnProps {
  status: Status
  tasks: Task[]
  now: Date
  className?: string
  onEditTask?: (task: Task) => void
}

/**
 * One status column, wrapped in a landmark the kit's `TaskListView` doesn't
 * provide on its own (it renders a plain `<div>` with no `section`/region role) —
 * `aria-label` rather than `aria-labelledby`, since the kit renders its own `<h3>`
 * internally with no `id` this component can point at.
 */
export function BoardColumn({ status, tasks, now, className, onEditTask }: BoardColumnProps) {
  const title = `${statusLabel(status)} (${String(tasks.length).padStart(2, '0')})`

  return (
    <section aria-label={title} className={cn('min-w-0', className)}>
      <TaskListView
        title={title}
        tasks={tasks.map((task) => toKitCardProps(task, now, () => onEditTask?.(task)))}
      />
    </section>
  )
}
```

- [ ] **Step 2: Update `board.tsx`'s grid branch to pass a concrete `now` and drop `onDeleteTask`**

In `src/features/board/board.tsx`, resolve `now` once at the top of `Board` (the adapter takes a
required `Date`, not an optional one — a deliberate change from the old `TaskCard`'s own
`now = new Date()` default, since the adapter is meant to be a pure function with no hidden clock
read of its own):

```typescript
export function Board({ tasks, view, now, onEditTask }: BoardProps) {
  const effectiveNow = now ?? new Date()
  const grouped = groupByStatus(tasks)
  // ...grid branch's <BoardColumn> calls pass now={effectiveNow}, no onDeleteTask
  // ...list branch is rewritten in Task 3
}
```

Remove `onDeleteTask` from `BoardProps` and from every `<BoardColumn>` call in the grid branch.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: errors remaining only in `board.tsx`'s list branch and `board-page.tsx` (both fixed in
Task 3/4) and in test files (fixed in Task 6/7). No errors in `board-column.tsx` itself.

- [ ] **Step 4: Commit**

```bash
git add src/features/board/board-column.tsx src/features/board/board.tsx
git commit -m "feat: render board columns through @ravn/ui-kit's TaskListView"
```

---

### Task 3: List view — `board.tsx`'s list branch onto one kit `TaskTable`

**Files:**

- Modify: `src/features/board/board.tsx`

**Interfaces:**

- Consumes: `toKitTableRowProps` from Task 1, `statusLabel` from `task-display.ts`,
  `BOARD_STATUSES` from `task-types.ts`.

**Context:** the kit's `TaskTable` groups every status internally (one `<table>` per group) — this
replaces the old per-status `<BoardColumn itemLayout="row">` loop with a single component call.
`TaskTableRowProps.index` needs a **1-based** number per group (confirmed in Task 1's kit-facts
section) to produce the documented "01", "02" numbering.

- [ ] **Step 1: Replace the `view === 'list'` branch**

```typescript
import { TaskTable } from '@ravn/ui-kit'
import { statusLabel } from './task-display'
import { toKitTableRowProps } from './task-card/to-kit-props'
// ...

export function Board({ tasks, view, now, onEditTask }: BoardProps) {
  const effectiveNow = now ?? new Date()
  const grouped = groupByStatus(tasks)

  if (view === 'list') {
    /*
     * The list view is not the board stacked — see the grid branch's own comment
     * for why. The kit's `TaskTable` already groups by section internally (one
     * bordered `<table>` per group), so this is one component call for the whole
     * board, not one per status the way the grid branch's columns are.
     */
    return (
      <TaskTable
        groups={BOARD_STATUSES.map((status) => {
          const tasksInStatus = grouped.get(status) ?? []
          return {
            title: `${statusLabel(status)} (${String(tasksInStatus.length).padStart(2, '0')})`,
            rows: tasksInStatus.map((task, index) =>
              toKitTableRowProps(task, index + 1, effectiveNow, () => onEditTask?.(task)),
            ),
          }
        })}
      />
    )
  }

  // ...grid branch unchanged from Task 2, using effectiveNow
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors in `board.tsx`. Remaining errors, if any, are in `board-page.tsx` (Task 4) and
test files (Task 6/7).

- [ ] **Step 3: Commit**

```bash
git add src/features/board/board.tsx
git commit -m "feat: render list view as a single @ravn/ui-kit TaskTable grouped by status"
```

---

### Task 4: Move Delete into `TaskFormDialog`; rewire `board-page.tsx`

**Files:**

- Modify: `src/features/board/task-form-dialog.tsx`
- Modify: `src/features/board/task-form-dialog.test.tsx`
- Modify: `src/features/board/board-page.tsx`

**Context:** the kit's card/row has no menu slot, so per the user's standing policy this plan
adopts the kit's actual `onClick`-only shape rather than building a workaround. Card/row `onClick`
now opens the edit dialog directly (wired in Tasks 2/3 above). Delete becomes an explicit action
inside the edit dialog, which then hands off to the existing, unchanged, permanently-app-owned
`DeleteTaskDialog` — a real product decision (edit screen carries its own delete action), not a
visual hack layered on top of the kit's rendering.

**Interfaces:**

- Modifies: `TaskFormDialogProps` gains `onDelete?: () => void`, rendered as a "Delete task" button
  only when `mode === 'edit'` and `onDelete` is provided.
- Consumes in `board-page.tsx`: existing `editDialog`/`deleteDialog` `OverlayTriggerState`s and
  `taskUnderAction`, unchanged.

- [ ] **Step 1: Write the failing test for the Delete button**

Add to `src/features/board/task-form-dialog.test.tsx`:

```typescript
it('offers a delete action when editing, wired to the caller\'s onDelete', async () => {
  const onDelete = vi.fn()
  const user = userEvent.setup()
  renderWithProviders(
    <TaskFormDialog
      state={openState}
      users={[]}
      onSubmit={vi.fn()}
      title="Edit Slack"
      submitLabel="Save"
      mode="edit"
      onDelete={onDelete}
    />,
  )

  await user.click(screen.getByRole('button', { name: /delete task/i }))

  expect(onDelete).toHaveBeenCalledTimes(1)
})

it('offers no delete action when creating, even if onDelete is somehow passed', () => {
  renderWithProviders(
    <TaskFormDialog
      state={openState}
      users={[]}
      onSubmit={vi.fn()}
      title="Create task"
      submitLabel="Create"
      onDelete={vi.fn()}
    />,
  )

  expect(screen.queryByRole('button', { name: /delete task/i })).not.toBeInTheDocument()
})

it('renders no delete action when editing without an onDelete handler', () => {
  renderWithProviders(
    <TaskFormDialog
      state={openState}
      users={[]}
      onSubmit={vi.fn()}
      title="Edit Slack"
      submitLabel="Save"
      mode="edit"
    />,
  )

  expect(screen.queryByRole('button', { name: /delete task/i })).not.toBeInTheDocument()
})
```

Check the existing test file's setup for however it currently constructs an open
`OverlayTriggerState` (`openState`) and `userEvent`/`renderWithProviders` imports, and match that
convention rather than introducing a second one.

- [ ] **Step 2: Run to confirm failure**

Run: `npx vitest run src/features/board/task-form-dialog.test.tsx -t 'delete'`
Expected: FAIL — no such prop/button exists yet.

- [ ] **Step 3: Add the prop and button**

In `task-form-dialog.tsx`, add `onDelete?: () => void` to `TaskFormDialogProps`, destructure it,
and render it before the Cancel/Save pair, edit-mode-only:

```tsx
<div className="flex justify-between gap-6">
  {mode === 'edit' && onDelete ? (
    <Button variant="text" onPress={onDelete} isDisabled={isSubmitting} className="text-danger">
      Delete task
    </Button>
  ) : (
    <span />
  )}
  <div className="flex gap-6">
    <Button
      variant="text"
      onPress={() => {
        state.close()
      }}
      isDisabled={isSubmitting}
    >
      Cancel
    </Button>
    <Button variant="primary" type="submit" isDisabled={isSubmitting}>
      {isSubmitting ? 'Saving…' : submitLabel}
    </Button>
  </div>
</div>
```

Check `Button`'s actual prop types (`src/ui/button/button.tsx`) before assuming `className` is
accepted — if it isn't, use whatever styling hook the component actually exposes for a danger-toned
text button instead of inventing one.

- [ ] **Step 4: Run to confirm pass**

Run: `npx vitest run src/features/board/task-form-dialog.test.tsx`
Expected: PASS, including the 3 new cases and all pre-existing ones.

- [ ] **Step 5: Rewire `board-page.tsx`**

- Remove `onDeleteTask` from the `<Board>` call (Board no longer has that prop after Task 2/3).
- Pass `onDelete` to the edit-mode `<TaskFormDialog>`:

```tsx
{
  editDialog.isOpen && taskUnderAction ? (
    <TaskFormDialog
      state={editDialog}
      users={users ?? []}
      onSubmit={handleEdit}
      mode="edit"
      title={`Edit ${taskUnderAction.name}`}
      submitLabel="Save"
      onDelete={() => {
        editDialog.close()
        deleteDialog.open()
      }}
      initialFields={{/* unchanged */}}
    />
  ) : null
}
```

`deleteDialog.isOpen && taskUnderAction` block stays exactly as it is — `taskUnderAction` is already
the task being edited, so no new state is needed.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors in `task-form-dialog.tsx` or `board-page.tsx`. Remaining errors, if any, are
confined to test files handled in Tasks 6/7.

- [ ] **Step 7: Commit**

```bash
git add src/features/board/task-form-dialog.tsx src/features/board/task-form-dialog.test.tsx src/features/board/board-page.tsx
git commit -m "feat: move task deletion into the edit dialog now cards have no options menu"
```

---

### Task 5: Rewrite `board.test.tsx`

**Files:**

- Modify: `src/features/board/board.test.tsx`

**Context:** the old assertions relied on the app's own `TaskCard` rendering an `<article>` and,
in list view, a per-task `<h3>` — neither is still true. The kit's card is a plain `<div>`
(`role="button"` when clickable); a `TaskTable` row's title is a `<span>`, not a heading (only the
group title is an `<h3>`). The kit's own empty-state copy also differs ("No tasks in this view."
vs. the app's old "No tasks here yet.").

- [ ] **Step 1: Update the per-status heading assertions (grid view) — these still work, no change needed**

`renders a column for every status`, `puts each task in the column matching its status`,
`orders a column by position`, `counts the tasks in each column` all rely on grid-view headings
(`getByRole('heading', ...)` for both the column title and the task's own `<h3>` title via
`TaskCard`/`ProjectInfo`) — both still render as headings after Task 2, so these tests need no
changes. Confirm this by running them, not by assuming it.

- [ ] **Step 2: Fix the empty-column test's expected text**

```typescript
it('says a column is empty rather than leaving a blank gap', () => {
  renderWithProviders(<Board tasks={[]} view="grid" now={now} />)

  // The kit's TaskListView owns this copy; it offers no prop to override it.
  expect(screen.getAllByText(/no tasks in this view/i)).toHaveLength(5)
})
```

- [ ] **Step 3: Rewrite the list-view test to match the table's actual shape**

```typescript
it('renders the same tasks in list view, as a table row rather than a heading', () => {
  renderWithProviders(<Board tasks={[makeTask({ name: 'Slack' })]} view="list" now={now} />)

  // A TaskTable row's title is a <span>, not a heading — only the group title is.
  expect(screen.getByText('Slack')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /todo/i })).toBeInTheDocument()
})
```

- [ ] **Step 4: Rewrite the "lays a task out differently" test — it can no longer rely on `article`**

```typescript
it('renders grid view as a card and list view as a table row for the same task', () => {
  // Asserting the same text renders in both views passes even when the two
  // branches are byte-identical, which is why this checks structure instead.
  const task = makeTask({ id: 't1', name: 'Slack', status: 'TODO' })

  const grid = renderWithProviders(<Board tasks={[task]} view="grid" now={now} />)
  expect(grid.container.querySelector('table')).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  grid.unmount()

  renderWithProviders(<Board tasks={[task]} view="list" now={now} />)
  expect(screen.getByRole('table')).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Slack' })).not.toBeInTheDocument()
})
```

- [ ] **Step 5: Update the "leaves out an unknown status" test if it touches list view — check first**

Read the current test; it only exercises `view="grid"`, so unless it also asserts something list-
specific, leave it as is.

- [ ] **Step 6: Run the full file**

Run: `npx vitest run src/features/board/board.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/board/board.test.tsx
git commit -m "test: pin Board's actual output against the kit's TaskListView/TaskTable"
```

---

### Task 6: Rewrite `update-delete-task.test.tsx`

**Files:**

- Modify: `src/features/board/update-delete-task.test.tsx`

**Context:** this file is built entirely around opening a card's options menu and picking "Edit"/
"Delete" from it — that menu no longer exists. Edit is now: click the card (its `<h3>` title is a
safe, unambiguous click target — the click bubbles to the kit's card `div[role=button]` either
way) and delete is now a button inside the edit dialog that hands off to the same
`DeleteTaskDialog` as before, unchanged. The default board view is `'grid'` (`board-page.tsx`), so
these tests stay on the card view unless stated otherwise, and titles stay real `<h3>` headings.

- [ ] **Step 1: Replace the `chooseAction` helper**

```typescript
/** Opens the edit dialog for a named card by clicking it. */
async function openEdit(user: ReturnType<typeof userEvent.setup>, taskName: string) {
  await user.click(screen.getByRole('heading', { name: taskName }))
}

/** Opens the edit dialog, then triggers its Delete action to reach the confirmation. */
async function openDeleteConfirmation(user: ReturnType<typeof userEvent.setup>, taskName: string) {
  await openEdit(user, taskName)
  const dialog = await screen.findByRole('dialog')
  await user.click(within(dialog).getByRole('button', { name: /delete task/i }))
}
```

- [ ] **Step 2: Delete the `describe('the task options menu', ...)` block entirely**

There is no options menu anymore — this whole `describe` (its 3 tests: trigger naming, offering
edit/delete, keyboard open/close) tested behavior that no longer exists in this design.

- [ ] **Step 3: Rewrite every `chooseAction(user, 'Slack', 'Edit')` call to `openEdit(user, 'Slack')`**

Applies to all tests under `describe('editing a task', ...)`. Their bodies (assert dialog content,
save, cancel, position reorder, validation error, focus-restore, popover-survives-a-frame) are
unchanged otherwise **except** the two focus-restore assertions below.

- [ ] **Step 4: Fix the two focus-restore assertions — focus now returns to the card, not a menu button**

```typescript
it('returns focus to the card that opened it, on Cancel', async () => {
  const user = await renderBoard()
  await openEdit(user, 'Slack')
  const dialog = await screen.findByRole('dialog')

  await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'Slack' }).closest('[role="button"]')).toHaveFocus()
  })
})
```

Verify in a real browser too (Task 8) — React Aria's restore-focus target here is whatever the kit
records as the click origin, and this is exactly the kind of focus assertion this project's own
`CLAUDE.md` says to check in both jsdom and a browser.

- [ ] **Step 5: Rewrite `describe('deleting a task', ...)` to reach the confirmation via the edit dialog**

Every `chooseAction(user, 'Slack', 'Delete')` call becomes `openDeleteConfirmation(user, 'Slack')`.
The confirmation dialog's own content/behavior (`role="alertdialog"`, its text, Cancel/Delete,
notifications, error handling, `isInaccessible` check) is entirely unchanged — `DeleteTaskDialog`
itself was not touched by this phase.

- [ ] **Step 6: Fix the "returns focus to the card that opened it" delete test**

This one previously returned focus to the menu-item's trigger (`Task options for Slack`). Now the
delete confirmation is opened from a button _inside_ the edit dialog, which itself closes
(`editDialog.close()`) the moment `deleteDialog.open()` runs (Task 4's wiring) — so cancelling the
delete confirmation should return focus to whatever the edit dialog's own dismissal already sends
it to. Write this test by first observing actual behavior (`screen.debug()` or a real-browser
check), not by assuming — this interaction is genuinely new, not a like-for-like port of the old
one, and the two dialogs closing/opening in sequence is exactly the kind of focus behavior
`CLAUDE.md` says to verify for real rather than guess.

- [ ] **Step 7: Run the full file**

Run: `npx vitest run src/features/board/update-delete-task.test.tsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/features/board/update-delete-task.test.tsx
git commit -m "test: rewrite edit/delete flow tests for click-to-edit and dialog-hosted delete"
```

---

### Task 7: Check `search-filter.test.tsx` and any other remaining references

**Files:**

- Modify: `src/features/board/search-filter.test.tsx` (only if Step 1 finds a real break)

- [ ] **Step 1: Run the file as-is first**

Run: `npx vitest run src/features/board/search-filter.test.tsx`
Expected: most tests exercise the default `'grid'` view, where task titles are still real `<h3>`
headings post-migration (Task 2 kept that), so most `getByRole('heading', ...)` assertions should
still pass unchanged. Read the actual failures, if any, rather than assuming which ones break.

- [ ] **Step 2: Fix only what actually fails**

If a test fails because of the empty-state copy change (Task 5, Step 2) or anything else touched
by this phase, fix it the same way Task 5 did — match the kit's actual rendered text/structure,
don't restore the app's old copy by working around the kit.

- [ ] **Step 3: Grep the rest of the test suite for anything else pinning the old shape**

Run: `grep -rln "closest('article')\|role: 'article'\|Task options for" src --include="*.test.tsx"`
Expected: only files already handled in Tasks 5/6 (and this one) show up. Fix any surprise.

- [ ] **Step 4: Commit, if anything changed**

```bash
git add src/features/board/search-filter.test.tsx
git commit -m "test: adjust search-filter assertions for the kit's TaskListView empty-state copy"
```

---

### Task 8: Real-browser verification

**Context:** `CLAUDE.md` documents jsdom and the real browser disagreeing on focus and the
accessibility tree in both directions. This phase changes what element focus returns to after
closing the edit dialog and after the new edit→delete handoff, and changes the accessible
structure of every card (a `role="button"` div instead of an `<article>`) — exactly the category
of change this project has been burned by trusting jsdom alone on before.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Confirm no mock-banner-related surprises and that the board loads.

- [ ] **Step 2: Drive the grid view through Chrome DevTools MCP (prefer over Playwright MCP if its
      browser profile is already locked by another session, per the Phase 1 retry's own note)**

Click a card, confirm the edit dialog opens seeded with that task's data. Click "Delete task"
inside it, confirm the edit dialog closes and the delete confirmation opens naming the right task.
Cancel it, and check with a console query (`document.activeElement`) or an accessibility snapshot
where focus actually lands — this is exactly the number Step 6 of Task 6 needs before it can write
a correct assertion, not just a check that the app "looks right".

- [ ] **Step 3: Drive the list view the same way**

Switch to list view, click a row, confirm the same edit dialog opens. Confirm the group header
text reads correctly (e.g. "Todo (02)") and that row numbering restarts at "01" per group.

- [ ] **Step 4: Check the whole-card `role="button"` accessible name in a real accessibility tree**

Use an accessibility snapshot (Chrome DevTools MCP) on one card to see what name assistive tech
actually computes for it, now that the entire card (title + points + due date + tags + assignee)
is one unlabeled clickable region. Record the actual observed name in the gap writeup (Task 9) —
don't guess it from reading the bundle alone.

- [ ] **Step 5: Confirm the pre-existing `size-*` Tailwind bug's scope hasn't changed**

Per `UI_KIT_MIGRATION_PLAN.md`'s Phase 1 disclosure, several icons already render at raw SVG size.
This phase adds more kit-rendered icons (the due-date Tag's alarm icon, `TaskTableRow`'s checkbox/
chevron icons). Confirm whether any of those are newly affected or the bug's scope is unchanged —
this was flagged as worth re-confirming before Phase 2 added more kit components with icons.

---

### Task 9: Document this phase's kit gaps and update the persistent plan

**Files:**

- Modify: `UI_KIT_MIGRATION_PLAN.md` (repo root, gitignored — the persistent migration record)

**Context:** per the standing policy recorded in Global Constraints, every kit limitation found
this phase gets written up precisely enough for a future session in the sibling `ravn-ui-kit` repo
to act on — not routed around here.

- [ ] **Step 1: Mark Phase 2 done and write its entry**

Follow the exact structure Phase 0/1 already use in this file (what was done, what was verified,
disclosures). Include, at minimum, each of these as a distinct, precise item (fill in any values
Task 8 observed that this plan could only predict from reading the bundle):

1. **No per-item actions-menu slot.** `TaskCardProps`/`TaskListViewProps`/`TaskTableRowProps` only
   expose a single `onClick`. This app worked around it by moving Delete into the edit dialog and
   using the card/row click for Edit — a real product decision, but only possible because this app
   has exactly one other per-item action to place; a consumer needing 3+ per-item actions would
   have nowhere to put them. Suggested fix: an optional `actions?: React.ReactNode` slot rendered
   in the header row, analogous to `TaskTableRowProps.onViewDetails`.
2. **`TaskCardProps.tags[number].variant` is missing `'blue'`**, inconsistent with the kit's own
   `Tag` component and `TaskTableRowProps.tags[number].variant` (both 5-value). Confirmed type-only
   (the implementation forwards the value verbatim to the real `Tag`). Trivial fix: widen the
   union in `task-card.d.ts`/the corresponding source type to match.
3. **The whole card is an unlabeled `role="button"` `<div>`, not an `<article>`,** when `onClick`
   is passed — no `aria-label`, so its accessible name is computed from all its own text content.
   Record what Task 8 Step 4 actually observed here.
4. **`TaskTableRowProps` always renders a real, unhideable selection checkbox** even when
   `onSelectedChange` is never passed — a consumer with no bulk-select feature still ships an inert
   checkbox on every row with no prop to omit it.
5. **A `TaskTableRow`'s task title renders as a plain `<span>`, not a heading** — only the group
   title is an `<h3>`, unlike `TaskCard`'s own title. A screen-reader user browsing by heading
   level in table/list view can jump to a status group but not to an individual task.
6. **`TaskTable`'s built-in empty-state text only appears when the entire `groups` array is
   empty**, not per individual empty group — an empty status group renders its header row with
   zero body rows and no "nothing here" message, unlike `TaskListView`'s own per-instance empty
   text.
7. **Neither `TaskCard`/`TaskListView` nor `TaskTable` accept custom empty-state copy** — this
   phase had to adopt the kit's own wording ("No tasks in this view." / "No tasks yet.") in place
   of the app's previous "No tasks here yet.", a small but real, forced copy change.

- [ ] **Step 2: Cross-reference the standing policy**

Add a short note to the "Decisions already made" section (or immediately above the Progress list)
recording the policy itself, in the plan doc's own words, so a session that only skims Progress
still sees it: adopt the kit's real components; document gaps for upstream fixes; no app-side
workarounds. Link it to this being set explicitly by the user during Phase 2, not inferred.

- [ ] **Step 3: Final gate run and diff review**

Run: `npm run gate`
Expected: green, same 2 pre-existing failures only.

Run: `git diff dev --stat` (once branched and all commits are in) to confirm no domain type
(`Task`, `User`) was reshaped and nothing on the "stays permanently" list (`Menu`, `Select`/
`MultiSelect`/`ListBox`/`Popover`, `ToastProvider`, `EmptyState`, `ErrorBoundary`, icon set,
`DeleteTaskDialog`) was touched — `DeleteTaskDialog` itself should show zero diff; only its
callers changed.

- [ ] **Step 4: Commit**

```bash
git add UI_KIT_MIGRATION_PLAN.md
git commit -m "docs: close out Phase 2, record TaskCard/TaskListView/TaskTable gaps for ui-kit"
```
