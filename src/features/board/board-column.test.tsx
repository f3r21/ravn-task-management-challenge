import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makeTask, makeUser } from '@/mocks/task-fixtures'
import { renderWithProviders, userEvent } from '@/test/test-utils'
import { Board } from './board'
import type { BoardView } from './board-toolbar'
import { BOARD_STATUSES, type Task } from './task-types'

const now = new Date('2026-08-02T12:00:00.000Z')

/**
 * Rendered through `Board` rather than a column, because the two views are no longer the
 * same component with a flag: the board maps one `TaskListView` per status, the list view
 * is a single `TaskTable` holding every status at once. `Board` is the smallest thing that
 * can be asked the same question twice.
 *
 * Every task here is `TODO`, so the other four statuses render empty and the queries below
 * stay unambiguous.
 */
function renderColumn(tasks: Task[], view: BoardView = 'grid') {
  return renderWithProviders(<Board tasks={tasks} view={view} now={now} />)
}

/*
 * What the board still guarantees now that `@ravn/ui-kit` draws the card.
 *
 * This replaces `task-card/task-card.test.tsx`, which tested a component that no longer
 * exists. It is deliberately *not* a test of the kit — the kit tests itself. Every case
 * here is something this app decided and the kit could silently take away: a guard at the
 * data boundary, a name the app supplies, a slot the app fills, a state the app spells out.
 *
 * Both views are exercised from one file on purpose. They render through two different
 * components now — `TaskListView` per status for the board, one `TaskTable` for the whole
 * list — and the single-component `layout` switch that used to make them agree is gone.
 * `to-kit-props.ts` is what replaces it; this is where that shows up as behaviour.
 */

describe('the board column, in either view', () => {
  it.each<BoardView>(['grid', 'list'])(
    'names each task’s options button after the task it belongs to (%s view)',
    (view) => {
      // Every task carries one of these, so "options" alone would be ambiguous the moment
      // a screen-reader user lists the buttons on the page. It is the app's string, passed
      // into a kit slot on the board and rendered directly in the list.
      renderColumn([makeTask({ name: 'Google' })], view)

      expect(screen.getByRole('button', { name: 'Task options for Google' })).toBeInTheDocument()
    },
  )

  it.each<BoardView>(['grid', 'list'])(
    'shows the assignee as initials when the API points their avatar at a dead host (%s view)',
    (view) => {
      // The cross-lane hazard this migration was warned about. Every `User.avatar` the live
      // API serves points at `avatars.dicebear.com`, which is decommissioned: it answers 410
      // with a valid 14.6 kB SVG, so the browser decodes it, the `<img>` fires `load` rather
      // than `error`, and a grey square with a red mark renders. `onError` provably cannot
      // catch it.
      //
      // The guard used to be a call in the card's JSX; it now lives in `to-kit-props.ts`,
      // which is the only place a `User` becomes props — and it has to cover *both* views,
      // which the JSX version did by being inside the one shared component.
      //
      // Asserting that the avatar *contains text* is what pins it: initials are there only
      // when no image is being rendered at all. A query rewritten to match the new markup
      // would go green while no longer testing dicebear.
      renderColumn(
        [
          makeTask({
            assignee: makeUser({
              fullName: 'Priya Nair',
              avatar: 'https://avatars.dicebear.com/api/initials/pn.svg',
            }),
          }),
        ],
        view,
      )

      const avatar = screen.getByRole('img', { name: 'Priya Nair' })
      expect(avatar).toHaveTextContent('PN')
      expect(avatar.querySelector('img')).toBeNull()
    },
  )

  it.each<BoardView>(['grid', 'list'])(
    'still renders a real avatar, since only the one dead host is discarded (%s view)',
    (view) => {
      renderColumn(
        [
          makeTask({
            assignee: makeUser({
              fullName: 'Priya Nair',
              avatar: 'https://cdn.ravn.co/avatars/priya.png',
            }),
          }),
        ],
        view,
      )

      // The `<img>` is `alt=""` on purpose — the accessible name belongs to the wrapper, so
      // no role query can reach the element itself.
      const avatar = screen.getByRole('img', { name: 'Priya Nair' })
      expect(avatar).not.toHaveTextContent('PN')
      expect(avatar.querySelector('img')).toHaveAttribute(
        'src',
        'https://cdn.ravn.co/avatars/priya.png',
      )
    },
  )

  it('says a task is unassigned rather than showing an empty avatar (board view)', () => {
    renderColumn([makeTask({ assignee: null })])

    expect(screen.getByRole('img', { name: 'Unassigned' })).toBeInTheDocument()
  })

  it('leaves the list view’s assignee column empty for an unassigned task', () => {
    // **The two views disagree here, and it is the kit's doing rather than the app's.**
    // `TaskCard` renders `<Avatar>` unconditionally, so the `fallbackLabel` announces
    // "Unassigned"; `TaskTableRow` renders its assignee cell only `{assigneeName ? … }`, so
    // the state is silent. Filed as ravn-ui-kit#111.
    //
    // Not blocked on: an empty cell is a defensible table idiom and the row still carries
    // the task, which is why this migrated rather than stopping. Pinned as the difference it
    // is, so the day the kit closes it this goes red and the case above absorbs both views
    // again — the same shape as the overdue tripwire.
    renderColumn([makeTask({ assignee: null })], 'list')

    expect(screen.queryByRole('img', { name: 'Unassigned' })).not.toBeInTheDocument()
    // Not passing because the row vanished.
    expect(screen.getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  })

  it.each<BoardView>(['grid', 'list'])(
    'lists every tag on the task, in the design’s own casing (%s view)',
    (view) => {
      renderColumn([makeTask({ tags: ['IOS', 'RAILS'] })], view)

      expect(screen.getByText('iOS app')).toBeInTheDocument()
      expect(screen.getByText('Rails')).toBeInTheDocument()
    },
  )

  it.each<BoardView>(['grid', 'list'])(
    'omits the due date when the API sends something unparseable (%s view)',
    (view) => {
      renderColumn([makeTask({ dueDate: 'nonsense' })], view)

      expect(screen.queryByText(/invalid date/i)).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
    },
  )

  it('keeps the delete option type-selectable despite its text being wrapped', async () => {
    // The Delete item's label is wrapped in a <span> so it can be coloured as a destructive
    // action, which costs it the `textValue` that plain-string children supply for free —
    // react-stately derives typeahead and the accessible name from that, and warns when it
    // cannot. An explicit `textValue` restores both.
    //
    // Asserting on the warning rather than on typeahead itself is deliberate: react-aria's
    // typeahead is timer-driven and does not settle reliably in jsdom. The warning fires
    // synchronously at collection-build time and is exact.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const user = userEvent.setup()
    renderColumn([makeTask({ name: 'Slack' })])

    await user.click(screen.getByRole('button', { name: 'Task options for Slack' }))

    expect(await screen.findByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
    expect(warn.mock.calls.flat().join('\n')).not.toMatch(/textValue/i)
  })
})

describe('the board view', () => {
  it('nests the card headings one level under the column heading', () => {
    // Both were level 3 before the kit exposed `headingLevel`, which made a column header
    // indistinguishable from its own cards to `getAllByRole('heading', { level: 3 })`.
    renderColumn([makeTask({ name: 'Slack' })])

    expect(screen.getByRole('heading', { level: 2, name: 'Todo (01)' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Slack' })).toBeInTheDocument()
  })

  it('makes the column a landmark a screen reader can jump to', () => {
    renderColumn([])

    expect(screen.getByRole('region', { name: 'Todo (00)' })).toBeInTheDocument()
  })

  it('leaves the card title a heading rather than making the card one big button', () => {
    // The kit renders the title as a `<button>` only when given `onClick`, and turns the
    // whole card into one control whose accessible name is its entire text content if it is
    // ever given `role="button"` again. The app passes no `onClick`; this is what notices
    // if that changes.
    renderColumn([makeTask({ name: 'Slack' })])

    const card = screen.getByRole('article')
    expect(card).toHaveAccessibleName('Slack')
    expect(within(card).queryByRole('button', { name: 'Slack' })).not.toBeInTheDocument()
  })

  it('renders no counters the schema has nothing behind', () => {
    // The card's attachment / subtask / comment counters were hardcoded 5 and 3, kept
    // because the design draws them and hidden with `aria-hidden` because announcing counts
    // that are not real is worse than silence. `@ravn/ui-kit@v0.5.3` renders every badge's
    // label into an `sr-only` node (kit#19), so there is no longer a way to show them
    // silently — ravn-ui-kit#93. They are dropped rather than announced.
    //
    // Asserting on the accessible text rather than on the absence of an element: a badge
    // that stopped rendering its icon but kept its label would pass the second and fail
    // this.
    renderColumn([makeTask()])

    const card = screen.getByRole('article')
    expect(card).not.toHaveTextContent(/subtask|comment|attachment/i)
  })

  it('spells the points out in the kit’s wording, not the app’s', () => {
    // "4 Pts". This is the one assertion in the migration that changed because the *app*
    // was wrong: the kit derives "N Pts" from the Figma card's own "Timer" row, and the app
    // had been spelling it out. See ravn-ui-kit#94 for the kit disagreeing with itself
    // ("N Points" in its table) and rendering "1 Pts" for a one-point task.
    renderColumn([makeTask({ pointEstimate: 'FOUR' })])

    expect(screen.getByText('4 Pts')).toBeInTheDocument()
  })

  it('counts the tasks in the heading, zero-padded like the design', () => {
    renderColumn([makeTask({ id: 'a' }), makeTask({ id: 'b' })])

    expect(screen.getByRole('heading', { name: 'Todo (02)' })).toBeInTheDocument()
  })

  it('says every empty column is empty rather than leaving a blank gap', () => {
    renderColumn([])

    // One per status: the board renders all five whether or not anything is in them.
    expect(screen.getAllByText(/no tasks here yet/i)).toHaveLength(BOARD_STATUSES.length)
  })
})

describe('the list view', () => {
  it('nests each row heading under its group heading', () => {
    // `TaskTableGroup.headingLevel` is new in ravn-ui-kit#95. The group header was a
    // hardcoded `<h3>` before it, which put an `h1 → h3` skip between this page's heading
    // and its tasks — the thing axe reports as `heading-order`.
    renderColumn([makeTask({ name: 'Slack' })], 'list')

    expect(screen.getByRole('heading', { level: 2, name: 'Todo (01)' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Slack' })).toBeInTheDocument()
  })

  it('renders the statuses as real table rows a screen reader can navigate', () => {
    // The app's own row was an `<article aria-labelledby>`; the kit's is a `<tr>` in a
    // `<table>`, which is the structure the design draws and the one that gives a screen
    // reader row/column navigation. Asserting the role rather than the markup.
    renderColumn([makeTask({ name: 'Slack' })], 'list')

    const row = screen.getAllByRole('row').find((r) => within(r).queryByText('Slack'))
    expect(row).toBeDefined()
    expect(within(row as HTMLElement).getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  })

  it('spells the points out in full, which is what the kit’s own table does', () => {
    renderColumn([makeTask({ pointEstimate: 'FOUR' })], 'list')

    expect(screen.getByText('4 Points')).toBeInTheDocument()
  })

  it('uses the singular for a one-point task', () => {
    // The table pluralises; the card does not, and renders "1 Pts" — ravn-ui-kit#94, still
    // open. So the two views disagree on this one string by the kit's own doing.
    renderColumn([makeTask({ pointEstimate: 'ONE' })], 'list')

    expect(screen.getByText('1 Point')).toBeInTheDocument()
  })

  it('puts no select checkbox in the accessibility tree', () => {
    // `TaskTableRow`'s checkbox is `sr-only` rather than merely invisible, so left on it
    // would be announced and tabbable in every row while wired to nothing — this app has no
    // bulk-selection feature. `isSelectable: false` is set in the adapter.
    renderColumn([makeTask(), makeTask({ id: 'b', name: 'Other' })], 'list')

    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
  })
})

describe('the overdue state', () => {
  const overdue = [makeTask({ dueDate: '2026-07-20T00:00:00.000Z' })]

  /*
   * **Matched on the word alone, never on its punctuation**, and that is what made the
   * hand-off work rather than a detail of style.
   *
   * Until `@ravn/ui-kit@v0.6.0` the board could not say this at all: the kit rendered the
   * due date as a colour-coded `Tag` and nothing else, so a third case here pinned the
   * *absence* — a tripwire named for ravn-ui-kit#92, designed to go red the moment the kit
   * started announcing the state. On the bump it did, alone, out of 455 tests, and that red
   * is why these two cases now cover both views instead of the list only.
   *
   * The tripwire nearly failed to fire. It first read `/\(overdue\)/`, keyed to the
   * parenthesised form this app's own badge emitted; the kit announces `, overdue`,
   * following its house idiom ("Notifications, 3 unread"). No parentheses, so it would have
   * stayed green at exactly the moment it was supposed to go red — caught in review before
   * the release, not after. **A tripwire keyed to a format it does not control is not a
   * tripwire.** Only the due-date tag renders in these trees, so the word alone cannot match
   * anything else.
   */
  const OVERDUE = /overdue/i

  it.each<BoardView>(['grid', 'list'])(
    'is spelled out rather than relying on colour alone (%s view)',
    (view) => {
      renderColumn(overdue, view)

      expect(screen.getByText(OVERDUE)).toBeInTheDocument()
      // The visible date is untouched by the state being announced — the kit's fix adds an
      // `sr-only` node beside it rather than changing `dueDateText`.
      expect(screen.getByText('20 July, 2026')).toBeInTheDocument()
    },
  )

  it.each<BoardView>(['grid', 'list'])(
    'does not claim a task is overdue when it is not (%s view)',
    (view) => {
      renderColumn([makeTask({ dueDate: '2026-12-01T00:00:00.000Z' })], view)

      expect(screen.queryByText(OVERDUE)).not.toBeInTheDocument()
    },
  )
})
