import { describe, expect, it } from 'vitest'
import { makeTask, makeUser } from '@/mocks/task-fixtures'
import { KIT_FIELD_NAMES, toKitCardProps, toKitTableRowProps } from './to-kit-props'

const now = new Date('2026-08-02T12:00:00.000Z')

describe('toKitCardProps', () => {
  it('spells the point estimate out as a number, leaving the wording to the kit', () => {
    expect(toKitCardProps(makeTask({ pointEstimate: 'EIGHT' }), now).points).toBe(8)
  })

  it('names the due date rather than dating it when it is today', () => {
    const props = toKitCardProps(makeTask({ dueDate: '2026-08-02T00:00:00.000Z' }), now)

    expect(props.dueDateText).toBe('Today')
    expect(props.dueDateUrgency).toBe('soon')
  })

  it('passes the app tone straight through as the kit urgency, with no map between', () => {
    // The kit renamed its `warning` to `soon` to match this app's `DueDateTone`, so the
    // two vocabularies are now one. If either side renames a member the assignment in
    // `taskPresentation` stops compiling — this pins the *values* so a rename that somehow
    // typechecks still fails.
    const overdue = toKitCardProps(makeTask({ dueDate: '2026-07-20T00:00:00.000Z' }), now)
    const later = toKitCardProps(makeTask({ dueDate: '2026-12-01T00:00:00.000Z' }), now)

    expect(overdue.dueDateUrgency).toBe('overdue')
    expect(later.dueDateUrgency).toBe('normal')
  })

  it('omits the due date entirely when the API sends something unparseable', () => {
    const props = toKitCardProps(makeTask({ dueDate: 'nonsense' }), now)

    // `undefined`, not the string "Invalid Date": the kit hides its due-date tag when
    // `dueDateText` is absent, and renders whatever string it is given otherwise.
    expect(props.dueDateText).toBeUndefined()
    expect(props.dueDateUrgency).toBe('normal')
  })

  it('carries each tag across in the kit’s own accent vocabulary', () => {
    const props = toKitCardProps(
      makeTask({ tags: ['IOS', 'ANDROID', 'REACT', 'RAILS', 'NODE_JS'] }),
      now,
    )

    expect(props.tags).toEqual([
      { label: 'iOS app', variant: 'neutral' },
      { label: 'Android', variant: 'green' },
      { label: 'React', variant: 'blue' },
      { label: 'Rails', variant: 'red' },
      { label: 'Node js', variant: 'yellow' },
    ])
  })

  it('drops an avatar pointing at the decommissioned host, so initials take over', () => {
    // The guard used to live in the card's JSX and now lives in the adapter, which is the
    // one place a `User.avatar` becomes component props. `avatars.dicebear.com` answers
    // 410 with a valid SVG, so the browser decodes it and fires `load` — nothing
    // downstream can detect the failure, and the kit's `Avatar` would render the
    // grey-and-red placeholder rather than falling back.
    const props = toKitCardProps(
      makeTask({
        assignee: makeUser({
          fullName: 'Priya Nair',
          avatar: 'https://avatars.dicebear.com/api/initials/pn.svg',
        }),
      }),
      now,
    )

    expect(props.assigneeAvatar).toBeUndefined()
    expect(props.assigneeName).toBe('Priya Nair')
  })

  it('keeps a real avatar, since only the one dead host is discarded', () => {
    const props = toKitCardProps(
      makeTask({
        assignee: makeUser({ avatar: 'https://cdn.ravn.co/avatars/priya.png' }),
      }),
      now,
    )

    expect(props.assigneeAvatar).toBe('https://cdn.ravn.co/avatars/priya.png')
  })

  it('never passes meta badges, so the kit cannot announce counters nothing backs', () => {
    // The counters were hardcoded 5 and 3 with no schema fields behind them. The kit
    // renders every badge's label into an `sr-only` node since kit#19, so passing them
    // would read invented numbers aloud — see ravn-ui-kit#93.
    expect(toKitCardProps(makeTask(), now).metaBadges).toBeUndefined()
  })

  it('leaves the card title a heading rather than a button', () => {
    // Providing `onClick` is what makes the kit render the title as a `<button>`. The app
    // has no click-to-open card, so omitting it keeps the plain heading it renders today.
    expect(toKitCardProps(makeTask(), now).onClick).toBeUndefined()
  })
})

describe('toKitTableRowProps', () => {
  it('turns off the row’s select checkbox, which is sr-only rather than merely invisible', () => {
    // Left on, every row would put a checkbox in the accessibility tree — announced,
    // tabbable, and wired to nothing, since the app has no bulk-selection feature.
    expect(toKitTableRowProps(makeTask(), now, { index: 1 }).isSelectable).toBe(false)
  })

  it('carries the row’s position, which the kit zero-pads for display', () => {
    expect(toKitTableRowProps(makeTask(), now, { index: 3 }).index).toBe(3)
  })

  it.each([
    ['BACKLOG', 'neutral'],
    ['TODO', 'neutral'],
    ['IN_PROGRESS', 'yellow'],
    ['DONE', 'green'],
    ['CANCELLED', 'red'],
  ] as const)('maps status %s to indicator colour %s', (status, indicatorColor) => {
    // Kit v0.9.0 stopped defaulting `indicatorColor` to `'green'` (kit#141), so every row
    // used to render the same stripe regardless of status. This pins the actual mapping
    // rather than just that *some* value is passed.
    expect(toKitTableRowProps(makeTask({ status }), now, { index: 1 }).indicatorColor).toBe(
      indicatorColor,
    )
  })
})

describe('the two views cannot drift', () => {
  /*
   * The board and the list view used to be one component with a `layout` switch, so they
   * could not show different information. The kit splits them into two components with two
   * prop vocabularies, and this is what replaces that guarantee.
   *
   * `KIT_FIELD_NAMES` is `satisfies Record<keyof TaskPresentation, …>`, so a field added to
   * the presentation without an entry here fails to compile. This walks the entries and
   * proves both outputs actually carry the value — which is the half a type cannot state.
   *
   * A task with every field populated, because a field that is `undefined` on both sides
   * agrees vacuously and would let a genuinely missing wire-up pass.
   */
  const task = makeTask({
    name: 'Slack',
    pointEstimate: 'FOUR',
    dueDate: '2026-08-02T00:00:00.000Z',
    tags: ['IOS', 'RAILS'],
    assignee: makeUser({ fullName: 'Priya Nair', avatar: 'https://cdn.ravn.co/a.png' }),
  })

  const card = toKitCardProps(task, now)
  const row = toKitTableRowProps(task, now, { index: 1 })

  it.each(Object.entries(KIT_FIELD_NAMES))(
    'shows the same %s in both views',
    (_field, { card: cardName, row: rowName }) => {
      expect(card[cardName]).toEqual(row[rowName])
    },
  )

  it('populates every shared field, so none of the comparisons above passes vacuously', () => {
    // Without this, deleting the body of `taskPresentation` would leave every field
    // `undefined` on both sides and every case above still green — the "measurement that
    // reaches no decision" shape. This is the positive control for the whole block.
    for (const { card: cardName } of Object.values(KIT_FIELD_NAMES)) {
      expect(card[cardName]).toBeDefined()
    }
  })
})
