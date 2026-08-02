import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { FilterTaskInput } from '@/graphql/generated/graphql'
import { useDebouncedValue } from '@/shared/use-debounced-value'
import { ALL_POINT_ESTIMATES, ALL_TAGS, BOARD_STATUSES } from './task-types'
import type { PointEstimate, Status, TaskTag } from './task-types'

/**
 * The board's filters, stored in the URL.
 *
 * Query parameters rather than component state, for reasons that all come from
 * the same place — the URL is the one piece of app state the browser already
 * knows how to manage. A filtered board can be linked to and bookmarked, the
 * back button steps through filter changes, and a reload does not silently
 * reset to "everything" while the controls still look set. It also means the
 * search box in the header and the filter bar over the board can share state
 * without either knowing the other exists.
 */

export interface BoardFilters {
  name: string
  status?: Status
  tags: TaskTag[]
  pointEstimate?: PointEstimate
  ownerId?: string
  dueDate?: string
}

/** Narrows a raw query-string value to a union member, or drops it. */
function readMember<T extends string>(raw: string | null, allowed: readonly T[]): T | undefined {
  // A hand-edited URL is untrusted input. Without this check `?status=nonsense`
  // would be sent to the API as a Status and rejected, turning a typo into an
  // error screen.
  return raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : undefined
}

export const SEARCH_DEBOUNCE_MS = 300

interface UseBoardFilters {
  /** What the controls display — updates immediately as the user types. */
  filters: BoardFilters
  /** What goes to the API — the name settles after typing pauses. */
  queryInput: FilterTaskInput
  setFilter: <K extends keyof BoardFilters>(key: K, value: BoardFilters[K]) => void
  clearAll: () => void
  isFiltered: boolean
}

export function useBoardFilters(): UseBoardFilters {
  const [params, setParams] = useSearchParams()

  const filters: BoardFilters = useMemo(
    () => ({
      name: params.get('name') ?? '',
      status: readMember(params.get('status'), BOARD_STATUSES),
      tags: (params.get('tags') ?? '')
        .split(',')
        .map((tag) => readMember(tag, ALL_TAGS))
        .filter((tag): tag is TaskTag => tag !== undefined),
      pointEstimate: readMember(params.get('points'), ALL_POINT_ESTIMATES),
      ownerId: params.get('owner') ?? undefined,
      dueDate: params.get('due') ?? undefined,
    }),
    [params],
  )

  const setFilter = useCallback<UseBoardFilters['setFilter']>(
    (key, value) => {
      const paramName = {
        name: 'name',
        status: 'status',
        tags: 'tags',
        pointEstimate: 'points',
        ownerId: 'owner',
        dueDate: 'due',
      }[key]

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

  return {
    filters,
    queryInput,
    setFilter,
    clearAll,
    isFiltered: Object.keys(queryInput).length > 0,
  }
}
