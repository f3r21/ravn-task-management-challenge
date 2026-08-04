import { useRef, type ReactNode } from 'react'
import { HiddenSelect, useButton, useSelect, type AriaSelectProps } from 'react-aria'
import { useSelectState } from 'react-stately'
import { cn } from '@/lib/cn'
import { ChevronDownIcon } from '@/ui/icons/icons'
import { ListBox } from './list-box'
import { Popover } from './popover'

interface SelectProps<T extends object> extends AriaSelectProps<T> {
  /** Drawn inside the trigger pill, ahead of the value. */
  icon?: ReactNode
  /** Shown when nothing is selected yet, matching the design's pill labels. */
  placeholder: string
  className?: string
}

/**
 * The pill-shaped dropdown the task modal uses for points, assignee and status.
 *
 * `HiddenSelect` renders a real `<select>` off-screen wired to the same state.
 * That is not redundancy: it is what makes the control work inside a `<form>`,
 * gives mobile browsers their native picker, and lets autofill and password
 * managers see a field they understand. The visible pill is the presentation.
 *
 * The label is visually hidden rather than omitted — the pill shows the current
 * value, which is not the same as saying what the value is *for*.
 */
export function Select<T extends object>({
  icon,
  placeholder,
  className,
  ...props
}: SelectProps<T>) {
  const state = useSelectState(props)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(props, state, triggerRef)
  const { buttonProps } = useButton(triggerProps, triggerRef)

  return (
    <div className={cn('relative', className)}>
      <span {...labelProps} className="sr-only">
        {props.label}
      </span>

      <HiddenSelect state={state} triggerRef={triggerRef} label={props.label} name={props.name} />

      <button
        {...buttonProps}
        ref={triggerRef}
        className={cn(
          'rounded-pill bg-text-secondary/10 flex items-center gap-2 px-4 py-1',
          'text-body-m font-semibold whitespace-nowrap',
          state.selectedItem ? 'text-text-primary' : 'text-text-secondary',
        )}
      >
        {icon}
        <span {...valueProps}>
          {state.selectedItem ? state.selectedItem.rendered : placeholder}
        </span>
        <ChevronDownIcon className="size-3 shrink-0" />
      </button>

      {state.isOpen ? (
        <Popover state={state} triggerRef={triggerRef} placement="bottom start">
          <ListBox {...menuProps} state={state} />
        </Popover>
      ) : null}
    </div>
  )
}
