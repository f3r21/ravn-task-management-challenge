export interface UserRowProps {
    /** Full name of the user */
    name: string;
    /** Job title or role (e.g. "Frontend Developer") */
    role?: string;
    /** Avatar image URL */
    avatarSrc?: string;
    /**
     * Size variant — matches Avatar sizes
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Whether to show a status dot (online indicator)
     * @default false
     */
    isOnline?: boolean;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
    /** Called when the row is clicked. When provided, the row renders as a `<button>` instead of a `<div>`. */
    onClick?: () => void;
}
/**
 * UserRow
 *
 * Figma: "User" COMPONENT inside the "Avatar" frame.
 * - Layout: Avatar (left) + name + role (stacked, right)
 * - Used in the Assignee Modal (no ApplicationSidebar footer exists in the
 *   ground truth — see the Chunk 9 note in `application-sidebar.tsx`)
 * - Background: transparent
 */
export declare function UserRow({ name, role, avatarSrc, size, isOnline, className, onClick, }: UserRowProps): import("react").JSX.Element;
