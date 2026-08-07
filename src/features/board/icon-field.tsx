import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface IconFieldProps {
  icon: ReactNode
  /** Visually hidden, because the control's own value is its visible text. */
  label: string
  type: 'date' | 'number'
  value: string
  onChange: (value: string) => void
  /** `any` on the position field, which is a `Float`. */
  step?: string
  /** Sizing for the input itself, not the pill. */
  inputClassName?: string
}

/**
 * A native input in the design's rounded pill, with its icon and a hidden label.
 *
 * Three copies of this markup before: the board's due-date filter, the form's due
 * date and the form's position field, identical down to the wrapper classes and
 * differing only in icon, label and input type. Native inputs rather than custom
 * widgets throughout — the platform supplies the date picker, the number stepper,
 * the mobile keypad and the keyboard handling, all of which a bespoke control has
 * to reimplement and usually reimplements worse.
 *
 * **It generates its own id, which is a bug fix rather than tidiness.** The
 * board's filter hardcoded `id="filter-due-date"` and pointed a `htmlFor` at it,
 * while every other labelled input in the app uses `useId()`. One instance was
 * fine; two on a page produce duplicate ids, and a label then resolves to
 * whichever input the document happens to reach first — so clicking one field's
 * label focuses another's. Owning the id here makes that unrepresentable.
 */
export function IconField({
  icon,
  label,
  type,
  value,
  onChange,
  step,
  inputClassName,
}: IconFieldProps) {
  const id = useId()

  return (
    <div className="rounded-4 bg-muted/10 flex items-center gap-2 px-4 py-1">
      {icon}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        step={step}
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        className={cn('text-body-m bg-transparent font-semibold outline-none', inputClassName)}
      />
    </div>
  )
}
