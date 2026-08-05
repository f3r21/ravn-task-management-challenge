import { type AriaButtonProps } from 'react-aria';
export interface TextButtonProps extends AriaButtonProps {
    /**
     * Figma "Type": Primary is a solid primary-4 fill by default. Secondary
     * starts fully transparent and only gains a fill on hover/selected.
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary';
    /** Figma "State=Selected" — a persisted toggle state, distinct from hover/press. */
    isSelected?: boolean;
    /** Button label / content. */
    children: React.ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/**
 * TextButton
 *
 * Figma: "Text Button" COMPONENT_SET inside "Button, Switch Button" frame
 * (Button, Switch Button01.md). Despite the name, this is a solid-fill pill
 * (State=Default/Disable/Hover/Selected × Type=Primary/Secondary), not an
 * underline/link style. Desktop/Body/M/regular: SF Pro Display, 15px/24px,
 * weight 400, letter-spacing 0.75px (tracking-wider). Padding 8px on all
 * sides, border-radius 8px (--radius-sm).
 *
 * Note: the spec's Type=Primary "Disable" state (bg primary-2) is literally
 * identical to its "Hover" state — not a transcription error, both frames
 * use the same #EBA59E swatch.
 */
export declare function TextButton({ variant, isSelected, className, isDisabled, ...props }: TextButtonProps): import("react").JSX.Element;
