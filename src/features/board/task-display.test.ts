import { describe, expect, it } from 'vitest'
import { effortLabel, pointValue, statusLabel, tagAccent, tagLabel } from './task-display'
import { ALL_POINT_ESTIMATES, ALL_TAGS, BOARD_STATUSES, type Status } from './task-types'

describe('statusLabel', () => {
  it('gives every board status a human label', () => {
    expect(BOARD_STATUSES.map(statusLabel)).toEqual([
      'Backlog',
      'Todo',
      'In Progress',
      'Done',
      'Cancelled',
    ])
  })

  it('throws rather than rendering a raw enum if the API adds a status', () => {
    expect(() => statusLabel('ARCHIVED' as Status)).toThrow(/Unhandled status/)
  })
})

describe('tagLabel', () => {
  it('labels every tag in natural case, so text queries and screen readers work', () => {
    expect(ALL_TAGS.map(tagLabel)).toEqual(['Android', 'iOS app', 'Node js', 'Rails', 'React'])
  })
})

describe('tagAccent', () => {
  it('assigns each tag the accent the design gives it', () => {
    // **One table rather than two tests, because the pair it replaces left three of the
    // five assigned nowhere.** The first pinned `IOS` and `ANDROID`; the second mapped all
    // five and asserted `accents.every((a) => a !== undefined)` — which asserts that
    // TypeScript works. `tagAccent` returns `AccentColor`, `undefined` is not in that
    // union, and the `switch` closes with `assertNever`, so the only way to produce
    // `undefined` is a value the compiler already rejects.
    //
    // What that cost: `REACT`, `RAILS` and `NODE_JS` were asserted by nothing, so swapping
    // any two of them left the suite green. This is the shape `statusLabel`'s test and
    // `pointValue`'s already use — the whole mapping, in order, in one comparison.
    // In `ALL_TAGS` order — ANDROID, IOS, NODE_JS, RAILS, REACT — the same shape
    // `tagLabel`'s test above uses, so the two read alike.
    expect(ALL_TAGS.map(tagAccent)).toEqual(['green', 'neutral', 'yellow', 'red', 'blue'])
  })
})

describe('pointValue', () => {
  it('maps each estimate to its number', () => {
    expect(ALL_POINT_ESTIMATES.map(pointValue)).toEqual([0, 1, 2, 4, 8])
  })
})

describe('effortLabel', () => {
  it('writes every effort value as "Effort N", 0 and 1 included', () => {
    expect(ALL_POINT_ESTIMATES.map(pointValue).map(effortLabel)).toEqual([
      'Effort 0',
      'Effort 1',
      'Effort 2',
      'Effort 4',
      'Effort 8',
    ])
  })
})
