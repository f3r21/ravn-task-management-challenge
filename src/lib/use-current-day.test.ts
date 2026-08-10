import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurrentDay } from './use-current-day'

/**
 * The defect this hook exists for was invisible to every test in the suite, because it
 * only appears after the calendar day changes under a mounted component. `BoardColumn`
 * memoised its `now` on a prop production never passed, so "today" froze at the first
 * render and a board left open across midnight kept calling yesterday "Today".
 *
 * Both halves are asserted: that it *does* move when the day rolls over, and that it
 * does *not* move when it has not. The second matters as much — every card's props are
 * memoised on this value, so a hook that returned a fresh `Date` each tick would rebuild
 * the board once a minute and defeat the memoisation it was written to preserve.
 */
describe('useCurrentDay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the same Date object while the day has not changed', () => {
    vi.setSystemTime(new Date('2026-03-01T09:00:00.000Z'))
    const { result } = renderHook(() => useCurrentDay())
    const first = result.current

    // Ten ticks, all inside the same UTC day. Advancing the timers moves the fake clock
    // too, so starting at 23:59 would have crossed midnight and tested the opposite case.
    act(() => {
      vi.advanceTimersByTime(10 * 60_000)
    })

    // Identity, not equality: a new object with the same day would still re-render.
    expect(result.current).toBe(first)
  })

  it('returns a new Date once the UTC day rolls over', () => {
    vi.setSystemTime(new Date('2026-03-01T23:59:30.000Z'))
    const { result } = renderHook(() => useCurrentDay())
    const before = result.current

    act(() => {
      vi.setSystemTime(new Date('2026-03-02T00:00:30.000Z'))
      vi.advanceTimersByTime(60_000)
    })

    expect(result.current).not.toBe(before)
    expect(result.current.toISOString().slice(0, 10)).toBe('2026-03-02')
  })

  it('stops polling when unmounted', () => {
    vi.setSystemTime(new Date('2026-03-01T09:00:00.000Z'))
    const { unmount } = renderHook(() => useCurrentDay())

    unmount()

    // A leaked interval would keep calling setState on an unmounted hook.
    expect(vi.getTimerCount()).toBe(0)
  })
})
