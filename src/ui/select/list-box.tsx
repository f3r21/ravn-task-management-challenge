import { useRef, type RefObject } from 'react'
import { useListBox, useOption, type AriaListBoxOptions } from 'react-aria'
import type { ListState, Node } from 'react-stately'
import { cn } from '@/lib/cn'

interface ListBoxProps<T> extends AriaListBoxOptions<T> {
  state: ListState<T>
  listBoxRef?: RefObject<HTMLUListElement | null>
}

/**
 * The option list inside a popover.
 *
 * Shared by the single and multi-select, so keyboard behaviour — arrows, Home,
 * End, typeahead, and the difference between "focused" and "selected" — is
 * defined once. React Aria's collection state also handles the part that is easy
 * to miss: which option is announced as active as focus moves, separately from
 * which are checked.
 */
export function ListBox<T extends object>({ state, listBoxRef, ...props }: ListBoxProps<T>) {
  const fallbackRef = useRef<HTMLUListElement>(null)
  const ref = listBoxRef ?? fallbackRef
  const { listBoxProps } = useListBox(props, state, ref)

  return (
    <ul {...listBoxProps} ref={ref} className="max-h-64 min-w-48 overflow-auto py-2 outline-none">
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  )
}

function Option<T>({ item, state }: { item: Node<T>; state: ListState<T> }) {
  const ref = useRef<HTMLLIElement>(null)
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref,
  )

  return (
    <li
      {...optionProps}
      ref={ref}
      className={cn(
        'text-body-m flex cursor-pointer items-center justify-between gap-4 px-4 py-1',
        // Focus and selection are different things and look different. Merging
        // them would leave a keyboard user unable to tell where they are.
        isFocused && 'bg-muted/10',
        isSelected ? 'text-interactive font-semibold' : 'text-main',
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span>{item.rendered}</span>
      {isSelected ? <span aria-hidden="true">✓</span> : null}
    </li>
  )
}
