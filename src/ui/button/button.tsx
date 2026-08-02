import { useRef, type ReactNode } from 'react'
import { useButton, type AriaButtonProps } from 'react-aria'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'text'

interface ButtonProps extends AriaButtonProps<'button'> {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-text-primary',
  text: 'text-text-primary hover:bg-text-secondary/10',
}

/**
 * The text buttons the design uses for dialog actions.
 *
 * `useButton` rather than a bare `<button>` with handlers: it normalises Enter
 * versus Space, keeps press state consistent across mouse, touch and keyboard,
 * and stops a disabled button from announcing itself as pressable. Those are the
 * cases hand-written handlers miss.
 */
export function Button({ variant = 'text', children, className, ...props }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps, isPressed } = useButton(props, ref)

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={cn(
        'rounded-card text-body-m px-4 py-2 transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isPressed && 'opacity-80',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}
