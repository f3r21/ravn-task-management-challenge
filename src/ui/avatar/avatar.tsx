import { cn } from '@/lib/cn'

interface AvatarProps {
  /** The assignee's avatar URL. Absent for unassigned tasks. */
  src?: string | null
  /** Used for the initials fallback and for the accessible name. */
  name?: string | null
  /** Pixel size of the square. 32 on a task card, 40 wherever a person is named. */
  size?: 32 | 40
  className?: string
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

/**
 * An assignee's avatar, falling back to their initials.
 *
 * A fallback is not decoration here: `User.avatar` is nullable in the schema and
 * `Task.assignee` is too, so "no image" is a state the API can genuinely return
 * and an `<img>` with an empty `src` would render as a broken-image glyph.
 *
 * The image is `alt=""` and the accessible name lives on the wrapper. An avatar
 * conveys who, not what a picture looks like, so describing it as an image would
 * make a screen reader announce "image, Alice" where "Alice" is the whole point.
 */
export function Avatar({ src, name, size = 32, className }: AvatarProps) {
  const label = name ?? 'Unassigned'
  const sizeClass = size === 40 ? 'size-10' : 'size-8'

  return (
    <span
      className={cn(
        'bg-surface inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'text-text-secondary text-xs font-semibold',
        sizeClass,
        className,
      )}
      role="img"
      aria-label={label}
      title={label}
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover" width={size} height={size} />
      ) : (
        initialsOf(label)
      )}
    </span>
  )
}
