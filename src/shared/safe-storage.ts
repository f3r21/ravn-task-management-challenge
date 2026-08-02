/**
 * The only place in the app that touches `localStorage`.
 *
 * Storage throws for real reasons — Safari private mode, quota exhaustion,
 * cookies disabled — so the handling lives here once instead of being
 * re-decided, and re-forgotten, at every call site.
 */

/**
 * Reads and parses a key, or returns `undefined` if it is missing, unparseable,
 * or storage is unavailable.
 *
 * `isValid` is optional but strongly encouraged: without it the parsed value is
 * cast to `T` on trust, which is the blind-assertion problem a type predicate
 * exists to solve. Persisted data is exactly where shape drift happens — last
 * release wrote a different shape and it is still sitting in the browser.
 */
export function readJson<T>(key: string, isValid?: (value: unknown) => value is T): T | undefined {
  let parsed: unknown
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) {
      return undefined
    }
    parsed = JSON.parse(raw)
  } catch (error) {
    console.error(`safe-storage: could not read "${key}":`, error)
    return undefined
  }

  if (isValid === undefined) {
    return parsed as T
  }
  return isValid(parsed) ? parsed : undefined
}

/**
 * Serialises and writes a value, reporting whether it landed.
 *
 * The boolean matters: a caller that advances its own state only on `true` will
 * not drift out of sync with what was actually persisted.
 */
export function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`safe-storage: could not write "${key}":`, error)
    return false
  }
}
