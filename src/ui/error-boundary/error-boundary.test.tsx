import { screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders, userEvent } from '@/test/test-utils'
import { ErrorBoundary } from './error-boundary'

function Boom(): never {
  throw new Error('render failed')
}

function Fine() {
  return <p>content</p>
}

afterEach(() => {
  vi.restoreAllMocks()
})

/**
 * React logs caught errors to the console by design, and the boundary logs its
 * own. Silencing both keeps the run readable without hiding a real regression:
 * the assertions below still fail if the boundary stops catching.
 */
function silenceExpectedErrorLogs() {
  vi.spyOn(console, 'error').mockImplementation(() => {})
}

describe('ErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    renderWithProviders(
      <ErrorBoundary fallback={<p>fallback</p>}>
        <Fine />
      </ErrorBoundary>,
    )

    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('shows the fallback instead of unmounting the tree when a child throws', () => {
    silenceExpectedErrorLogs()

    renderWithProviders(
      <ErrorBoundary fallback={<p>fallback</p>}>
        <Boom />
      </ErrorBoundary>,
    )

    expect(screen.getByText('fallback')).toBeInTheDocument()
    expect(screen.queryByText('content')).not.toBeInTheDocument()
  })

  it('renders nothing at all when no fallback is supplied', () => {
    silenceExpectedErrorLogs()

    renderWithProviders(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )

    // Asserted as "no output from the boundary" rather than "empty container":
    // the provider stack renders a toast region alongside, which is not the
    // boundary's doing.
    expect(screen.queryByText('content')).not.toBeInTheDocument()
    expect(screen.queryByText('fallback')).not.toBeInTheDocument()
  })

  it('recovers when the caller changes the key, which is the only supported retry', async () => {
    silenceExpectedErrorLogs()
    const user = userEvent.setup()

    function Harness() {
      const [attempt, setAttempt] = useState(0)
      return (
        <>
          <button type="button" onClick={() => setAttempt((n) => n + 1)}>
            retry
          </button>
          <ErrorBoundary key={attempt} fallback={<p>fallback</p>}>
            {attempt === 0 ? <Boom /> : <Fine />}
          </ErrorBoundary>
        </>
      )
    }

    renderWithProviders(<Harness />)
    expect(screen.getByText('fallback')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'retry' }))

    expect(screen.getByText('content')).toBeInTheDocument()
    expect(screen.queryByText('fallback')).not.toBeInTheDocument()
  })
})
