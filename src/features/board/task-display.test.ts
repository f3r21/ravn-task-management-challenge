import { describe, expect, it } from 'vitest'
import { pointsLabel, pointValue, statusLabel, tagAccent, tagLabel } from './task-display'
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
  it('uses the two accents the design specifies', () => {
    expect(tagAccent('IOS')).toBe('green')
    expect(tagAccent('ANDROID')).toBe('amber')
  })

  it('resolves every remaining tag to a palette accent rather than undefined', () => {
    const accents = ALL_TAGS.map(tagAccent)

    expect(accents).toHaveLength(5)
    expect(accents.every((accent) => accent !== undefined)).toBe(true)
  })
})

describe('pointValue', () => {
  it('maps each estimate to its number', () => {
    expect(ALL_POINT_ESTIMATES.map(pointValue)).toEqual([0, 1, 2, 4, 8])
  })

  it('labels an estimate the way the card shows it', () => {
    expect(pointsLabel('FOUR')).toBe('4 Points')
    expect(pointsLabel('ZERO')).toBe('0 Points')
  })

  it('says "1 Point", not "1 Points"', () => {
    expect(pointsLabel('ONE')).toBe('1 Point')
  })
})
