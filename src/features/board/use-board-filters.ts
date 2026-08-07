import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { FilterTaskInput } from '@/graphql/generated/graphql'
import { useDebouncedValue } from '@/shared/use-debounced-value'
import { ALL_POINT_ESTIMATES, ALL_TAGS, BOARD_STATUSES } from './task-types'
import type { PointEstimate, Status, TaskTag } from './task-types'

/**
 * The board's filters, stored in the URL.
 *
 * Query parameters rather than component state, for reasons that all come from the
 * same place — the URL is the one piece of app state the browser already knows how to
 * manage. A filtered board can be linked to and bookmarked, and a reload does not
 * silently reset to "everything" while the controls still look set. It also means the
 * search box in the header and the filter bar over the board can share state without
 * either knowing the other exists.
 *
 * It does *not* give the back button a step per filter change: every write below is a
 * `replace`, deliberately, so one press leaves the board rather than retracing each
 * keystroke. Said here because the opposite was claimed for a while, eighty lines
 * above the code that rules it out.
 */

export interface BoardFilters {
  name: string
  status?: Status
  tags: TaskTag[]
  pointEstimate?: PointEstimate
  ownerId?: string
  dueDate?: string
}

/**
 * The URL key each filter is stored under — the one place either side may name them.
 *
 * The header's search box writes the same `name` parameter the board reads, and for a
 * while it did so with its own hardcoded string and its own `URLSearchParams` write.
 * Renaming the key on either side would have silently disconnected the two: no type
 * error, and every test still passing against whichever half it happened to exercise.
 * The header now goes through `setFilter`, so there is one writer, and the read below
 * comes from this record, so there is one spelling.
 */
export const FILTER_PARAMS = {
  name: 'name',
  status: 'status',
  tags: 'tags',
  pointEstimate: 'points',
  ownerId: 'owner',
  dueDate: 'due',
} as const satisfies Record<keyof BoardFilters, string>

/**
 * Whether the people directory has arrived yet.
 *
 * `'pending'` is genuinely "not known yet"; `'ready'` is "this is the whole list",
 * whether it came back full, empty, or not at all. See `readOwner`.
 */
export type DirectoryStatus = 'pending' | 'ready'

/** Narrows a raw query-string value to a union member, or drops it. */
function readMember<T extends string>(raw: string | null, allowed: readonly T[]): T | undefined {
  // A hand-edited URL is untrusted input. Without this check `?status=nonsense`
  // would be sent to the API as a Status and rejected, turning a typo into an
  // error screen.
  return raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : undefined
}

/**
 * Narrows a raw query-string value to a `yyyy-MM-dd` date, or drops it.
 *
 * The same guard the enums get, and it was missing: `?due=nonsense` was concatenated
 * straight into `nonsenseT00:00:00.000Z` and sent as a `DateTime`, so the API rejected
 * the whole request. The shape check alone is not enough — `2026-99-99` has the right
 * shape and is not a date — so the parsed value has to agree with what was written.
 */
function readDate(raw: string | null): string | undefined {
  if (raw === null || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return undefined
  }
  const parsed = new Date(`${raw}T00:00:00.000Z`)
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== raw
    ? undefined
    : raw
}

/**
 * Narrows a raw owner id to one the directory knows, or drops it.
 *
 * While the directory is still loading the id is kept: the alternative is a first
 * request without the filter followed by a second with it, which is a visible
 * flicker in exchange for nothing. Once the list has arrived an id that is not in
 * it is dropped, the same as a bad enum.
 *
 * "Still loading" is the caller's `directoryStatus`, not an inference from an empty
 * `knownIds`. It used to be the latter, and a *failed* `Users` query is permanently
 * empty too — indistinguishable from loading — so one failed request put this
 * function into pass-through for the rest of the session and `?owner=<anything>`
 * went to the API unchecked. That is precisely what `readDate` above exists to stop.
 */
function readOwner(
  raw: string | null,
  knownIds: readonly string[],
  directoryStatus: DirectoryStatus,
): string | undefined {
  if (raw === null || raw === '') {
    return undefined
  }
  return directoryStatus === 'pending' || knownIds.includes(raw) ? raw : undefined
}

export const SEARCH_DEBOUNCE_MS = 300

/**
 * The default directory: empty, and the *same* empty every time.
 *
 * A module constant rather than a `= []` literal in the signature below, because
 * a default parameter is evaluated afresh on every call — so an inline `[]` is a
 * new array identity per render, and `filters` depends on it, so that memo could
 * never hit. `AppHeader` calls this hook with no directory at all, which made it
 * every render of the app shell: one wasted recompute per keystroke typed into
 * the very search box this hook exists to serve.
 */
const NO_KNOWN_OWNERS: readonly string[] = []

interface UseBoardFilters {
  /** What the controls display — updates immediately as the user types. */
  filters: BoardFilters
  /** What goes to the API — the name settles after typing pauses. */
  queryInput: FilterTaskInput
  setFilter: <K extends keyof BoardFilters>(key: K, value: BoardFilters[K]) => void
  clearAll: () => void
  /** Whether the *user* has set a filter — see below for why not `queryInput`. */
  isFiltered: boolean
}

/**
 * @param knownOwnerIds the directory's ids, once it has arrived.
 * @param directoryStatus whether it has. Defaults to `'ready'`, the strict reading:
 *   a caller that does not know about the directory should not be the one letting an
 *   unvalidated owner id through.
 */
export function useBoardFilters(
  knownOwnerIds: readonly string[] = NO_KNOWN_OWNERS,
  directoryStatus: DirectoryStatus = 'ready',
): UseBoardFilters {
  const [params, setParams] = useSearchParams()

  const filters: BoardFilters = useMemo(
    () => ({
      name: params.get(FILTER_PARAMS.name) ?? '',
      status: readMember(params.get(FILTER_PARAMS.status), BOARD_STATUSES),
      tags: (params.get(FILTER_PARAMS.tags) ?? '')
        .split(',')
        .map((tag) => readMember(tag, ALL_TAGS))
        .filter((tag): tag is TaskTag => tag !== undefined),
      pointEstimate: readMember(params.get(FILTER_PARAMS.pointEstimate), ALL_POINT_ESTIMATES),
      ownerId: readOwner(params.get(FILTER_PARAMS.ownerId), knownOwnerIds, directoryStatus),
      dueDate: readDate(params.get(FILTER_PARAMS.dueDate)),
    }),
    [params, knownOwnerIds, directoryStatus],
  )

  const setFilter = useCallback<UseBoardFilters['setFilter']>(
    (key, value) => {
      const paramName = FILTER_PARAMS[key]

      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          const serialised = Array.isArray(value) ? value.join(',') : (value ?? '')

          if (serialised === '') {
            // Removed rather than left empty: `?status=` in the address bar
            // reads as a filter that is set, and it would survive a copy-paste.
            next.delete(paramName)
          } else {
            next.set(paramName, String(serialised))
          }
          return next
        },
        // Filter changes replace the entry rather than pushing a new one, so a
        // single back press leaves the board instead of retracing every
        // keystroke.
        { replace: true },
      )
    },
    [setParams],
  )

  const clearAll = useCallback(() => {
    setParams(new URLSearchParams(), { replace: true })
  }, [setParams])

  const debouncedName = useDebouncedValue(filters.name, SEARCH_DEBOUNCE_MS)

  /**
   * The filter object sent to the API.
   *
   * Empty values are omitted entirely rather than sent as `null`: the query key
   * is derived from this object, so `{ name: '' }` and `{}` would be two cache
   * entries for the same board.
   */
  const queryInput: FilterTaskInput = useMemo(
    () => ({
      ...(debouncedName.trim() !== '' && { name: debouncedName.trim() }),
      ...(filters.status && { status: filters.status }),
      ...(filters.tags.length > 0 && { tags: filters.tags }),
      ...(filters.pointEstimate && { pointEstimate: filters.pointEstimate }),
      ...(filters.ownerId && { ownerId: filters.ownerId }),
      ...(filters.dueDate && { dueDate: `${filters.dueDate}T00:00:00.000Z` }),
    }),
    [
      debouncedName,
      filters.status,
      filters.tags,
      filters.pointEstimate,
      filters.ownerId,
      filters.dueDate,
    ],
  )

  /**
   * Whether anything is filtered, from what the user set rather than from what is
   * currently in flight.
   *
   * Both consumers — the "Clear filters" button and the choice of empty state — are
   * answering "has the user narrowed this board", not "is the request that is out
   * right now narrowed". Derived from `queryInput`, as it was, they inherited the
   * search debounce: for 300ms after the first keystroke the board had a filter the
   * user could neither see acknowledged nor clear, and an empty result read as
   * "no tasks yet".
   */
  const isFiltered =
    filters.name.trim() !== '' ||
    filters.status !== undefined ||
    filters.tags.length > 0 ||
    filters.pointEstimate !== undefined ||
    filters.ownerId !== undefined ||
    filters.dueDate !== undefined

  return {
    filters,
    queryInput,
    setFilter,
    clearAll,
    isFiltered,
  }
}
