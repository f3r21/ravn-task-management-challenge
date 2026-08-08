import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makeTask, makeUser } from '@/mocks/task-fixtures'
import { renderWithProviders, userEvent } from '@/test/test-utils'
import { BoardColumn } from './board-column'
import type { BoardView } from './board-toolbar'
import type { Task } from './task-types'

const now = new Date('2026-08-02T12:00:00.000Z')

function renderColumn(tasks: Task[], view: BoardView = 'grid') {
  return renderWithProviders(<BoardColumn status="TODO" tasks={tasks} view={view} now={now} />)
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
 * components now — the board through the kit, the list through `task-row.tsx` — and the
 * single-component `layout` switch that used to make them agree is gone. `to-kit-props.ts`
 * is what replaces it; this is where that shows up as behaviour.
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

  it.each<BoardView>(['grid', 'list'])(
    'says a task is unassigned rather than showing an empty avatar (%s view)',
    (view) => {
      renderColumn([makeTask({ assignee: null })], view)

      expect(screen.getByRole('img', { name: 'Unassigned' })).toBeInTheDocument()
    },
  )

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

  it('says a column is empty rather than leaving a blank gap', () => {
    renderColumn([])

    expect(screen.getByText(/no tasks here yet/i)).toBeInTheDocument()
  })
})

describe('the list view', () => {
  it('gives each row a heading and an article of its own', () => {
    renderColumn([makeTask({ name: 'Slack' })], 'list')

    expect(screen.getByRole('heading', { level: 2, name: 'Todo (01)' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Slack' })).toBeInTheDocument()
    expect(screen.getByRole('article')).toHaveAccessibleName('Slack')
  })

  it('spells the points out in full, which is what the kit’s own table does', () => {
    renderColumn([makeTask({ pointEstimate: 'FOUR' })], 'list')

    expect(screen.getByText('4 Points')).toBeInTheDocument()
  })

  it('renders no tag list at all when the task has no tags', () => {
    renderColumn([makeTask({ tags: [] })], 'list')

    // Scoped to the row: the column itself is a `<ul>` of rows, so an unscoped
    // `queryByRole('list')` finds that one and can never fail.
    const row = screen.getByRole('article')
    expect(within(row).queryByRole('list')).not.toBeInTheDocument()
    expect(within(row).getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  })

  it('uses the singular for a one-point task', () => {
    // The kit's card cannot do this — it renders "1 Pts" — which is ravn-ui-kit#94. The
    // row still can, so it does.
    renderColumn([makeTask({ pointEstimate: 'ONE' })], 'list')

    expect(screen.getByText('1 Point')).toBeInTheDocument()
  })
})

describe('the overdue state', () => {
  const overdue = [makeTask({ dueDate: '2026-07-20T00:00:00.000Z' })]

  /*
   * **Matched on the word alone, never on its punctuation.** Every assertion in this block
   * used to read `/\(overdue\)/`, keyed to the parenthesised form the app's own badge
   * emitted. `ravn-ui-kit#96` — the fix for the gap the tripwire below exists to watch —
   * announces `, overdue` instead, following the kit's house idiom ("Notifications, 3
   * unread"). No parentheses, so the old regex would have gone on matching nothing and the
   * tripwire would have stayed green at exactly the moment it was supposed to go red.
   *
   * A tripwire keyed to a format it does not control is not a tripwire. This is keyed to
   * the word, which is what actually has to be announced; only the due-date tag renders in
   * these trees, so it cannot match anything else.
   */
  const OVERDUE = /overdue/i

  it('is spelled out in the list view, instead of relying on colour alone', () => {
    renderColumn(overdue, 'list')

    expect(screen.getByText(OVERDUE)).toBeInTheDocument()
  })

  it('does not claim a task is overdue when it is not', () => {
    renderColumn([makeTask({ dueDate: '2026-12-01T00:00:00.000Z' })], 'list')

    expect(screen.queryByText(OVERDUE)).not.toBeInTheDocument()
  })

  it('is NOT yet spelled out on the board — tripwire for ravn-ui-kit#92', () => {
    /*
     * **This test asserts a defect, and it is meant to fail when the defect is fixed.**
     *
     * The kit's `TaskCard` renders the due date as a colour-coded `Tag` and nothing else;
     * `"overdue"` is rendered as a string zero times in `dist/index.js@v0.5.3`, which is
     * the tag this app installs. The app's own badge used to add an `sr-only` state, and
     * the board lost that on migration — the state is now carried by colour alone, which
     * is WCAG 2.2 1.4.1.
     *
     * The alternative was to fold the state into the app-supplied `dueDateText`, and that
     * was considered and rejected by the app's owner: "no quick fixes, we are migrating to
     * using the ui-kit". So the fix belongs in the kit, and it is filed as
     * ravn-ui-kit#92 — with ravn-ui-kit#96 open against it.
     *
     * Pinning the absence rather than deleting the assertion is what keeps this from
     * quietly becoming permanent. The moment the kit starts announcing the state, this
     * goes red — and that red is the instruction: delete this test, and let the two cases
     * above cover the board as well as the list.
     */
    renderColumn(overdue)

    expect(screen.queryByText(OVERDUE)).not.toBeInTheDocument()
    // The date itself is still there, so this is not passing because the tag vanished.
    expect(screen.getByText('20 July, 2026')).toBeInTheDocument()
  })
})
