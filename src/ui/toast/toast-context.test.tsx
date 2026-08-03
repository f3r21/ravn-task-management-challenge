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
  it('renders no notification region until there is something in it', () => {
    render(
      <ToastProvider>
        <span />
      </ToastProvider>,
    )

    // The region is a landmark. Mounting it empty gives a screen-reader user a
    // destination that contains nothing.
    //
    // The old hand-rolled version had to stay mounted for the opposite reason: an
    // `aria-live` region only announces *changes* to its contents, so one that
    // arrives with text already inside says nothing. React Aria's toasts do not
    // depend on that — each carries its own `role="alert"` content and is revealed
    // in two phases specifically so it announces on arrival.
    expect(screen.queryByRole('region', { name: /alerts/i })).not.toBeInTheDocument()
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

  it('puts the message inside the notification region, not merely on the page', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'fail' }))

    const region = screen.getByRole('region', { name: /alerts/i })
    expect(region).toHaveTextContent('Could not save')
  })

  it('names the region something other than the header bell', () => {
    // Two landmarks called "Notifications" — the bell button and this — is a worse
    // thing to hand a screen reader than a duller label on one of them.
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    )

    expect(screen.queryByRole('region', { name: /^notifications$/i })).not.toBeInTheDocument()
  })

  it('offers a way to dismiss a message before it times out', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'succeed' }))

    await user.click(screen.getByRole('button', { name: /close/i }))

    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
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
