import { useRef, type Key, type ReactNode } from 'react'
import { useButton } from 'react-aria'
import { Item, useListState, useOverlayTriggerState } from 'react-stately'
import { cn } from '@/lib/cn'
import { ChevronDownIcon } from '@/ui/icons/icons'
import { ListBox } from './list-box'
import { Popover } from './popover'

interface MultiSelectOption {
  id: string
  label: string
}

interface MultiSelectProps {
  label: string
  placeholder: string
  options: readonly MultiSelectOption[]
  selectedKeys: readonly string[]
  onSelectionChange: (keys: string[]) => void
  icon?: ReactNode
  className?: string
}

/**
 * A pill that opens a checklist — the tag picker, in the task modal and the filter bar.
 *
 * Separate from `Select` rather than a `selectionMode` prop on it, because the
 * two differ in more than selection: this one has no single "selected item" to
 * show in the trigger, stays open while the user picks, and summarises a count.
 * Folding them together would mean a component whose every branch asks which
 * mode it is in.
 *
 * There is no `HiddenSelect` counterpart here: a native multi-select is a
 * scrolling list box that looks nothing like the design, and this control is
 * never submitted as a form field — the form reads its value from state.
 */
export function MultiSelect({
  label,
  placeholder,
  options,
  selectedKeys,
  onSelectionChange,
  icon,
  className,
}: MultiSelectProps) {
  const overlayState = useOverlayTriggerState({})
  const triggerRef = useRef<HTMLButtonElement>(null)

  const listState = useListState<MultiSelectOption>({
    children: options.map((option) => <Item key={option.id}>{option.label}</Item>),
    selectionMode: 'multiple',
    // Explicit, because the default behaves like a file browser: a plain click
    // *replaces* the selection and only Ctrl/Cmd+click adds to it. That is right
    // for a list of files and wrong for a set of checkboxes — picking a second
    // tag would silently drop the first.
    selectionBehavior: 'toggle',
    selectedKeys,
    onSelectionChange: (keys) => {
      // "all" arrives when the user hits Ctrl+A inside the list. Expanding it
      // here means the caller only ever receives concrete ids.
      const next: string[] =
        keys === 'all' ? options.map((option) => option.id) : [...(keys as Set<Key>)].map(String)
      onSelectionChange(next)
    },
  })

  const { buttonProps } = useButton(
    {
      onPress: () => {
        overlayState.toggle()
      },
      'aria-label': label,
    },
    triggerRef,
  )

  const count = selectedKeys.length

  return (
    <div className={cn('relative', className)}>
      <button
        {...buttonProps}
        ref={triggerRef}
        aria-expanded={overlayState.isOpen}
        aria-haspopup="listbox"
        className={cn(
          'rounded-pill bg-text-secondary/10 flex items-center gap-2 px-4 py-1',
          'text-body-m font-semibold whitespace-nowrap',
          count > 0 ? 'text-text-primary' : 'text-text-secondary',
        )}
      >
        {icon}
        <span>{count > 0 ? `${placeholder} (${String(count)})` : placeholder}</span>
        <ChevronDownIcon className="size-3 shrink-0" />
      </button>

      {overlayState.isOpen ? (
        <Popover state={overlayState} triggerRef={triggerRef} placement="bottom start">
          {/* `autoFocus` moves focus into the list on open. Without it focus
              stays on the trigger, which is outside the popover — so arrow keys
              go nowhere and Escape is never seen by the overlay that should
              handle it. `useSelect` does this for the single-select; a
              hand-assembled trigger has to do it itself. */}
          <ListBox aria-label={label} state={listState} autoFocus />
        </Popover>
      ) : null}
    </div>
  )
}
