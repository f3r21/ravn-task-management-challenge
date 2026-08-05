export interface LabelCheckboxProps {
    /** Label content rendered next to the checkbox. */
    children: React.ReactNode;
    /** Controlled selected state. Omit to let the component manage its own state via `defaultSelected`. */
    isSelected?: boolean;
    /**
     * Initial selected state for uncontrolled usage.
     * @default false
     */
    defaultSelected?: boolean;
    /** Called with the next selected state whenever the checkbox is toggled. */
    onChange?: (isSelected: boolean) => void;
    /**
     * Disables interaction and applies a dimmed, non-interactive style.
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Renders the indeterminate ("mixed") visual state, overriding the checkmark
     * regardless of `isSelected`.
     * @default false
     */
    isIndeterminate?: boolean;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/**
 * LabelCheckbox
 *
 * Figma: "Label Checkbox" COMPONENT_SET inside "Tags" frame (Tags01.md,
 * Add Task Modal04/05.md). Structurally identical to the Tag "Icon=Left"
 * chip - a 24x24 icon slot + a Desktop/Body/M/regular label, 4px padding
 * 16px, gap 8px, radius 4px, no fill/border. The ground-truth export gives
 * Property 1=Default and Property 1=Selected byte-for-byte identical style
 * values (no distinguishing color), so the checked/unchecked distinction is
 * carried entirely by the icon glyph (empty box vs. checked box), exactly
 * like the two vector states a real checkbox input would render.
 * Uses react-aria useCheckbox for full accessibility.
 */
export declare function LabelCheckbox({ children, isSelected, defaultSelected, onChange, isDisabled, isIndeterminate, className, }: LabelCheckboxProps): import("react").JSX.Element;
