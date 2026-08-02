import { cn } from '@/lib/cn'
import { GridViewIcon, ListViewIcon, PlusIcon } from '@/ui/icons/icons'
import { IconButton } from '@/ui/icon-button/icon-button'

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
 * The row above the board: the layout switcher on the left, create on the right.
 *
 * The switcher is a `radiogroup` rather than two buttons. Two buttons would let
 * a screen reader user press the one that is already active with no feedback and
 * no way to tell which of the two is current; a radio group states how many
 * options there are, which one is selected, and supports arrow keys for free.
 */
export function BoardToolbar({ view, onViewChange, onCreateTask }: BoardToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="bg-surface rounded-card flex" role="radiogroup" aria-label="Board layout">
        {VIEWS.map(({ value, label, icon: Icon }) => {
          const isSelected = view === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={label}
              onClick={() => onViewChange(value)}
              className={cn(
                'rounded-card inline-flex size-10 items-center justify-center transition-colors',
                isSelected ? 'border-brand text-brand border' : 'text-text-secondary',
              )}
            >
              <Icon className="size-[18px]" />
            </button>
          )
        })}
      </div>

      <IconButton
        label="Create task"
        variant="primary"
        icon={<PlusIcon className="size-3.5" />}
        onClick={onCreateTask}
      />
    </div>
  )
}
