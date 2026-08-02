import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from '@/test/test-utils'
import { ToastProvider, useToast } from './toast-context'

function Harness() {
  const toast = useToast()
  return (
    <>
      <button
        type="button"
        onClick={() => {
          toast.show('success', 'Saved')
        }}
      >
        succeed
      </button>
      <button
        type="button"
        onClick={() => {
          toast.show('error', 'Could not save')
        }}
      >
        fail
      </button>
    </>
  )
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('ToastProvider', () => {
  it('renders the live region before any toast exists', () => {
    render(
      <ToastProvider>
        <span />
      </ToastProvider>,
    )

    // The region has to be in the DOM up front: a live region only announces
    // changes to its contents, so mounting one that already contains text
    // announces nothing at all.
    expect(screen.getByRole('status', { name: /notifications/i })).toBeInTheDocument()
  })

  it('shows a message when one is raised', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'succeed' }))

    expect(screen.getByText('Saved')).toBeInTheDocument()
  })

  it('puts the message inside the live region, not merely on the page', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'fail' }))

    const region = screen.getByRole('status', { name: /notifications/i })
    expect(region).toHaveTextContent('Could not save')
  })

  it('stacks several messages rather than replacing the previous one', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'succeed' }))
    await user.click(screen.getByRole('button', { name: 'fail' }))

    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Could not save')).toBeInTheDocument()
  })

  it('dismisses a message on its own so the corner does not fill up', () => {
    vi.useFakeTimers()
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    )

    // `fireEvent` rather than `user-event` here: user-event waits on real timers
    // between the pointer events it simulates, so under fake timers it never
    // resolves. The behaviour under test is the auto-dismiss, not the click.
    fireEvent.click(screen.getByRole('button', { name: 'succeed' }))
    expect(screen.getByText('Saved')).toBeInTheDocument()

    // Wrapped in `act` because advancing the timer is what triggers the state
    // update that removes the toast; outside it, the assertion runs before
    // React has re-rendered. `waitFor` cannot help here — with fake timers
    // installed, its own polling never advances.
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })
})

describe('useToast', () => {
  it('throws outside a provider rather than silently doing nothing', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // A no-op would mean mutations reporting into the void, noticed only when
    // someone wondered why they never see confirmations.
    expect(() => render(<Harness />)).toThrow(/must be used within a ToastProvider/)
  })
})
