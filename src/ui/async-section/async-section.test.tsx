import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AsyncSection } from './async-section'

/**
 * The case these tests exist for is the *third* one, and it is the one the component
 * did not have.
 *
 * React Query reports `error` for a failed background refetch while `data` stays in the
 * cache, so `status` alone cannot separate "we never loaded" from "we loaded and the
 * refresh failed". The component rendered children only on `success`, so the second case
 * unmounted a board the reader was using — and `refetchOnWindowFocus` is on, which makes
 * a tab switch during a network blip the ordinary way in rather than an exotic one.
 */
const base = {
  loadingLabel: 'Loading tasks',
  readyLabel: '3 tasks loaded',
  errorTitle: 'Could not load the board',
  errorFallback: 'Please try again.',
  skeleton: <p>skeleton</p>,
  onRetry: vi.fn(),
}

describe('AsyncSection', () => {
  it('renders the skeleton while pending and no content', () => {
    render(
      <AsyncSection {...base} status="pending">
        <p>the board</p>
      </AsyncSection>,
    )
    expect(screen.getByText('skeleton')).toBeInTheDocument()
    expect(screen.queryByText('the board')).not.toBeInTheDocument()
  })

  it('renders content on success', () => {
    render(
      <AsyncSection {...base} status="success" hasData>
        <p>the board</p>
      </AsyncSection>,
    )
    expect(screen.getByText('the board')).toBeInTheDocument()
    expect(screen.queryByText('Could not load the board')).not.toBeInTheDocument()
  })

  it('shows the full error block when the failure left nothing to show', () => {
    render(
      <AsyncSection {...base} status="error" hasData={false}>
        <p>the board</p>
      </AsyncSection>,
    )
    expect(screen.getByText('Could not load the board')).toBeInTheDocument()
    expect(screen.queryByText('the board')).not.toBeInTheDocument()
  })

  it('KEEPS the content on screen when a refresh fails over data already loaded', () => {
    // The regression test. Before `hasData` this rendered the full-page error block and
    // dropped `the board` entirely, discarding cached tasks the reader was mid-way
    // through reading.
    render(
      <AsyncSection {...base} status="error" hasData>
        <p>the board</p>
      </AsyncSection>,
    )
    expect(screen.getByText('the board')).toBeInTheDocument()
  })

  it('still reports the failed refresh rather than hiding it', () => {
    // The other half, and the one that makes the case above safe: keeping stale data
    // silently would be worse than blanking it. The notice is an alert, and a retry is
    // offered — it is the placement that changes, not whether the failure is reported.
    render(
      <AsyncSection {...base} status="error" hasData errorFallback="Refresh failed.">
        <p>the board</p>
      </AsyncSection>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Refresh failed.')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    // and NOT the full-page treatment, which is what replaces the content
    expect(screen.queryByText('Could not load the board')).not.toBeInTheDocument()
  })
})
