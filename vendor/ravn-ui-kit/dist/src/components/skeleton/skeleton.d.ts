export interface SkeletonProps {
    /**
     * Tailwind size/shape classes (width, height, rounding) — the primitive has no
     * intrinsic size of its own so it can stand in for text lines, avatars, cards, etc.
     */
    className?: string;
}
/**
 * Skeleton
 *
 * No ground-truth Figma spec (static exports have no concept of an in-flight
 * loading state) — this is a standalone, non-contradicted utility primitive
 * in the same vein as `switch.tsx`/`datepicker.tsx` (Chunks 5/16): genuinely
 * useful, and nothing in the exported specs contradicts it existing. A simple
 * `animate-pulse` block on the kit's own neutral-3 surface tone, matching the
 * pattern used by comparable production design systems for loading
 * placeholders (pulsing muted block, no skeleton-specific token needed).
 */
export declare function Skeleton({ className }: SkeletonProps): import("react").JSX.Element;
