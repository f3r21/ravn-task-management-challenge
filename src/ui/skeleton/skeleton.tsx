import { cn } from '@/lib/cn'

/**
 * A placeholder block, sized by the caller.
 *
 * `aria-hidden`: a skeleton conveys "not ready yet", which the page's own status
 * region announces in words. Exposing the blocks themselves would read out a run of
 * empty elements.
 *
 * The pulse is suppressed under `prefers-reduced-motion` — a looping animation
 * is exactly the kind of thing that setting exists for.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('bg-text-secondary/10 block rounded motion-safe:animate-pulse', className)}
    />
  )
}
