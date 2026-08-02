import type { RouteObject } from 'react-router'
import { BoardPage } from '@/features/board/board-page'
import { ProfilePage } from '@/features/profile/profile-page'
import { ErrorPage } from './error-page'
import { NotFoundPage } from './not-found-page'

/**
 * Exported as a plain array rather than a configured router so tests can mount
 * the real table in a memory router and navigate for real. Simulating
 * navigation by swapping components would not exercise the thing most likely to
 * break — the route matching itself.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <BoardPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/settings',
    element: <ProfilePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
