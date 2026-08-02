import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/app'
import './styles/tokens.css'

/**
 * Starts the Service Worker before the first render whenever no live endpoint is
 * configured, so the app never briefly fires requests at nothing. `await` here is
 * the whole point — MSW's worker is not intercepting until its promise resolves.
 */
async function enableMockingIfNeeded(): Promise<void> {
  if (import.meta.env.VITE_API_URL) {
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
