import { type AriaButtonProps } from 'react-aria';
export interface ButtonProps extends AriaButtonProps {
    /**
     * Figma "Property 1": Primary is a single documented state (solid fill,
     * no selected/unselected toggle). Secondary is icon-only chrome that
     * toggles via `isSelected`.
     * @default 'secondary'
     */
    variant?: 'primary' | 'secondary';
    /**
     * Figma "State=Selected/Unselected" — only meaningful for `variant="secondary"`;
     * `variant="primary"` has no selected/unselected state in the source.
     * @default false
     */
    isSelected?: boolean;
    /** 24×24 icon content. Should use `currentColor` so it inherits the button's icon color. */
    children: React.ReactNode;
    /** Required — icon-only buttons need an accessible name. */
    'aria-label': string;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/**
 * Button (icon button)
 *
 * Figma: "Button" COMPONENT_SET inside "Button, Switch Button" frame
 * (Button, Switch Button01.md). Fixed 40×40px, border-radius 8px (--radius-sm).
 * - Property 1=Primary, State=Normal: bg primary-4, white icon, no border.
 * - Property 1=Secondary, State=Selected: transparent bg, 1px primary-4
 *   border, primary-4 icon.
 * - Property 1=Secondary, State=Unselected: transparent bg, no border,
 *   white icon.
 */
export declare function Button({ variant, isSelected, children, className, isDisabled, ...props }: ButtonProps): import("react").JSX.Element;
