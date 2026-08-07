import { Item } from 'react-stately'

/**
 * One option in a `Select` or `MultiSelect`, carrying the text it displays.
 *
 * The label travels *with* the item rather than being computed by the render
 * function, and that is a correctness requirement rather than a tidiness one —
 * see `renderSelectOption`.
 */
export interface SelectOption {
  id: string
  label: string
}

/**
 * The render function every picker in this feature shares.
 *
 * Module-level, so its identity never changes. react-stately's `useCollection`
 * memoises on its `children` as well as its `items`, so an inline
 * `{(item) => <Item…>}` is a fresh `children` on every render and rebuilds the
 * whole collection even when `items` is referentially stable — and the filter bar
 * re-renders on every keystroke in the header's search box, because that writes
 * to the URL.
 *
 * It closes over nothing, deliberately, and a replacement must not either.
 * `CollectionBuilder` caches the node it builds for an item in a `WeakMap` keyed
 * on the item object, with no invalidation, so a render function that reads
 * anything outside its argument is called once per item and then never again — it
 * serves whatever it resolved on the first build for as long as that array lives.
 * The owner and assignee pickers used to do `users.find(…)` inside the render
 * prop, which is exactly that shape. Hoisting `items` to module scope while
 * leaving such a closure in place is the trap worth naming: it looks like the
 * same optimisation, and it freezes the labels permanently. Precomputing the
 * label into the item is what makes the cache safe, because then the cache key
 * and the label can only change together.
 */
export function renderSelectOption(item: SelectOption) {
  return <Item key={item.id}>{item.label}</Item>
}
