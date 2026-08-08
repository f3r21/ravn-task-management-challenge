import { Avatar, Skeleton, TopNav } from '@ravn/ui-kit'
import { useBoardFilters } from '@/features/board/use-board-filters'
import { useProfile } from '@/features/profile/use-profile'
import { avatarSrcUnlessDecommissioned } from '@/lib/decommissioned-avatar'

/**
 * The top bar: search on the left, notifications and the current user on the right.
 *
 * `@ravn/ui-kit`'s `TopNav` draws it, including the `SearchBar` inside it. What stays here is
 * the wiring the kit cannot know about, and each piece is load-bearing:
 *
 * **Search writes to the URL, and there is still no local state in this file.** The input's
 * value *is* `?name=`, written on every keystroke; the 300ms debounce lives downstream in
 * `useBoardFilters`, not here. `TopNav` is properly controlled when given a `searchValue`, so
 * that survives the migration — it keeps its own state only when the prop is `undefined`,
 * which would have silently introduced a second source of truth for the same string.
 *
 * Through the board's own `setFilter` rather than a `useSearchParams` write of its own. The
 * two used to be independent: this file hardcoded the string `'name'` and serialised the
 * parameter itself, `useBoardFilters` mapped and serialised the same key again, and renaming
 * it on either side would have disconnected the search box from the board with no type error
 * and nothing failing. One writer, so the spelling cannot diverge. The hook is called with no
 * directory, which is correct here — the header reads only `filters.name`.
 *
 * **`searchLabel` is passed rather than defaulted.** The kit's default is `'Search'`; this app
 * says "Search tasks", which is the difference between a field that could be searching
 * anything and one a screen-reader user can place. That prop exists because this app asked for
 * it — before `ravn-ui-kit#13` the string was hardcoded and unreachable.
 *
 * **`userSlot` rather than `userName`/`userAvatar`**, because those two cannot express a third
 * state and this header has one. A pending profile renders a placeholder rather than initials,
 * so nothing is asserted about who is signed in before the answer arrives; a *failed* profile
 * must not fall back to `Avatar`'s "Unassigned", which is the right word for a task nobody owns
 * and a lie about the signed-in user. Both are the same reason `BoardPage` reads `status` as
 * well as `data`: pending and failed both leave `data` undefined, and rendering them alike is a
 * silent degradation nobody reports because nobody can see it.
 *
 * **The bell is decorative now, and that is adopting the kit's model rather than losing
 * something.** This file used to render a real `<button aria-label="Notifications">` that did
 * nothing — a keyboard stop leading nowhere, announced as an affordance that did not exist.
 * The kit renders the bell as a button only when given `onNotificationsClick`, on the stated
 * reasoning that *"a button that does nothing is its own defect"*, and as a plain `<span>`
 * otherwise. There is no notifications feature to wire, so no handler is passed. Same shape as
 * the board adopting the kit's `TaskCard`, which deliberately dropped a `role="button"` this
 * app had.
 *
 * **The clear button is new**, and it is a real tab stop between the input and the bell that
 * did not exist before — it appears only while the field has a value. Worth knowing when
 * reading the keyboard-order assertions in `app-header.test.tsx`.
 */
export function AppHeader() {
  // Same query key as the settings page, so the signed-in user is fetched once and the two
  // cannot disagree about who it is.
  const { data: profile, status: profileStatus } = useProfile()
  const { filters, setFilter } = useBoardFilters()

  return (
    <TopNav
      searchValue={filters.name}
      // `setFilter` drops the parameter when the value is empty and replaces rather than
      // pushes, so a back press leaves the board instead of retracing the search one
      // character at a time. The kit hands over the value itself, not an event.
      onSearchChange={(name) => {
        setFilter('name', name)
      }}
      searchLabel="Search tasks"
      searchPlaceholder="Search"
      userSlot={
        profileStatus === 'pending' ? (
          // No live region here: the header is chrome, and announcing its avatar would
          // interrupt whatever the page itself is saying.
          <Skeleton className="size-10 shrink-0 rounded-full" />
        ) : (
          <Avatar
            size="md"
            // Every avatar the live API serves points at a decommissioned host that answers
            // 410 with a valid SVG, so the `<img>` fires `load` and renders a placeholder —
            // see `lib/decommissioned-avatar.ts`. Dropped here so the initials path takes over.
            src={avatarSrcUnlessDecommissioned(profile?.avatar)}
            name={profile?.fullName ?? 'Could not load your profile'}
          />
        )
      }
    />
  )
}
