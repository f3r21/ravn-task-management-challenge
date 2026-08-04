import type { RouteObject } from 'react-router'
import { BoardPage } from '@/features/board/board-page'
import { ProfilePage } from '@/features/profile/profile-page'
import { AppLayout } from './app-layout'
import { ErrorPage } from './error-page'
import { NotFoundPage } from './not-found-page'

/**
 * Exported as a plain array rather than a configured router so tests can mount
 * the real table in a memory router and navigate for real. Simulating
 * navigation by swapping components would not exercise the thing most likely to
 * break — the route matching itself.
 *
 * The shell is a layout wrapper around each element rather than a parent route
 * with an `<Outlet />`. A parent route would keep the shell mounted across
 * navigations, which is normally the point — but it would also keep the
 * not-found page inside a chrome that implies the app is fine.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AppLayout>
        <BoardPage />
      </AppLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/settings',
    element: (
      <AppLayout>
        <ProfilePage />
      </AppLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
