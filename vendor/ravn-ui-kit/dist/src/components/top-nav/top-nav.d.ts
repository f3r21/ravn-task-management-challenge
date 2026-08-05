import { type ReactNode } from 'react';
export interface TopNavProps {
    /** Controlled search value. */
    searchValue?: string;
    /** Placeholder text shown in the search input. */
    searchPlaceholder?: string;
    /** Called on every search keystroke. */
    onSearchChange?: (value: string) => void;
    /** Called when the search is submitted (Enter). */
    onSearchSubmit?: (value: string) => void;
    /** Trailing 24x24 icon (Figma "Icon Placeholder", `currentColor`). Defaults to a bell/notifications glyph. */
    icon?: ReactNode;
    /** Logged-in user's name (used for avatar initials/alt text). */
    userName?: string;
    /** Logged-in user's avatar image URL. */
    userAvatar?: string;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/**
 * TopNav
 *
 * Figma: "Search Bar" COMPONENT_SET (Top Navigation Bar00/01.md), confirmed against
 * the real in-context instance in `Dashboard Mockup.md` (`left: 296px` — flush against
 * the 232px sidebar — `right: 36px`, `top: 32px`, height 64px). This is the full bar:
 * neutral-4 background, 16px radius (`--radius-md`), 12px/24px padding, containing the
 * `SearchBar` icon+input on the left (Frame 649) and a trailing icon/avatar slot on the
 * right (Frame 648).
 *
 * Confirmed via live Figma access (node 82:2742, fileKey ZUAB3jXFyKFktoAzvN7h1T) after
 * shipping with an unverified guess: Property 1=Default vs Property 1=Selected differ
 * structurally — Frame 648 is 88px wide (bell icon + avatar) in Default, 136px (close icon +
 * bell icon + avatar) in Selected. Selected's search input also renders a bare text-cursor
 * glyph in place of the "Search" placeholder, i.e. Selected is the *focused* state. The extra
 * icon in Selected is a literal close/X glyph — confirming the clear-search interpretation
 * this component already shipped with. One real correction from the live check: the close
 * icon is the FIRST child of the trailing group in Selected, not appended after the bell
 * icon as previously implemented — order is close (when shown), then bell, then avatar.
 * Not yet re-verified: whether the real trigger is strictly "focused" vs this component's
 * "has a non-empty value" (Selected's cursor glyph doesn't prove which) — kept the
 * value-based trigger since showing a clear button with nothing to clear is the weaker UX
 * default, but this is a values-based judgment call, not a confirmed fact. No `title` prop:
 * no title/heading layer exists anywhere in the real component.
 */
export declare function TopNav({ searchValue: controlledSearchValue, searchPlaceholder, onSearchChange, onSearchSubmit, icon, userName, userAvatar, className, }: TopNavProps): import("react").JSX.Element;
