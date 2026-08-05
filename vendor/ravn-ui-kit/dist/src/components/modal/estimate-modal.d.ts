export interface EstimateModalProps {
    /** Currently selected point value, if any — highlights the matching row. */
    value?: number;
    /** Called with the point value of the row the user clicked. */
    onSelect: (points: number) => void;
    /** Additional class names, merged last via `cn()` so they can override defaults (e.g. absolute positioning). */
    className?: string;
}
/**
 * EstimateModal
 *
 * Figma: "Estimate Modal" COMPONENT inside "Task Column" frame (Task Column01.md L1800-2231).
 * A small anchored popover (122×208, neutral-3 bg, 1px neutral-2 border, 8px radius) — not a
 * centered dialog, so unlike the shared `Modal` shell this has no backdrop/close chrome and no
 * isOpen/onClose: the parent conditionally mounts it, same convention as `DatePickerMenu`.
 * Anatomy is a decorative header label (Figma's "Input text" placeholder style, Desktop/Body/XL/bold,
 * neutral-2) followed by 5 point-value rows (icon + label, 4px/16px padding, 4px radius, no
 * background by default) with no footer — clicking a row is the confirm action.
 */
export declare function EstimateModal({ value, onSelect, className }: EstimateModalProps): import("react").JSX.Element;
