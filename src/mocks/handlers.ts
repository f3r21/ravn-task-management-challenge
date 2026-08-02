import type { RequestHandler } from 'msw'

/**
 * MSW handlers for the challenge API.
 *
 * The challenge's own endpoint (`syn-api-prod.herokuapp.com`) no longer exists —
 * it returns Heroku's "No such app" page — so these handlers stand in for it.
 * They are not a testing shortcut: the same handlers back the dev server and the
 * test suite, so there is one source of fake truth and the app's real client
 * code runs unchanged against both. Pointing `VITE_API_URL` at a live endpoint
 * bypasses them entirely.
 *
 * Query and mutation handlers arrive with the data layer in the next phase.
 */
export const handlers: RequestHandler[] = []
