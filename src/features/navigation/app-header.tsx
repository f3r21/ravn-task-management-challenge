import { useId } from 'react'
import { useSearchParams } from 'react-router'
import { useProfile } from '@/features/profile/use-profile'
import { Avatar } from '@/ui/avatar/avatar'
import { BellIcon, SearchIcon } from '@/ui/icons/icons'

/**
 * The top bar: search on the left, notifications and the current user on the
 * right.
 *
 * Search writes straight to the URL's `name` parameter, which is where the board
 * reads its filters from. That is what lets a control in the app shell drive a
 * query on the page without either side importing the other, or a context
 * existing purely to carry one string.
 *
 * Figma draws the whole bar as one `<button>` containing the word "Search". That
 * is a mockup convention, not an instruction — this is a search field, so it is
 * an `<input type="search">`. A button would not accept typing and would have to
 * be replaced the moment search actually worked.
 *
 * The label is visually hidden rather than absent: the placeholder disappears as
 * soon as the user types, taking the field's only description with it.
 */
export function AppHeader() {
  const searchId = useId()
  // Same query key as the settings page, so the signed-in user is fetched once
  // and the two cannot disagree about who it is.
  const { data: profile } = useProfile()
  const [params, setParams] = useSearchParams()
  const value = params.get('name') ?? ''

  return (
    <header className="bg-surface-panel rounded-md flex items-center justify-between gap-6 px-6 py-3">
      <div className="flex flex-1 items-center gap-6">
        <SearchIcon className="text-muted size-6 shrink-0" />
        <label htmlFor={searchId} className="sr-only">
          Search tasks
        </label>
        <input
          id={searchId}
          type="search"
          placeholder="Search"
          value={value}
          onChange={(event) => {
            setParams(
              (current) => {
                const next = new URLSearchParams(current)
                if (event.target.value === '') {
                  next.delete('name')
                } else {
                  next.set('name', event.target.value)
                }
                return next
              },
              // Replace, so a back press leaves the board rather than retracing
              // the search one character at a time.
              { replace: true },
            )
          }}
          className="text-body-m placeholder:text-muted w-full min-w-0 flex-1 bg-transparent outline-none"
        />
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <button
          type="button"
          aria-label="Notifications"
          className="text-muted hover:text-main transition-colors"
        >
          <BellIcon className="size-6" />
        </button>
        <Avatar size={40} src={profile?.avatar} name={profile?.fullName} />
      </div>
    </header>
  )
}
