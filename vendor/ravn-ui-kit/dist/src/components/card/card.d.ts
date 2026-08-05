export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Card content. */
    children: React.ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
export declare function Card({ children, className, ...props }: CardProps): import("react").JSX.Element;
