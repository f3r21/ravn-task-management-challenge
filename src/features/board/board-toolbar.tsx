import { useRef } from 'react'
import { useRadio, useRadioGroup, VisuallyHidden } from 'react-aria'
import { useRadioGroupState, type RadioGroupState } from 'react-stately'
import { Button } from '@ravn/ui-kit'
import { cn } from '@/lib/cn'
import { GridViewIcon, ListViewIcon, PlusIcon } from '@/ui/icons/icons'

export type BoardView = 'list' | 'grid'

interface BoardToolbarProps {
  view: BoardView
  onViewChange: (view: BoardView) => void
  onCreateTask: () => void
}

const VIEWS: { value: BoardView; label: string; icon: typeof GridViewIcon }[] = [
  { value: 'list', label: 'List view', icon: ListViewIcon },
  { value: 'grid', label: 'Grid view', icon: GridViewIcon },
]

const GROUP_LABEL = 'Board layout'

/**
 * One option in the layout switcher: a real radio input, visually replaced by its
 * icon.
 *
 * The input has to exist and stay focusable. `useRadioGroup`'s arrow-key handler
 * walks the group with a tree walker that accepts only `HTMLInputElement` of
 * `type="radio"` and reads the new value off `.value`, so a `<button role="radio">`
 * is invisible to it — which is why the previous version's arrow keys did nothing.
 * `VisuallyHidden` clips the input rather than hiding it; `display: none` would
 * take it out of the tab order and break the roving tabindex the group depends on.
 */
function ViewRadio({
  value,
  label,
  icon: Icon,
  state,
}: {
  value: BoardView
  label: string
  icon: typeof GridViewIcon
  state: RadioGroupState
}) {
  const ref = useRef<HTMLInputElement>(null)
  // `aria-label` rather than children: the control is an icon, so there is no text
  // for React Aria to use as the option's name.
  const { labelProps, inputProps, isSelected } = useRadio(
    { value, 'aria-label': label },
    state,
    ref,
  )

  return (
    <label
      {...labelProps}
      className={cn(
        'rounded-sm inline-flex size-10 cursor-pointer items-center justify-center transition-colors',
        // The ring belongs on the label, because the input it would normally sit on
        // is clipped to a pixel.
        'has-[:focus-visible]:outline-interactive has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2',
        // `text-interactive` stays here, deliberately, while five sibling sites moved
        // to `text-interactive-text` for AA. There is no text in this control — the
        // name is on `aria-label` and the only painted thing is an 18px glyph and a
        // border. Both are non-text UI under WCAG 1.4.11 and owe 3:1, not 4.5:1, and
        // primary-4 on this toolbar's `surface-shell` track measures 4.02:1. Moving
        // it would lose the selected state's tie to the focus ring and the active
        // sidebar marker, both of which are the same colour for the same reason.
        isSelected ? 'border-interactive text-interactive border' : 'text-muted',
      )}
    >
      <VisuallyHidden>
        <input {...inputProps} ref={ref} />
      </VisuallyHidden>
      <Icon className="size-[18px]" />
    </label>
  )
}

/**
 * The row above the board: the layout switcher on the left, create on the right.
 *
 * The switcher is a radio group rather than two buttons, so how many options exist
 * and which is current are announced rather than implied by a border. Built on
 * `useRadioGroup`/`useRadio` rather than hand-written ARIA attributes, because the
 * attributes are the easy half: the behaviour a radio group is expected to have is
 * a roving tabindex — one tab stop for the whole group, not one per option — and
 * arrow keys that move focus and selection together. Hand-rolled `role="radio"` on
 * a `<button>` announces correctly and then does neither.
 *
 * `orientation: 'horizontal'` because the options sit side by side: it sets
 * `aria-orientation` and binds Left/Right instead of Up/Down.
 */
export function BoardToolbar({ view, onViewChange, onCreateTask }: BoardToolbarProps) {
  const state = useRadioGroupState({
    value: view,
    // React Aria hands back a plain string; the cast is confined to this boundary
    // and the value can only have come from `VIEWS`.
    onChange: (next) => {
      onViewChange(next as BoardView)
    },
    orientation: 'horizontal',
  })
  const { radioGroupProps } = useRadioGroup(
    { 'aria-label': GROUP_LABEL, orientation: 'horizontal' },
    state,
  )

  return (
    <div className="flex items-center justify-between">
      <div {...radioGroupProps} className="bg-surface-shell rounded-sm flex">
        {VIEWS.map(({ value, label, icon }) => (
          <ViewRadio key={value} value={value} label={label} icon={icon} state={state} />
        ))}
      </div>

      {/* `onPress`, not `onClick`: the kit's `Button` is built on `useButton`, so the
          press sequence is React Aria's rather than the DOM's. */}
      <Button aria-label="Create task" variant="primary" onPress={onCreateTask}>
        <PlusIcon className="size-3.5" />
      </Button>
    </div>
  )
}
