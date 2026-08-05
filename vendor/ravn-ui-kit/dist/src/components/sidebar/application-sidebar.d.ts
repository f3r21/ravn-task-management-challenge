import { type SidebarItemProps } from './sidebar-item';
export interface ApplicationSidebarProps {
    /** Logo / brand element shown at the top */
    logo?: React.ReactNode;
    /** Navigation items to render */
    items: SidebarItemProps[];
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/**
 * ApplicationSidebar
 *
 * @remarks
 * Source: `ApplicationSidebar00/01.md`, cross-checked against the real
 * in-context "Sidebar" layer in `Mockups/Dashboard Default View/Dashboard
 * Mockup.md` (the only ground-truth signal that resolves which of the two
 * component-doc exports is the real desktop size).
 *
 * `01.md`'s "Sidebar" (232×836, `neutral.4` #2C2F33, `border-radius: 24px`,
 * logo top:12px, "Sidebar Tab List" starting at top:96px) matches the
 * Dashboard Mockup's Sidebar layer property-for-property (same width,
 * height, radius, and offsets). `00.md`'s "Sidebar" (310×844, no
 * border-radius, logo top:36px, tab list top:120px) never appears in any
 * real desktop screen — its only other occurrences are `SideBarItem00.md`
 * (already flagged in Chunk 8 as Android/iOS mobile-breakpoint noise) and
 * `Mockups/Mobile/Android/.../Sidebar.md`. So 310px is the mobile-Android
 * sidebar width, not a second real desktop variant — no `size` prop here,
 * matching the single-size precedent Chunk 8 set for the mobile-vs-desktop
 * split on SidebarItem's source files.
 *
 * No export — the isolated component doc, the in-context Dashboard Mockup,
 * or any other mockup file — shows a footer/user-profile row anywhere
 * inside the Sidebar's bounds; the only Avatar near this layout belongs to
 * the Top Nav bar (Chunk 10's scope), not the sidebar. A previously-added
 * `footer` prop had zero ground-truth basis and zero real consumers in this
 * codebase — removed as fabricated, same treatment Chunk 4 gave Button's
 * unfounded `size`/`isLoading` props.
 */
export declare function ApplicationSidebar({ logo, items, className }: ApplicationSidebarProps): import("react").JSX.Element;
