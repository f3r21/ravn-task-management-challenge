import { NavLink } from 'react-router'
import { cn } from '@/lib/cn'
import { GridViewIcon, ListViewIcon, LogoMark } from '@/ui/icons/icons'

interface NavItem {
  to: string
  label: string
  icon: typeof GridViewIcon
}

/** The destinations, in the order the design lists them. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: GridViewIcon },
  { to: '/settings', label: 'My task', icon: ListViewIcon },
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
                  isActive
                    ? 'text-interactive from-interactive/0 to-interactive/10 bg-gradient-to-r'
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
