import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type IconButtonVariant = 'primary' | 'ghost'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Required, not optional. A button whose only content is a glyph has no
   * accessible name at all without one — it is announced as just "button" — so
   * the type system asks for it rather than a review catching it later.
   */
  label: string
  icon: ReactNode
  variant?: IconButtonVariant
}

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  primary: 'bg-interactive text-main',
  ghost: 'text-muted hover:text-main',
}

/**
 * A 40x40 square button whose whole content is a glyph.
 *
 * The layout switcher used to be built from these. It is a real radio group now, so
 * the only caller is the create button — but the shape is the design's, not that
 * button's, so it stays a component rather than being inlined.
 */
export function IconButton({
  label,
  icon,
  variant = 'ghost',
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'rounded-sm inline-flex size-10 shrink-0 items-center justify-center',
        'transition-colors',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  )
}
