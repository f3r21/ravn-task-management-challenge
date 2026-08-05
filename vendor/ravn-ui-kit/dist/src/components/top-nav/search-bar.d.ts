export interface SearchBarProps {
    /**
     * Placeholder text shown in the input.
     * @default 'Search...'
     */
    placeholder?: string;
    /** Controlled value. */
    value?: string;
    /** Called on every keystroke. */
    onChange?: (value: string) => void;
    /** Called when user submits (Enter). */
    onSubmit?: (value: string) => void;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/**
 * SearchBar
 *
 * Figma: "Frame 649" inside the "Search Bar" component (Top Navigation Bar00/01.md,
 * confirmed against the in-context instance in `Dashboard Mockup.md`). This is only
 * the icon+input portion — Frame 649 has a fixed `width: 171px` (24px icon + 24px
 * gap + 123px text) with no fill/padding of its own, so it renders transparently
 * and is meant to be composed inside a container that supplies the neutral-4
 * background (see `TopNav`, which wraps this plus the trailing icon/avatar slot
 * to match the full "Search Bar" component).
 * - Icon: 24x24, neutral-2
 * - Text: Desktop/Body/M/regular — SF Pro Display 15px/24px, letter-spacing 0.75px, neutral-2
 */
export declare function SearchBar({ placeholder, value: controlledValue, onChange, onSubmit, className, }: SearchBarProps): import("react").JSX.Element;
