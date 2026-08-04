import { useEffect, useState } from 'react'

/**
 * Follows `value`, but only settles after it has stopped changing for `delayMs`.
 *
 * Used on the search box so a request goes out per pause rather than per
 * keystroke. What is debounced is the *derived* value — the input itself stays
 * controlled and updates immediately, so typing never feels laggy. Debouncing
 * the input's own state instead is the classic mistake: characters appear late,
 * and the caret jumps when a stale value lands.
 *
 * The effect's cleanup cancels the pending timer, so a value that changes again
 * mid-delay restarts the wait instead of firing the previous one.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [settled, setSettled] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSettled(value)
    }, delayMs)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delayMs])

  return settled
}
