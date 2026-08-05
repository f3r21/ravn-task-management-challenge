import type { ReactNode } from 'react';
import { type ApplicationSidebarProps } from '../sidebar/application-sidebar';
import { type TopNavProps } from '../top-nav/top-nav';
export interface AppShellProps {
    /** Forwarded to `ApplicationSidebar`. */
    logo?: ApplicationSidebarProps['logo'];
    /** Forwarded to `ApplicationSidebar`. */
    sidebarItems: ApplicationSidebarProps['items'];
    /** Forwarded to `TopNav`. */
    topNavProps?: Omit<TopNavProps, 'className'>;
    /**
     * Optional content rendered in the row directly below `TopNav` (the real
     * "Top Bar" — a `ViewSwitcher` on the left, a primary action `Button` on
     * the right, per the real mockups). Omit entirely on pages that don't have
     * one; nothing in spec makes it mandatory.
     */
    topBar?: ReactNode;
    /** Main content area (a `Task List View` row, a `TaskTable`, etc). */
    children: ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/**
 * AppShell
 *
 * Not a named Figma component — the shared page scaffold evidenced by two
 * independent, pixel-identical real mockups: `Mockups/Dashboard Default
 * View/Dashboard Mockup.md` and `Mockups/Task Default View/My Task Mockup.md`
 * both place `Sidebar` (`left:32 top:32`), the `Search Bar`/`TopNav`
 * (`left:296 top:32 right:36 h:64` — flush against the sidebar with the same
 * 32px gap as the page's own left margin), a "Top Bar" row (`top:128 h:48`,
 * `justify-content:space-between`, containing the `Swicter` view-switcher and
 * a lone primary-filled icon `Button`), and the page's main content
 * (`Frame 654`'s Task List View row / the "Table View" list) 16-24px below
 * that — at the exact same offsets on both pages. That page-shell repetition
 * (not a single named component, but a real, consistent composition) is what
 * this promotes into a thin, exported layout — per-component audits (Chunks
 * 8-10) only ever verified `ApplicationSidebar`/`TopNav` in isolation and
 * never cross-checked their combined page position, which is this chunk's
 * (Chunk 17) job.
 *
 * The outer 36px-vs-32px right/left margin asymmetry only exists because the
 * source canvas is a fixed 1440px frame; a fluid page has no equivalent
 * "right edge" to measure against, so this uses one uniform 32px page
 * padding (`p-8`) rather than fabricating a fixed 1440px-wide breakpoint —
 * the same "canvas-fit noise, not a real constraint" judgment call Chunk 7
 * made for Tabs' `px-5`.
 */
export declare function AppShell({ logo, sidebarItems, topNavProps, topBar, children, className }: AppShellProps): import("react").JSX.Element;
