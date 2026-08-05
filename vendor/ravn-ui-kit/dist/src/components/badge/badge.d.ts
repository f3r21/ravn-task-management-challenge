export interface BadgeProps {
    /**
     * Visual style of the badge.
     * @default 'neutral'
     */
    variant?: 'neutral' | 'success' | 'warning' | 'danger';
    /** Badge label / content. */
    children: React.ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
export declare function Badge({ variant, children, className }: BadgeProps): import("react").JSX.Element;
