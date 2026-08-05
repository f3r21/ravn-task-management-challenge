import React from 'react';
export interface ModalProps {
    /** Dialog heading, rendered in the header and programmatically associated via `aria-labelledby`. */
    title: string;
    /** Whether the modal is currently open. When `false`, nothing is rendered. */
    isOpen: boolean;
    /** Called when the modal should close — backdrop click, Escape key, or the header close button. */
    onClose: () => void;
    /** Modal body content. */
    children: React.ReactNode;
    /**
     * Tailwind max-width class controlling the dialog's width.
     * @default 'max-w-md'
     */
    width?: string;
}
/**
 * Modal shell used by all modal variants.
 * Uses react-aria useDialog + useOverlay for accessibility.
 */
export declare function Modal({ title, isOpen, onClose, children, width }: ModalProps): React.JSX.Element | null;
/** Convenience hook for uncontrolled modal open/close state */
export declare function useModal(defaultOpen?: boolean): {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
};
