import { Item } from 'react-stately'
import { Menu, MenuDotsIcon } from '@ravn/ui-kit'
import type { Task } from '../task-types'

interface TaskActionsMenuProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

/**
 * The per-task overflow menu, lifted out of the card that used to own it.
 *
 * It is a component of its own now because the card around it is gone: the board renders
 * `@ravn/ui-kit`'s `TaskCard`, which takes this as its `actions` slot, and the list view
 * renders it beside its own row. One definition, so the two views cannot offer different
 * actions — the guarantee the old `layout='card'|'row'` switch used to provide.
 */
export function TaskActionsMenu({ task, onEdit, onDelete }: TaskActionsMenuProps) {
  return (
    /* Every card carries one of these, so the accessible name has to say which task
       it belongs to — "options" alone is ambiguous the moment a screen-reader user
       lists the buttons on the page. The kit documents the same requirement on the
       slot this is passed to. */
    <Menu
      label={`Task options for ${task.name}`}
      triggerContent={<MenuDotsIcon className="size-6" />}
      triggerClassName="text-muted hover:text-main shrink-0 transition-colors"
      onAction={(key) => {
        // Deferred by a frame so the menu finishes closing first.
        //
        // React Aria records what to restore focus to when the dialog first
        // renders. Opening it straight from `onAction` puts that render in the same
        // commit that unmounts the menu item, so the recorded element is already
        // detached, gets discarded, and focus lands on `<body>` when the dialog
        // closes. Waiting lets the menu hand focus back to its own trigger, which
        // is then the element the dialog records — and returns to.
        requestAnimationFrame(() => {
          if (key === 'edit') {
            onEdit?.(task)
          }
          if (key === 'delete') {
            onDelete?.(task)
          }
        })
      }}
    >
      <Item key="edit">Edit</Item>
      {/* Deleting is destructive and is worth marking as such. The kit's `Menu`
          deliberately has no destructive-item flag — a `'delete'`-keyed special
          case is one app's key naming, not something a generic component should
          assume — so the colour is applied here, to the item's own children. It
          is decoration on top of the word "Delete", never the only signal: colour
          alone would not reach a screen reader, and the item's text already does.

          `textValue` is what typeahead and the accessible name are computed from.
          Plain-string children supply it implicitly; wrapping them in an element
          does not, and react-stately warns about exactly that.

          `text-danger-text`, not `text-danger`: the kit's `Menu` paints its surface
          `surface-overlay` and its focused item `neutral-4`, and danger-5 measures
          2.55:1 and 3.14:1 on those. danger-3 is 5.65:1 and 6.94:1. */}
      <Item key="delete" textValue="Delete">
        <span className="text-danger-text">Delete</span>
      </Item>
    </Menu>
  )
}
