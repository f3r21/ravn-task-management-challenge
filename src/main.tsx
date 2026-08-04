import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/app'
import { shouldStartMockWorker } from './lib/env'
import './styles/tokens.css'

/**
 * Starts the Service Worker before the first render whenever the app is serving
 * mocked data, so it never briefly fires requests at nothing. `await` here is the
 * whole point — MSW's worker is not intercepting until its promise resolves.
 *
 * The condition comes from `lib/env` rather than being re-derived here, so the
 * bootstrap and the client cannot disagree about whether the API is configured.
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

void enableMockingIfNeeded().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
