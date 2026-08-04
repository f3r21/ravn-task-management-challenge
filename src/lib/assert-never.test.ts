import { describe, expect, it } from 'vitest'
import { assertNever } from './assert-never'

type Status = 'open' | 'closed'

function label(status: Status): string {
  switch (status) {
    case 'open':
      return 'Open'
    case 'closed':
      return 'Closed'
    default:
      return assertNever(status, 'status')
  }
}

describe('assertNever', () => {
  it('is unreachable for every member of the union', () => {
    expect(label('open')).toBe('Open')
    expect(label('closed')).toBe('Closed')
  })

  it('throws with the offending value when data from outside the type system slips through', () => {
    // A server that starts returning a new status member is exactly how this
    // arm gets reached in production, so the cast here mimics reality rather
    // than manufacturing an impossible case.
    expect(() => label('archived' as Status)).toThrow(/Unhandled status: "archived"/)
  })
})
