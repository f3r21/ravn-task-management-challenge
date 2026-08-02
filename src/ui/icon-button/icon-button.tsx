import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type IconButtonVariant = 'primary' | 'outline' | 'ghost'

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
  primary: 'bg-brand text-text-primary',
  outline: 'border border-brand text-brand',
  ghost: 'text-text-secondary hover:text-text-primary',
}

/**
 * The 40x40 square button the design uses for creating a task and for the
 * list/grid switcher.
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
        'rounded-card inline-flex size-10 shrink-0 items-center justify-center',
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
