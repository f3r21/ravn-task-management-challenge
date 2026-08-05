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
