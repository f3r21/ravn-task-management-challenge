import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/app'
import { shouldStartMockWorker } from './lib/env'
import './styles/base.css'

/**
 * Starts the Service Worker before the first render whenever the app is serving
 * mocked data, so it never briefly fires requests at nothing. `await` here is the
 * whole point — MSW's worker is not intercepting until its promise resolves.
 *
 * The condition comes from `lib/env` rather than being re-derived here, so the
 * bootstrap and the client cannot disagree about whether the API is configured.
 *
 * **The MSW runtime is in the production bundle on purpose — do not "fix" that.**
 * `npm run build` emits a ~426 kB `browser-*.js` chunk holding this import, which
 * looks like a devDependency leaking into `dist`. Guarding it with
 * `import.meta.env.DEV` would statically remove it, and would also break the
 * thing the README leads with: that the app runs with no configuration. A
 * reviewer doing `npm run build && npm run preview` without a token needs this
 * chunk, and `shouldStartMockWorker` is a *runtime* check precisely so that
 * works. When the env IS configured at build time the branch never executes and
 * the chunk is never fetched — it is dead weight on disk, not on the wire, and
 * that is the right trade here.
 *
 * It is excluded by name from the bundle-size budget in CI for the same reason.
 */
async function enableMockingIfNeeded(): Promise<void> {
  if (!shouldStartMockWorker(import.meta.env)) {
    return
  }
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root is missing from index.html')
}

/**
 * Mount whatever happens to the mock worker.
 *
 * This was a bare `.then()`. A rejection from `worker.start()` therefore skipped
 * `render()` entirely and the app never mounted — a blank page with one line in the
 * console, and no error boundary to catch it because the boundary lives inside the tree
 * that was never created. Service workers need a secure context, so the ordinary way in
 * is `npm run preview -- --host` opened from a phone over plain HTTP, or a Firefox
 * private window; a missing `mockServiceWorker.js` does it too.
 *
 * Failing to mock is recoverable — the app falls through to whatever `VITE_API_URL`
 * says, and `BoardPage`'s own banner reports the mock state. Failing to mount is not.
 */
void enableMockingIfNeeded()
  .catch((cause: unknown) => {
    console.error('Mock worker did not start; continuing without it.', cause)
  })
  .finally(() => {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
