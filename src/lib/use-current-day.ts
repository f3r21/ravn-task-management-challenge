import { useEffect, useState } from 'react'
import { toDateInputValue } from './due-date'

/**
 * `new Date()`, refreshed when the UTC calendar day changes and not before.
 *
 * The board's due-date badges are day-granular: `dueDateTone` and `formatDueDate` both
 * compare calendar days, so "Today", "Tomorrow" and the overdue red are all decided by
 * which UTC day it is. `BoardColumn` memoised its `now` on a prop nothing passed in
 * production, which froze that answer at the first render for the whole tab session —
 * a board left open across midnight kept calling yesterday "Today" and a task that had
 * just become overdue stayed neutral, silently wrong until someone reloaded.
 *
 * **The identity of the returned `Date` is load-bearing.** Every card's props are
 * memoised on it, so returning a fresh object each tick would rebuild the whole board
 * once a minute and defeat the memoisation the column was written around. This returns
 * the *same* object until the day actually rolls over, so the common case costs one
 * comparison a minute and no re-render at all.
 *
 * The poll is a minute rather than a timer set to midnight on purpose: a `setTimeout`
 * of that length is not reliable across a laptop sleeping through the boundary, which
 * is precisely the case this exists for.
 */
export function useCurrentDay(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => {
      setNow((current) =>
        toDateInputValue(current) === toDateInputValue(new Date()) ? current : new Date(),
      )
    }, 60_000)
    return () => {
      clearInterval(id)
    }
  }, [])

  return now
}
