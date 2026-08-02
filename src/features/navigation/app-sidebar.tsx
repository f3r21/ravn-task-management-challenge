import { NavLink } from 'react-router'
import { cn } from '@/lib/cn'
import { GridViewIcon, ListViewIcon, LogoMark } from '@/ui/icons/icons'

interface NavItem {
  to: string
  label: string
  icon: typeof GridViewIcon
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: GridViewIcon },
  { to: '/settings', label: 'My task', icon: ListViewIcon },
]

/**
 * The sidebar.
 *
 * `NavLink` is what makes the active state real rather than decorative: it
 * derives from the current URL and sets `aria-current="page"`, so the highlight
 * cannot disagree with the route and assistive tech gets told which item is
 * current — something a hand-rolled `className` comparison silently skips.
 *
 * `end` on the dashboard link stops `/` matching every path, which is the
 * default behaviour for a `to="/"` link and would light up both items at once.
 */
export function AppSidebar() {
  return (
    <nav
      aria-label="Main"
      className="bg-surface-raised rounded-sidebar flex w-58 shrink-0 flex-col overflow-hidden py-3"
    >
      <LogoMark
        className="text-text-primary mx-auto size-10 shrink-0"
        role="img"
        aria-label="Ravn"
      />

      <ul className="mt-11 flex flex-col gap-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex h-14 w-full items-center gap-4 pl-4',
                  'text-body-m font-semibold uppercase',
                  isActive
                    ? 'text-brand from-brand/0 to-brand/10 bg-gradient-to-r'
                    : 'text-text-secondary hover:text-text-primary',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="size-6 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {/* The 4px marker at the right edge of the active tab. Always
                      rendered so the row's box model does not change when the
                      selection moves, which would shift the label by 4px. */}
                  <span
                    aria-hidden="true"
                    className={cn('bg-brand h-14 w-1', !isActive && 'invisible')}
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
