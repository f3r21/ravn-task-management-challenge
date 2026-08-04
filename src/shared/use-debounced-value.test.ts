import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './use-debounced-value'

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebouncedValue', () => {
  it('returns the initial value straight away, so nothing renders empty first', () => {
    const { result } = renderHook(() => useDebouncedValue('slack', 300))

    expect(result.current).toBe('slack')
  })

  it('holds the previous value until the delay has passed', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('ab')
  })

  it('restarts the wait when the value changes again mid-delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    rerender({ value: 'abc' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // 400ms total, but only 200ms since the last change — still waiting. Without
    // the cleanup cancelling the first timer, 'ab' would have landed here.
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('abc')
  })

  it('settles only on the final value after a burst of changes', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: '' },
    })

    for (const value of ['s', 'sl', 'sla', 'slac', 'slack']) {
      rerender({ value })
      act(() => {
        vi.advanceTimersByTime(50)
      })
    }
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('slack')
  })
})
