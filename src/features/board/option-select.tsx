import { useMemo, type ReactNode } from 'react'
import { MultiSelect, Select } from '@ravn/ui-kit'
import { LabelIcon } from '@/ui/icons/icons'
import { findOption, renderSelectOption, type SelectOption } from './select-option'
import { tagLabel } from './task-display'
import { ALL_TAGS, type TaskTag } from './task-types'

/**
 * The key standing in for "no choice" inside an `OptionalSelect`.
 *
 * An explicit option rather than a way of clearing the control: a single-select
 * has no gesture for "undo my pick", so without one the only escape from a filter
 * was "Clear filters", which drops all six at once — and taking the owner off a
 * task is a choice a user makes, not the absence of one.
 *
 * Prefixed so it cannot collide with a status, an estimate or a user id. It is
 * private to this module now: every caller used to declare its own `ANY` or
 * `UNASSIGNED` and map it back by hand at the `onSelectionChange` boundary, which
 * is four copies of the same off-by-one waiting to happen.
 */
const NONE = '__none__'

interface OptionalSelectProps<T extends string> {
  label: string
  placeholder: string
  icon?: ReactNode
  /** The real choices. The "none" entry is this component's business, not yours. */
  options: readonly SelectOption<T>[]
  /** What "no choice" reads as — "Any status", "Unassigned". */
  noneLabel: string
  value: T | null
  onChange: (value: T | null) => void
  'aria-describedby'?: string
}

/**
 * A single-select with an explicit "none" option, which the caller never sees.
 *
 * Four near-identical sixteen-to-nineteen line blocks before this — three filters
 * and the assignee picker — each declaring its own sentinel, prepending it to its
 * own items array, and asserting the selected key back into its own enum with
 * `as`. The sentinel round trip is the part worth centralising: it is the same
 * three steps every time, and getting the mapping back wrong shows up as a filter
 * that cannot be cleared rather than as an error.
 *
 * **The option labels must stay on the options, and `renderSelectOption` must go
 * on closing over nothing.** react-stately's `CollectionBuilder` caches each
 * built node in a `WeakMap` keyed on the item object, with no invalidation, so a
 * render function that reads anything outside its argument is called once per
 * item and then never again — it serves whatever it resolved on the first build
 * for as long as that array lives. An extraction like this one is exactly where
 * that gets reintroduced, because moving the rendering inside makes
 * `{(item) => <Item>{lookup(item)}</Item>}` look natural. It would freeze the
 * owner and assignee names at whatever the directory held on first render, and
 * nothing would fail: right components, right places, wrong text.
 * `picker-staleness.test.tsx` is the guard.
 */
export function OptionalSelect<T extends string>({
  label,
  placeholder,
  icon,
  options,
  noneLabel,
  value,
  onChange,
  'aria-describedby': describedBy,
}: OptionalSelectProps<T>) {
  // Memoised on the options so the item objects — which are the collection
  // cache's keys — change exactly when a label could have changed, and not on
  // every render. The real options keep their identities through the spread;
  // only the sentinel is rebuilt.
  const items = useMemo<SelectOption<string>[]>(
    () => [{ id: NONE, label: noneLabel }, ...options],
    [options, noneLabel],
  )

  return (
    <Select<SelectOption<string>>
      label={label}
      placeholder={placeholder}
      icon={icon}
      aria-describedby={describedBy}
      items={items}
      selectedKey={value ?? NONE}
      onSelectionChange={(key) => {
        // Looked up rather than cast. `findOption` searches the caller's own
        // options, so a hit is already typed `T` and the sentinel — which is not
        // among them — falls through to `null` without a special case.
        onChange(findOption(options, key)?.id ?? null)
      }}
    >
      {renderSelectOption}
    </Select>
  )
}

interface RequiredSelectProps<T extends string> {
  label: string
  placeholder: string
  icon?: ReactNode
  options: readonly SelectOption<T>[]
  value: T
  onChange: (value: T) => void
}

/**
 * The same control where every choice is a real one.
 *
 * The create/edit form's status and estimate are required — the server has no
 * "unset" for either — so offering a "none" entry would collect a value the
 * mutation could not send. Kept as a separate component rather than a
 * `noneLabel?` on the one above, because the difference is in the *types*: this
 * one cannot hand you `null`, and a single component would have to widen
 * `onChange` to `T | null` for every caller to satisfy the one case that needs it.
 *
 * An unrecognised key leaves the value alone. That cannot happen through the UI —
 * the keys come from `options` — and it is a better answer than asserting a
 * string into `T`, which is what the two call sites did before.
 */
export function RequiredSelect<T extends string>({
  label,
  placeholder,
  icon,
  options,
  value,
  onChange,
}: RequiredSelectProps<T>) {
  return (
    <Select<SelectOption<T>>
      label={label}
      placeholder={placeholder}
      icon={icon}
      items={options}
      selectedKey={value}
      onSelectionChange={(key) => {
        const option = findOption(options, key)
        if (option) {
          onChange(option.id)
        }
      }}
    >
      {renderSelectOption}
    </Select>
  )
}

/** Built once at import: the tag list is a module constant. */
const TAG_ITEMS: SelectOption<TaskTag>[] = ALL_TAGS.map((id) => ({ id, label: tagLabel(id) }))

interface TagMultiSelectProps {
  label: string
  /** "Tags" over the board, "Label" in the form — the design words them differently. */
  placeholder?: string
  value: TaskTag[]
  onChange: (tags: TaskTag[]) => void
}

/**
 * The tag picker, which the filter bar and the task form had byte-identical.
 *
 * Both declared the same option list and the same five-line `onSelectionChange`,
 * including the same `as TaskTag[]` assertion on a `Set` of keys the kit hands
 * back. That assertion is gone: the keys are looked up against the option list,
 * so each one either resolves to a value already typed `TaskTag` or is dropped.
 *
 * `'all'` is react-stately's own sentinel for a select-all, and it never carries
 * the keys — so it has to be expanded from `ALL_TAGS` rather than iterated.
 */
export function TagMultiSelect({
  label,
  placeholder = 'Tags',
  value,
  onChange,
}: TagMultiSelectProps) {
  return (
    <MultiSelect<SelectOption<TaskTag>>
      label={label}
      placeholder={placeholder}
      icon={<LabelIcon className="size-6 shrink-0" />}
      items={TAG_ITEMS}
      selectedKeys={value}
      onSelectionChange={(keys) => {
        onChange(
          keys === 'all'
            ? [...ALL_TAGS]
            : [...keys]
                .map((key) => findOption(TAG_ITEMS, key)?.id)
                .filter((tag): tag is TaskTag => tag !== undefined),
        )
      }}
    >
      {renderSelectOption}
    </MultiSelect>
  )
}
