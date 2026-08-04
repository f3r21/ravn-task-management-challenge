import { useId } from 'react'
import { Avatar } from '@/ui/avatar/avatar'
import { BellIcon, SearchIcon } from '@/ui/icons/icons'

interface AppHeaderProps {
  /** Bound to the search field in the phase that adds filtering. */
  searchValue?: string
  onSearchChange?: (value: string) => void
}

/**
 * The top bar: search on the left, notifications and the current user on the
 * right.
 *
 * Figma draws the whole bar as one `<button>` with the word "Search" inside it.
 * That is a mockup convention, not an instruction — this is a search field, so
 * it is an `<input type="search">`. A button would not accept typing, would not
 * be reachable the way users expect, and would have to be swapped out entirely
 * once search actually works.
 *
 * The label is visually hidden rather than absent. The placeholder disappears as
 * soon as the user types, taking the field's only description with it.
 */
export function AppHeader({ searchValue, onSearchChange }: AppHeaderProps) {
  const searchId = useId()

  return (
    <header className="bg-surface-raised rounded-bar flex items-center justify-between gap-6 px-6 py-3">
      <div className="flex flex-1 items-center gap-6">
        <SearchIcon className="text-text-secondary size-6 shrink-0" />
        <label htmlFor={searchId} className="sr-only">
          Search tasks
        </label>
        <input
          id={searchId}
          type="search"
          placeholder="Search"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="text-body-m placeholder:text-text-secondary w-full min-w-0 flex-1 bg-transparent outline-none"
        />
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <button
          type="button"
          aria-label="Notifications"
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <BellIcon className="size-6" />
        </button>
        <Avatar size={40} name="Fernando Ramirez" />
      </div>
    </header>
  )
}
