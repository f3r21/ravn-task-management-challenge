import { describe, expect, it } from 'vitest'
import { pointsLabel, pointValue, statusLabel, tagAccent, tagLabel } from './task-display'
import { BOARD_STATUSES, PointEstimate, type Status, TaskTag } from './task-types'

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
    expect(Object.values(TaskTag).map(tagLabel)).toEqual([
      'Android',
      'iOS app',
      'Node js',
      'Rails',
      'React',
    ])
  })
})

describe('tagAccent', () => {
  it('uses the two accents the design specifies', () => {
    expect(tagAccent(TaskTag.Ios)).toBe('green')
    expect(tagAccent(TaskTag.Android)).toBe('amber')
  })

  it('resolves every remaining tag to a palette accent rather than undefined', () => {
    const accents = Object.values(TaskTag).map(tagAccent)

    expect(accents).toHaveLength(5)
    expect(accents.every((accent) => accent !== undefined)).toBe(true)
  })
})

describe('pointValue', () => {
  it('maps each estimate to its number', () => {
    expect(Object.values(PointEstimate).map(pointValue)).toEqual([0, 1, 2, 4, 8])
  })

  it('labels an estimate the way the card shows it', () => {
    expect(pointsLabel(PointEstimate.Four)).toBe('4 Points')
    expect(pointsLabel(PointEstimate.Zero)).toBe('0 Points')
  })
})
