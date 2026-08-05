export interface DatePickerMenuProps {
    /**
     * Currently selected date. Passing this makes the component controlled;
     * pair it with `onChange` to update the selection.
     */
    value?: Date;
    /** Initial selected date when the component is uncontrolled. */
    defaultValue?: Date;
    /** Called with the newly selected date when the user clicks a day or the "Today" footer action. */
    onChange?: (date: Date) => void;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/**
 * DatePickerMenu
 *
 * Figma: "DatePicker / Menu" component (Components/Datepicker.md), confirmed as the real desktop
 * component via 3 real in-context instances (Mockups/Task Add Task/Add Task Modal05.md,
 * Mockups/Dashboard Add Task/Add Task Modal05.md, Mockups/Dashboard Edit Task/Add Task Modal06.md)
 * -- all pixel-identical to the isolated doc export. `Date Picker.md`'s 320x472 DM-Sans "hero"
 * variant only ever appears in the mobile-Android mockup tree (out of scope) and never in any
 * desktop screen, confirming the existing `typography.mdx` note that it doesn't back a shipped
 * component -- this file is the real target.
 *
 * - 280px wide, bg-neutral-5, border-neutral-2, rounded-4 (4px), shadow-elevation (3-layer)
 * - Header: 4 nav icons (double-chevron = year, single chevron = month) flanking a centered
 *   "Month YYYY" label (SF Pro Text Semibold 14px/22px) -- the prior implementation only had
 *   month nav; year nav (DoubleLeft/DoubleRight) was missing entirely
 * - Weekday row (Sun-Sat) + a fixed 6-week grid (spec's Content frame is a fixed 226px for
 *   8px/12px padding + 7 rows @ 30px, i.e. always 6 week-rows regardless of month length)
 * - Day cells: 24x24, rounded-2 (2px), SF Pro Text Regular 14px/22px; neutral-1 for the viewed
 *   month, neutral-2 for lead/trail days from adjacent months
 * - The single real highlighted-cell instance in spec is a 1px solid primary-4 border,
 *   rounded-2 -- no filled/bg-primary-4 cell instance exists anywhere in the export. The prior
 *   implementation had two competing unverified treatments (bg-primary-4 "selected" + bordered
 *   "today"); resolved to the one verified treatment (border only) applied to the selected date.
 * - Two full-width 1px neutral-2 dividers (header/content, content/footer) were missing entirely.
 * - Footer: centered text-only button, primary-4, SF Pro Text Regular 14px/22px, with a
 *   permanently-hidden ("display: none") search icon slot. Confirmed via direct Figma
 *   inspection (Dev Mode "Content" field, not just the layer's name -- the static CSS export
 *   only captured the layer name "Button" and couldn't distinguish it from actual rendered
 *   text) that the button's real content is literally "Today", matching the "jump to today"
 *   behavior already implemented -- this was a correct guess, now a confirmed fact.
 */
export declare function DatePickerMenu({ value: controlledValue, defaultValue, onChange, className, }: DatePickerMenuProps): import("react").JSX.Element;
