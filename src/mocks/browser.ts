import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/** The Service Worker interceptor used by the dev server. */
export const worker = setupWorker(...handlers)
