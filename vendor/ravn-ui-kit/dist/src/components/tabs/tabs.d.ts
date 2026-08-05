import React from 'react';
export interface TabItem {
    /** Unique identifier for the tab; used to key the tab button, its panel, and their ARIA relationships. */
    id: string;
    /** Text label displayed inside the tab button. */
    label: string;
    /** Optional icon to show before the label */
    icon?: React.ReactNode;
}
export interface TabsProps {
    /** Tab item definitions */
    items: TabItem[];
    /** Content to render per tab (keyed by tab id) */
    panels?: Record<string, React.ReactNode>;
    /** Default selected tab id (uncontrolled) */
    defaultSelectedKey?: string;
    /** Controlled selected tab id */
    selectedKey?: string;
    /** Called when selected tab changes */
    onSelectionChange?: (key: string) => void;
    /** Additional class names applied to the root container, merged last via `cn()`. */
    className?: string;
}
/**
 * Tabs
 *
 * Figma: "Tabs" COMPONENT_SET inside "Button, Switch Button" frame
 * (Property 1=Selected / Variant2). Frame 299: flex column, padding
 * 12px 0px 8px, gap 8px, label + 2px indicator strip below it.
 * Label: Android/Body/S/regular (13px/20px, weight 400, letter-spacing
 * 0.25px, centered) -- per the Chunk 1 precedent, mobile-labeled Figma
 * text styles (Android/Roboto here, iOS/SF Pro elsewhere) don't get a
 * separate font-family token, they render on the shared `--font-sans`.
 * Active tab: text + indicator primary-4. Inactive: text neutral-2,
 * indicator same as background (i.e. invisible) -- hover:text-neutral-1
 * is a spec-free, non-contradicted addition. The full-width `border-b`
 * previously under the tablist had no grounding in spec (only the
 * per-tab indicator strip is real) and has been removed.
 *
 * @remarks
 * This is a hand-rolled `role="tablist"`/`role="tab"`/`role="tabpanel"`
 * implementation with click-based selection only — it does not use
 * react-aria's `useTabListState`/`useTabList`/`useTab`/`useTabPanel` hooks
 * and does not yet support the WAI-ARIA APG's arrow-key tab navigation.
 * Tracked as a follow-up accessibility improvement, not a Figma-fidelity
 * issue.
 */
export declare function Tabs({ items, panels, defaultSelectedKey, selectedKey: controlledKey, onSelectionChange, className, }: TabsProps): React.JSX.Element;
