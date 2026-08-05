export interface AvatarProps {
    /** Image URL to render. Falls back to initials derived from `name` when omitted. */
    src?: string;
    /** Full name used for the fallback initials and the image `alt` text. */
    name?: string;
    /**
     * Controls the avatar's width, height, and initials font size.
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/** Circular user avatar that shows an image, or initials derived from `name` when no `src` is provided. */
export declare function Avatar({ src, name, size, className }: AvatarProps): import("react").JSX.Element;
