import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders, userEvent } from '@/test/test-utils'
import { ErrorPage } from './error-page'

describe('ErrorPage', () => {
  it('announces the failure so it is not a silent blank page', () => {
    renderWithProviders(<ErrorPage />)

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i)
  })

  it('shows a caller-supplied message in place of the default', () => {
    renderWithProviders(<ErrorPage message="We could not load your tasks." />)

    expect(screen.getByRole('alert')).toHaveTextContent('We could not load your tasks.')
  })

  it('offers no retry when the caller has no way to retry', () => {
    renderWithProviders(<ErrorPage />)

    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument()
  })

  it('calls onRetry when the retry button is pressed', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    renderWithProviders(<ErrorPage onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(onRetry).toHaveBeenCalledOnce()
  })
})
