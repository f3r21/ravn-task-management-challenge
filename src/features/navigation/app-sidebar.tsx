import { NavLink } from 'react-router'
import { cn } from '@/lib/cn'
import {
  AssigneeIcon,
  CalendarIcon,
  CommentIcon,
  GridViewIcon,
  ListViewIcon,
  LogoMark,
} from '@/ui/icons/icons'

interface NavItem {
  to: string
  label: string
  icon: typeof GridViewIcon
  /**
   * A destination §2 asks to exist without asking for anything behind it.
   * `routes.tsx` builds these routes from this very list, so a nav item cannot
   * end up pointing at a path with nothing there.
   */
  isPlaceholder?: boolean
}

/**
 * The destinations.
 *
 * The first two are the app; the rest are sample pages. §2 asks for "the list of
 * menu navigation items (most of them can navigate to a placeholder/sample
 * page)", which only makes sense with more items than the brief's six sections
 * build — a two-item menu is not a list most of which goes anywhere sample.
 *
 * Five in total, and the count is a constraint rather than a preference: below
 * the medium breakpoint this nav is a horizontal strip sharing one line with the
 * logo, and at 375px it runs out of room shortly after this. Anything added here
 * has to be checked at that width in a browser — jsdom evaluates no media
 * queries, so no test in this repo can see the strip layout at all.
 */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: GridViewIcon },
  { to: '/settings', label: 'My task', icon: ListViewIcon },
  { to: '/calendar', label: 'Calendar', icon: CalendarIcon, isPlaceholder: true },
  { to: '/team', label: 'Team', icon: AssigneeIcon, isPlaceholder: true },
  { to: '/messages', label: 'Messages', icon: CommentIcon, isPlaceholder: true },
]

/**
 * The app's navigation: a sidebar from the medium breakpoint up, a horizontal
 * strip above the content below it.
 *
 * One `<nav>` restyled, not two rendered conditionally. The obvious alternative —
 * hide this and repeat the links in the header for small screens — puts two
 * "Dashboard" links and two navigation landmarks in the document at once, which is
 * a worse thing to hand a screen reader than a sidebar that changes shape.
 *
 * Below the breakpoint the labels stay in the accessibility tree via `sr-only`
 * rather than being dropped: there is no room for the text at that width, but the
 * links still have to be announceable.
 *
 * `NavLink` is what makes the active state real rather than decorative: it derives
 * from the current URL and sets `aria-current="page"`, so the highlight cannot
 * disagree with the route and assistive tech gets told which item is current —
 * something a hand-rolled `className` comparison silently skips.
 *
 * `end` on the dashboard link stops `/` matching every path, which is the default
 * behaviour for a `to="/"` link and would light up every item at once.
 */
export function AppSidebar() {
  return (
    <nav
      aria-label="Main"
      className={cn(
        'bg-surface-panel rounded-lg flex shrink-0 overflow-hidden',
        'w-full flex-row items-center gap-4 px-4 py-3',
        'md:w-58 md:flex-col md:items-stretch md:gap-0 md:px-0',
      )}
    >
      <LogoMark className="text-main size-10 shrink-0 md:mx-auto" role="img" aria-label="Ravn" />

      <ul className="flex flex-row items-center gap-1 md:mt-11 md:flex-col md:items-stretch md:gap-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'inline-flex size-10 items-center justify-center',
                  'md:h-14 md:w-full md:justify-start md:gap-4 md:pl-4',
                  'text-body-m font-semibold uppercase',
                  // The ring is drawn inside the row rather than around it. These
                  // rows are full-bleed inside a `rounded-lg` nav that clips
                  // its overflow, so the default 2px *outside* offset puts the
                  // left and right strokes past the clip boundary and only the
                  // middle of the top and bottom survives — on the first two tab
                  // stops in the app.
                  'focus-visible:-outline-offset-2',
                  // `text-interactive-text`, not `text-interactive`. The kit
                  // documents `--color-interactive` (primary-4) as a fill and border
                  // colour, and it is one here too — the gradient and the active
                  // marker both use it and both only owe 3:1. As *text* on the
                  // sidebar's `surface-panel` it measures 3.51:1, and 3.17:1 at the
                  // gradient's own right-hand edge where the tint is densest.
                  // `interactive-text` (primary-2) is 6.67:1 and 6.02:1 there.
                  isActive
                    ? 'text-interactive-text from-interactive/0 to-interactive/10 bg-gradient-to-r'
                    : 'text-muted hover:text-main',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="size-6 shrink-0" />
                  {/* `sr-only` below the breakpoint rather than `hidden`: there is
                      no room for the text next to the icon at that width, but a
                      link with its only text content removed has no accessible
                      name at all. */}
                  <span className="sr-only md:not-sr-only md:flex-1">{label}</span>
                  {/* The 4px marker at the right edge of the active tab. Always
                      rendered so the row's box model does not change when the
                      selection moves, which would shift the label by 4px. It has
                      no meaning in the horizontal layout, where the row has no
                      right edge to sit against. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'bg-interactive hidden h-14 w-1 md:block',
                      !isActive && 'md:invisible',
                    )}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
