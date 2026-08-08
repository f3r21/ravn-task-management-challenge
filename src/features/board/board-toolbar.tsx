import { useRef } from 'react'
import { useRadio, useRadioGroup, VisuallyHidden } from 'react-aria'
import { useRadioGroupState, type RadioGroupState } from 'react-stately'
import { Button, GridViewIcon, ListViewIcon, PlusIcon } from '@ravn/ui-kit'
import { cn } from '@/lib/cn'

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

/**
 * The view a radio group reported, or `undefined` if it names none.
 *
 * React Aria hands `onChange` a plain `string`, and this used to be `next as BoardView`
 * at the call site, justified by a comment saying the value "can only have come from
 * `VIEWS`". That was true, and it is the kind of true-by-inspection claim `findOption`
 * in `select-option.tsx` replaced with something the compiler enforces: nothing
 * re-checks it when `VIEWS` grows a third entry or the group gains an option from
 * somewhere else. Looking the value up returns `view.value`, which is *already*
 * `BoardView`, so nothing is asserted.
 *
 * Exported only so the miss can be tested. The call site's own miss branch is
 * unreachable through the UI — React Aria only ever reports a value it rendered a
 * radio for — so a test driving the component can exercise one direction and never the
 * other. Testing this directly is what covers both, and a lookup that answered
 * `undefined` for *everything* would satisfy "an unknown view is dropped" perfectly
 * while breaking the switcher outright.
 */
export function readView(value: string): BoardView | undefined {
  return VIEWS.find((view) => view.value === value)?.value
}

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
    // Looked up rather than asserted — see `readView`. A value naming no view is
    // dropped rather than moving the board to one it does not have; that branch is
    // unreachable through the UI today, which is why `readView` is tested directly.
    onChange: (next) => {
      const view = readView(next)
      if (view) {
        onViewChange(view)
      }
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
