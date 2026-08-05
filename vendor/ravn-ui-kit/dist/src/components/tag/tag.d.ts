export interface TagProps {
    /**
     * Color type of the tag.
     * @default 'neutral'
     */
    variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'blue';
    /**
     * Renders the "Style=Outline" variant (border, transparent fill) instead of
     * the default "Style=Solid" (10%-alpha fill, no border).
     * @default false
     */
    outline?: boolean;
    /**
     * Optional leading icon (Figma "Icon=Left" slot, 24×24px). Should use
     * `currentColor` for its fill/stroke so it inherits the tag's variant color.
     */
    icon?: React.ReactNode;
    /** Tag label content. */
    children: React.ReactNode;
    /** Called when the remove (×) button is pressed. When provided, a remove button is rendered. */
    onRemove?: () => void;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/** Compact labeled pill (Style=Solid/Outline × Icon=None/Left × Type=General/Green/Blue/Yellow/Red), optionally removable via a trailing "×" button. */
export declare function Tag({ variant, outline, icon, children, onRemove, className, }: TagProps): import("react").JSX.Element;
