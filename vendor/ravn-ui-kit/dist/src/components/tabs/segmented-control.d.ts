import React from 'react';
export interface SegmentedControlOption {
    /** Unique identifier for the option, used to match against `value`/`defaultValue` and reported by `onChange`. */
    id: string;
    /** Text label displayed for the option. */
    label: string;
    /** Optional icon rendered before the label. */
    icon?: React.ReactNode;
}
export interface SegmentedControlProps {
    /** The list of segments rendered as selectable options, in display order. */
    options: SegmentedControlOption[];
    /** Selected option `id` for controlled usage. When provided, the component no longer manages its own selection state. */
    value?: string;
    /** Initial selected option `id` for uncontrolled usage. Falls back to the first option's `id` when omitted. */
    defaultValue?: string;
    /** Called with the newly selected option's `id` whenever the user picks a segment. */
    onChange?: (value: string) => void;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/**
 * SegmentedControl
 *
 * Figma: "Segmented Control" COMPONENT inside "Button, Switch Button00/01.md" frame.
 * - Container: bg-neutral-4, padding: 4px, border-radius: 10px, now via the
 *   `--radius-10` token (`rounded-10`) added in Chunk 1 -- previously an
 *   arbitrary-value class before that token existed.
 * - Segments: 0 gap between them, height 32px, padding 4px 24px, radius 8px
 *   (`rounded-sm`, which Chunk 1 redefined to 8px).
 * - Active segment: bg-neutral-2 pill + Drop Shadow Small (`shadow-small`
 *   token, Chunk 1). Text: IOS/Subheadline/S.regular -- 13px/13px,
 *   letter-spacing 1px, weight 400 -- rendered via the shared `--font-sans`
 *   token per the Chunk 1 "no separate SF Pro Text token" precedent.
 * - Inactive: same 13px/regular/neutral-1 label -- Figma shows identical
 *   (white) label color for both states, distinguishing selection purely via
 *   the pill background fill, not a text-color change. Spec also carries a
 *   `filter: drop-shadow` on the inactive pill, but that's a Figma effect on
 *   an otherwise-transparent shape with no visible box -- applying our
 *   `shadow-small` (a `box-shadow`, which always renders behind the full
 *   element box) there would draw a visible phantom rectangle that doesn't
 *   exist in the reference; intentionally omitted.
 */
export declare function SegmentedControl({ options, value: controlledValue, defaultValue, onChange, className, }: SegmentedControlProps): React.JSX.Element;
