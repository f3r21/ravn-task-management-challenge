import { useRef, type Key, type ReactNode } from 'react'
import { useButton, useMenu, useMenuItem, useMenuTrigger } from 'react-aria'
import { useMenuTriggerState, useTreeState, type Node, type TreeState } from 'react-stately'
import { cn } from '@/lib/cn'
import { Popover } from '@/ui/select/popover'

/**
 * The shape react-stately accepts as a collection: `Item` elements, or a render
 * function over `items`.
 *
 * Derived from the hook's own parameter rather than imported, because the named
 * type lives in `@react-types/shared` — a transitive dependency this project
 * does not declare, and reaching into one is how a build breaks on an unrelated
 * upgrade.
 */
type MenuChildren = Parameters<typeof useTreeState<object>>[0]['children']

interface MenuProps {
  /** Names the trigger. Required — an icon-only button has no name without it. */
  label: string
  /** The glyph inside the trigger. */
  icon: ReactNode
  /** `Item` elements from react-stately. */
  children: MenuChildren
  onAction: (key: Key) => void
  triggerClassName?: string
}

/**
 * The three-dot options menu on a task card.
 *
 * `useMenuTrigger` and `useMenu` supply the behaviour a menu is expected to
 * have and which is tedious to reproduce: opening on Enter, Space or ArrowDown
 * with focus landing on the first or last item accordingly, arrow-key movement,
 * typeahead, Escape to close, and focus returning to the trigger afterwards.
 *
 * The popover is shared with the selects, so a menu and a dropdown position and
 * dismiss identically.
 */
export function Menu({ label, icon, children, onAction, triggerClassName }: MenuProps) {
  const state = useMenuTriggerState({})
  const triggerRef = useRef<HTMLButtonElement>(null)

  const { menuTriggerProps, menuProps } = useMenuTrigger<object>({}, state, triggerRef)
  const { buttonProps } = useButton({ ...menuTriggerProps, 'aria-label': label }, triggerRef)

  return (
    <>
      <button {...buttonProps} ref={triggerRef} className={triggerClassName}>
        {icon}
      </button>

      {state.isOpen ? (
        <Popover state={state} triggerRef={triggerRef} placement="bottom end">
          <MenuList
            {...menuProps}
            autoFocus={state.focusStrategy ?? true}
            onAction={onAction}
            onClose={() => {
              state.close()
            }}
          >
            {children}
          </MenuList>
        </Popover>
      ) : null}
    </>
  )
}

interface MenuListProps {
  children: MenuChildren
  onAction: (key: Key) => void
  onClose: () => void
  autoFocus?: boolean | 'first' | 'last'
  'aria-labelledby'?: string
}

function MenuList({ children, onAction, onClose, ...props }: MenuListProps) {
  const state = useTreeState<object>({ ...props, children, selectionMode: 'none' })
  const ref = useRef<HTMLUListElement>(null)
  // `children` is deliberately not forwarded here: the collection has already
  // been built into `state`, and `useMenu` only wants the ARIA options.
  const { menuProps } = useMenu({ ...props, onAction, onClose }, state, ref)

  return (
    <ul {...menuProps} ref={ref} className="min-w-40 py-2 outline-none">
      {[...state.collection].map((item) => (
        <MenuItem key={item.key} item={item} state={state} onAction={onAction} onClose={onClose} />
      ))}
    </ul>
  )
}

interface MenuItemProps {
  item: Node<object>
  state: TreeState<object>
  onAction: (key: Key) => void
  onClose: () => void
}

function MenuItem({ item, state, onAction, onClose }: MenuItemProps) {
  const ref = useRef<HTMLLIElement>(null)
  const { menuItemProps, isFocused } = useMenuItem({ key: item.key, onAction, onClose }, state, ref)

  // A destructive action is worth marking as such, and colour alone would not
  // reach a screen reader — the item's own text does that.
  const isDestructive = String(item.key) === 'delete'

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={cn(
        'text-body-m cursor-pointer px-4 py-1 outline-none',
        isFocused && 'bg-muted/10',
        isDestructive ? 'text-danger' : 'text-main',
      )}
    >
      {item.rendered}
    </li>
  )
}
