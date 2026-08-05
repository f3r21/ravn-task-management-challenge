import { type AriaTextFieldProps } from 'react-aria';
export interface InputProps extends AriaTextFieldProps {
    /** Label text rendered above the input. When omitted, no label is shown. */
    label?: string;
    /**
     * Error message rendered below the input. When set, also switches the
     * input to its error visual state (danger border/outline).
     */
    error?: string;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
export declare function Input({ label, error, className, ...props }: InputProps): import("react").JSX.Element;
