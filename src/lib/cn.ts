import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Joins class names, resolving Tailwind conflicts so the last one wins.
 *
 * The `twMerge` half is what makes a `className` prop on a component safe: a
 * caller passing `p-6` overrides the component's own `p-4` instead of both
 * landing in the class list and letting stylesheet order decide.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
