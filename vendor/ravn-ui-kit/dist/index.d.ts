import { AriaButtonProps } from 'react-aria';
import { AriaFieldProps } from 'react-aria';
import { AriaListBoxOptions } from 'react-aria';
import { AriaMenuProps } from 'react-aria';
import { AriaPopoverProps } from 'react-aria';
import { AriaSelectProps } from 'react-aria';
import { AriaTextFieldProps } from 'react-aria';
import { ClassValue } from 'clsx';
import { default as default_2 } from 'react';
import { JSX } from 'react';
import { ListProps } from 'react-stately';
import { ListState } from 'react-stately';
import { OverlayTriggerState } from 'react-stately';
import { ReactNode } from 'react';
import { SVGProps } from 'react';

/**
 * The kit's shared colour vocabularies.
 *
 * ## The problem this fixes
 *
 * Four small colour-ish string unions had grown up independently, and two of them used
 * the *same words* for different things:
 *
 * | Component(s)                                   | Union                                                     |
 * | ---------------------------------------------- | --------------------------------------------------------- |
 * | `Button` / `TextButton`                        | `'primary' \| 'secondary'`                                 |
 * | `Tag` / `TaskCard.tags` / `TaskTableRow.tags`  | `'primary' \| 'secondary' \| 'tertiary' \| 'neutral' \| 'blue'` |
 * | `Badge`                                        | `'neutral' \| 'success' \| 'warning' \| 'danger'`          |
 * | due-date urgency                               | `'normal' \| 'warning' \| 'overdue'`                       |
 *
 * `variant="primary"` on a `Button` meant *this is the primary action* (and happens to
 * be red). `variant="primary"` on a `Tag` meant *this chip is red*. Nothing in either
 * name said which system you were in, so moving between them meant relearning. The tag
 * union was internally inconsistent too — `primary`/`secondary`/`tertiary` are rank
 * words sitting next to `blue`, which is a colour — and `warning` meant two unrelated
 * things depending on whether you were on a `Badge` or a due date.
 *
 * ## The fix, and what deliberately did *not* change
 *
 * These are genuinely three different axes, so collapsing them into one union would
 * have been wrong. Instead each axis gets one named, exported, documented type, and no
 * word is reused across two of them:
 *
 * - `AccentColor` — "which of the palette's accent colours is this", named the way the
 *   design names it.
 * - `StatusTone` — "what does this state mean", on the design's separate status ramp.
 * - `DueDateUrgency` — the one domain-specific status the kit models directly.
 *
 * `Button`/`TextButton`'s `variant` is **not** in this file on purpose. It is Figma's
 * own "Property 1" on the "Button" COMPONENT_SET (Primary/Secondary), an action-
 * hierarchy axis whose colour is a consequence rather than the point. Folding it in
 * here would recreate exactly the collision this file exists to remove.
 */
/**
 * A categorical accent colour: which of the palette's accent hues a chip, tag or
 * indicator is painted in, with no meaning attached to the choice.
 *
 * Named by colour rather than by ramp position because that is how the design itself
 * names them — Figma's "Tag" COMPONENT_SET carries a `Type` property whose values are
 * literally `General`/`Green`/`Blue`/`Yellow`/`Red` (Tags00.md, Tags01.md). The kit
 * previously renamed those to `neutral`/`secondary`/`blue`/`tertiary`/`primary`, which
 * both obscured the source and collided with `Button`'s hierarchy words. The consuming
 * app independently arrived at the same colour-named vocabulary for its own `Tag`
 * (`'green' | 'amber' | 'blue' | 'red' | 'neutral'`), which is corroboration rather
 * than coincidence.
 *
 * Each value maps to a verified ramp token, confirmed against `Tags01.md`:
 *
 * | Value     | Figma `Type` | Token         | Hex       |
 * | --------- | ------------ | ------------- | --------- |
 * | `neutral` | General      | `neutral-2`   | `#94979A` |
 * | `red`     | Red          | `primary-4`   | `#DA584B` |
 * | `green`   | Green        | `secondary-4` | `#70B252` |
 * | `yellow`  | Yellow       | `tertiary-4`  | `#E5B454` |
 * | `blue`    | Blue         | `blue`        | `#2F61BF` |
 *
 * Note `red` is `primary-4`, **not** the `danger` ramp — those are two different reds
 * (`#DA584B` vs `#E82F39`) and the design uses the former for tags. Anything conveying
 * an error state wants `StatusTone`, not this.
 */
export declare type AccentColor = 'neutral' | 'red' | 'green' | 'yellow' | 'blue';

/**
 * AddTaskModal
 *
 * Figma: "Add Task Modal" COMPONENT (`Mockups/Dashboard Add Task/Add Task Modal00-06.md`,
 * cross-checked against the in-context instance in `Components/Task Column01.md`). This is an
 * inline widget (578×184, neutral-3 bg, 8px radius) composited directly into a Task Column, not
 * a centered dialog — no backdrop, no header/close button, so unlike the other modals in this
 * folder it does not use the shared `Modal` shell. Anatomy: a borderless title input (Desktop/
 * Body/XL/bold, 20px, neutral-2 placeholder) and a "Tags" row of 4 trigger chips (Estimate/
 * Assignee/Label/Due date, in that order), and a Cancel/Create Task button pair. Live Figma
 * access (Chunk 25) confirmed the row has exactly one previously-unimplemented trigger — "Label"
 * (icon `remix-icons/fill/finance/price-tag-3-fill`), sitting between Assignee and Due date —
 * correcting the earlier claim of "two remaining ground-truth chip slots... with no legible
 * glyph." Only the trigger's icon/text/position are Figma-confirmed; its popover (`LabelModal`)
 * has no captured anatomy and is an engineering-only addition — see that component's own doc
 * comment.
 *
 * Row 2's unfilled trigger chips render as the real muted "Tag" component (`bg: rgba(148,151,154,.1)`
 * = neutral-2/10%, exactly `Tag`'s solid/neutral style) — confirmed by pixel match. Once a value is
 * picked, the spec drops that background entirely (plain icon+text on the modal's own neutral-3
 * surface); the primary Create button's disabled color (title empty) is `primary-2`, its enabled
 * color is `primary-4` — already exactly `TextButton`'s existing disabled/enabled primary styling
 * (Chunk 4), so `isDisabled={!title.trim()}` reproduces the empty-vs-typed contrast for free.
 *
 * `Mockups/Dashboard Edit Task/Add  Task Modal00.md` (note: source filename has a double
 * space) reuses this exact same "Add Task Modal" component (identical 578×184/neutral-3/8px
 * anatomy) reopened with the Estimate ("0 Points") and Assignee ("Jerome Bell") triggers
 * already filled — confirming Edit is this same widget pre-populated, not a distinct
 * component. `initialTitle`/`initialDueDate`/`initialPoints`/`initialAssignee` (all optional,
 * defaulting to the prior blank-create behavior) seed the internal state for that reuse.
 */
export declare function AddTaskModal({ isOpen, onClose, assignees, labels, onSubmit, initialTitle, initialDueDate, initialPoints, initialAssignee, initialLabel, className, }: AddTaskModalProps): default_2.JSX.Element | null;

export declare interface AddTaskModalProps {
    /** Whether the widget is currently mounted. */
    isOpen: boolean;
    /** Called when the widget should close without submitting (Cancel button). */
    onClose: () => void;
    /** People selectable in the assignee trigger's popover. */
    assignees?: Assignee[];
    /** Labels selectable in the label trigger's popover — see `LabelModal`. */
    labels?: Label[];
    /** Called with the form values when the user submits a valid (non-empty title) task. */
    onSubmit?: (data: {
        title: string;
        dueDate?: Date;
        points?: number;
        assignee?: Assignee;
        label?: Label;
    }) => void;
    /** Pre-fills the title field (edit flow — reopening on an existing task). */
    initialTitle?: string;
    /** Pre-fills the due-date trigger (edit flow). */
    initialDueDate?: Date;
    /** Pre-fills the estimate trigger (edit flow). */
    initialPoints?: number;
    /** Pre-fills the assignee trigger (edit flow). */
    initialAssignee?: Assignee;
    /** Pre-fills the label trigger (edit flow). */
    initialLabel?: Label;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * The clock on a due-date badge.
 *
 * Figma: `remix-icons/line/system/alarm-line`, 20.506x19.253 glyph in a 24x24 box — by far
 * the most-referenced icon in the design file. Tier 1 (verbatim export).
 */
export declare function AlarmIcon(props: IconProps): JSX.Element;

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
export declare function ApplicationSidebar({ logo, items, className }: ApplicationSidebarProps): JSX.Element;

export declare interface ApplicationSidebarProps {
    /** Logo / brand element shown at the top */
    logo?: React.ReactNode;
    /** Navigation items to render */
    items: SidebarItemProps[];
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
export declare function AppShell({ logo, sidebarItems, topNavProps, topBar, children, className, }: AppShellProps): JSX.Element;

export declare interface AppShellProps {
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

export declare interface Assignee {
    /** Unique identifier, echoed back in `onSelect`. */
    id: string;
    /** Display name shown in the row. */
    name: string;
    /** Optional secondary text (job title/role) — no ground-truth "User" row instance shows one; kept as a non-contradicted, opt-in field forwarded to `UserRow`. */
    role?: string;
    /** Optional avatar image URL; falls back to initials when omitted. */
    avatarSrc?: string;
}

/**
 * Assignee — marks a person control (assignee in the modal, owner in the filters).
 *
 * Figma: 16x21 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export declare function AssigneeIcon(props: IconProps): JSX.Element;

/**
 * AssigneeModal
 *
 * Figma: "Assignee Modal" COMPONENT inside "Task Column" frame (Task Column01.md L762-1386).
 * A small anchored popover (239×432 for the full 7-row export, height scales with the list here),
 * neutral-3 bg, 1px neutral-2 border, 8px radius — not a centered dialog, so unlike the shared
 * `Modal` shell this has no backdrop/close chrome: the parent conditionally mounts it, same
 * convention as `DatePickerMenu`. Built on the shared `Popover` primitive (see that file's doc
 * comment) for real Escape/outside-click dismissal and focus management, previously missing
 * entirely. Anatomy is a decorative header label (Figma's "Input text" placeholder style,
 * Desktop/Body/XL/bold, neutral-2) followed by one 56px-tall "User" row (Avatar + name, reusing
 * `UserRow`) per assignee, no selection checkmark and no footer — clicking a row is the assign
 * action (every real "User" row instance renders identically, with no highlighted/selected
 * variant anywhere in the export).
 */
export declare function AssigneeModal({ assignees, onSelect, onClose, triggerRef, className, }: AssigneeModalProps): JSX.Element;

export declare interface AssigneeModalProps {
    /** Full list of assignable people shown as rows. */
    assignees: Assignee[];
    /** Called with the assignee of the row the user clicked. */
    onSelect: (assignee: Assignee) => void;
    /** Called when the popover should close without a selection — Escape or an outside click. */
    onClose: () => void;
    /** Ref to the trigger button that opens this popover — see `Popover`'s `triggerRef`. */
    triggerRef?: PopoverProps['triggerRef'];
    /** Additional class names, merged last via `cn()` so they can override defaults (e.g. absolute positioning). */
    className?: string;
}

/**
 * Renders an assignee's 32px avatar and name together in a table cell.
 * Figma "Task Assign Name Cell" (Task Column02.md): Avatar (32x32, matches `Avatar` `size="sm"`)
 * + name text, Desktop/Body/M/regular, neutral.1.
 */
export declare function AssigneeNameCell({ name, avatarSrc }: AssigneeNameCellProps): JSX.Element;

export declare interface AssigneeNameCellProps {
    /** Assignee's full name, shown next to the avatar and used for initials fallback. */
    name: string;
    /** Avatar image URL. Falls back to initials derived from `name` when omitted. */
    avatarSrc?: string;
}

/**
 * Attachment count — first of the three counters in a task card's footer.
 *
 * Figma: `remix-icons/line/editor/attachment-2`, 11.7382x12.6733 glyph in a 16x16 box.
 * Tier 1 (verbatim export).
 */
export declare function AttachmentIcon(props: IconProps): JSX.Element;

/** Circular user avatar that shows an image, or initials derived from `name` when no `src` is provided. */
export declare function Avatar({ src, name, size, className }: AvatarProps): JSX.Element;

export declare interface AvatarProps {
    /** Image URL to render. Falls back to initials derived from `name` when omitted. */
    src?: string;
    /** Full name used for the fallback initials and the image `alt` text. */
    name?: string;
    /**
     * Controls the avatar's width, height, and initials font size.
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

export declare function Badge({ variant, children, className }: BadgeProps): JSX.Element;

export declare interface BadgeProps {
    /**
     * What the badge's state *means*, on the design's status ramps.
     *
     * Deliberately a different vocabulary from `Tag`'s `AccentColor`: these resolve to the
     * palette's `Success`/`Warning`/`Danger` ramps, which are separate from and not equal to
     * `Secondary`/`Tertiary`/`Primary` (`success-4` `#80DA5B` is not `secondary-4` `#70B252`;
     * `danger-5` `#E82F39` is not `primary-4` `#DA584B`). Reach for `Tag` when the colour is
     * a category with no meaning attached, and `Badge` when it is a status.
     * @default 'neutral'
     */
    variant?: StatusTone;
    /** Badge label / content. */
    children: React.ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * Notifications bell — sits at the right of the top navigation bar.
 *
 * Figma: 20x21 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export declare function BellIcon(props: IconProps): JSX.Element;

/**
 * Button (icon button)
 *
 * Figma: "Button" COMPONENT_SET inside "Button, Switch Button" frame
 * (Button, Switch Button01.md). Fixed 40×40px, border-radius 8px (--radius-sm).
 * - Property 1=Primary, State=Normal: bg primary-4, white icon, no border.
 * - Property 1=Secondary, State=Selected: transparent bg, 1px primary-4
 *   border, primary-4 icon.
 * - Property 1=Secondary, State=Unselected: transparent bg, no border,
 *   white icon.
 *
 * The focus ring below is `focus-visible:outline-2 focus-visible:outline-primary-4
 * focus-visible:outline-offset-2` with **no `outline-none`** in front of it, and
 * that omission is deliberate — every focusable component in this kit follows the
 * same rule. In Tailwind v4 `outline-none` compiles to
 * `--tw-outline-style: none; outline-style: none`, and `outline-2` compiles to
 * `outline-style: var(--tw-outline-style); outline-width: 2px`. So pairing them
 * makes the ring resolve to `outline-style: none` and never paint — the width and
 * colour are computed but draw nothing. (This is a v3→v4 behaviour change:
 * v3's `outline-none` meant "transparent 2px ring", which is now `outline-hidden`
 * and sets the same variable, so it is not the fix either.) Left off, the
 * `@property --tw-outline-style` initial value of `solid` applies and the ring
 * renders. Do not "tidy up" by adding `outline-none` back.
 *
 * This was shipped broken across 21 components and found only when the consuming
 * app migrated its task-card menu onto this kit's `Menu` and lost the visible
 * focus indicator on the sole entry point to Edit/Delete — a utility-layer
 * `outline-none` also outranks a consumer's own `@layer base :focus-visible`
 * rule, so it suppressed the app's global ring too.
 */
export declare function Button({ variant, isSelected, children, className, isDisabled, ...props }: ButtonProps): JSX.Element;

export declare interface ButtonProps extends AriaButtonProps {
    /**
     * Figma "Property 1": Primary is a single documented state (solid fill,
     * no selected/unselected toggle). Secondary is icon-only chrome that
     * toggles via `isSelected`.
     * @default 'secondary'
     */
    variant?: 'primary' | 'secondary';
    /**
     * Figma "State=Selected/Unselected" — only meaningful for `variant="secondary"`;
     * `variant="primary"` has no selected/unselected state in the source.
     * @default false
     */
    isSelected?: boolean;
    /** 24×24 icon content. Should use `currentColor` so it inherits the button's icon color. */
    children: React.ReactNode;
    /** Required — icon-only buttons need an accessible name. */
    'aria-label': string;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * Calendar — marks a date control in the task modal and the filter bar.
 *
 * Figma: 20x20 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export declare function CalendarIcon(props: IconProps): JSX.Element;

export declare function Card({ children, className, ...props }: CardProps): JSX.Element;

export declare interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Card content. */
    children: React.ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * Double chevron pointing left — the date picker's "previous year" control.
 *
 * Tier 3: no Figma source. The design's date picker only draws month navigation, but
 * stepping a year at a time through single-month arrows is twelve clicks, so the kit's
 * `DatePickerMenu` adds year controls. Drawn as two of `ChevronLeftIcon`'s strokes so it
 * reads as "the same arrow, twice".
 */
export declare function ChevronDoubleLeftIcon(props: IconProps): JSX.Element;

/**
 * Double chevron pointing right — the date picker's "next year" control.
 *
 * Tier 3: no Figma source. See `ChevronDoubleLeftIcon`.
 */
export declare function ChevronDoubleRightIcon(props: IconProps): JSX.Element;

/**
 * Chevron pointing down — indicates a control opens a menu (`Select`, `MultiSelect`, and a
 * task table's group headers).
 *
 * Tier 3: no Figma source. The design file has no disclosure/expand glyph anywhere, but
 * `Select`/`MultiSelect` are themselves kit-built components with no Figma counterpart
 * (see their doc comments), and a collapsed combobox with no affordance reads as static
 * text. Drawn to the same 24x24 / 2px-stroke system as the chevrons above so the family
 * stays visually coherent.
 */
export declare function ChevronDownIcon(props: IconProps): JSX.Element;

/**
 * Chevron pointing left — the date picker's "previous month" control.
 *
 * Figma: "Arrow Chevron Back" in `Date Picker.md` — a 24x24 box containing a vector inset
 * left 33.33% / right 37.65% / top 20.83% / bottom 21.14%, stroked `2px solid #FFFFFF`.
 * That resolves to a ~7x14 chevron at 2px. Tier 2 (reconstructed): the size and stroke
 * are the design's, but the exact path points are derived from those insets, and the glyph
 * is centred in its box — Figma's own Back and Forward instances each sit about a pixel
 * off-centre in opposite directions, which is instance-placement noise rather than
 * something a design system should reproduce.
 */
export declare function ChevronLeftIcon(props: IconProps): JSX.Element;

/**
 * Chevron pointing right — the date picker's "next month" control, and the trailing glyph
 * on a task table row's "Details" link.
 *
 * Figma: "Arrow Chevron Forward" in `Date Picker.md`, mirroring `ChevronLeftIcon`'s
 * metrics. The task-table "Details" link resolves to `remix-icons/line/system/
 * arrow-right-s-line` (`UI_KIT_MASTER_PLAN.md` Chunk 25); no verbatim path export exists
 * for either, and one stroked chevron serves both. Tier 2 (reconstructed) — see
 * `ChevronLeftIcon` for the derivation.
 */
export declare function ChevronRightIcon(props: IconProps): JSX.Element;

/**
 * Close / dismiss — `Modal`'s close button, `TopNav`'s clear-search button, and a toast's
 * dismiss control.
 *
 * Tier 3: no Figma source. The design draws no close affordance on any of its modals, but
 * a dialog a user cannot dismiss by pointer is not shippable. Path data is carried over
 * verbatim from the consuming app, where the same glyph was hand-authored for the same
 * reason — the two sets agreeing matters more than either one's origin here.
 */
export declare function CloseIcon(props: IconProps): JSX.Element;

export declare function cn(...inputs: ClassValue[]): string;

/**
 * Comment count — third counter in a task card's footer.
 *
 * Figma: `remix-icons/line/communication/chat-3-line`, 13.3333x13.3333 glyph in a 16x16
 * box. Tier 1 (verbatim export).
 */
export declare function CommentIcon(props: IconProps): JSX.Element;

export declare function Datepicker({ label, isLabelVisible, error, description, className, ...props }: DatepickerProps): JSX.Element;

/**
 * DatePickerMenu
 *
 * Deliberately has **no `error`/`description`/`isRequired` surface**, unlike `Input`,
 * `Datepicker`, `Select`, `MultiSelect` and `LabelCheckbox`. It is a floating calendar
 * panel with no label and no trigger of its own — the consumer owns the trigger and
 * passes a `triggerRef`. A validation message rendered inside this popover would sit in a
 * surface that disappears the moment the user dismisses it, and would be announced from a
 * `role="dialog"` rather than from the field it belongs to. The error belongs on whatever
 * field owns the trigger; wrap that in `FormField` (or use `Datepicker`, which is the
 * text-input variant and takes `error` directly).
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
 *
 * Accessibility: built on the shared `Popover` primitive (see that file's doc comment) plus
 * react-stately's `useCalendarState` + react-aria's `useCalendar`/`useCalendarGrid`/
 * `useCalendarCell` for the day grid — previously a fully hand-rolled 42-individually-tabbed-
 * button grid with no `role="grid"`/`role="gridcell"` and no arrow-key navigation. The month-nav
 * chevrons use `useCalendar`'s `prevButtonProps`/`nextButtonProps`; the year-nav chevrons (which
 * react-aria's calendar hooks have no built-in equivalent for) call
 * `state.focusPreviousSection(true)`/`focusNextSection(true)` directly, the same "jump by the
 * next larger unit" primitive `Shift+PageUp`/`Shift+PageDown` use internally.
 *
 * One deliberate behavior change from adopting real calendar semantics: lead/trail days from
 * adjacent months (`isOutsideMonth`) are now non-interactive (not focusable, not selectable) —
 * react-aria's `useCalendarCell` treats `isOutsideMonth` cells as disabled by design, matching
 * how most calendar widgets treat context-only adjacent-month days. Previously every one of the
 * 42 cells was independently clickable/selectable regardless of month; that was never confirmed
 * against Figma (only the dimmed *styling* of those cells is spec'd), so trading it for
 * correct, standard grid semantics is a net accessibility improvement, not a regression against
 * verified spec.
 */
export declare function DatePickerMenu({ value: controlledValue, defaultValue, onChange, onClose, triggerRef, className, }: DatePickerMenuProps): JSX.Element;

export declare interface DatePickerMenuProps {
    /**
     * Currently selected date. Passing this makes the component controlled;
     * pair it with `onChange` to update the selection.
     */
    value?: Date;
    /** Initial selected date when the component is uncontrolled. */
    defaultValue?: Date;
    /** Called with the newly selected date when the user clicks a day or the "Today" footer action. */
    onChange?: (date: Date) => void;
    /** Called when the popover should close without a selection — Escape or an outside click. */
    onClose: () => void;
    /** Ref to the trigger button that opens this popover — see `Popover`'s `triggerRef`. */
    triggerRef?: PopoverProps['triggerRef'];
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

export declare interface DatepickerProps extends AriaTextFieldProps {
    /** Label text. Rendered `sr-only` unless `isLabelVisible`. When omitted, no label. */
    label?: string;
    /**
     * Renders the label visibly above the input instead of `sr-only`.
     *
     * Defaults to `false` — the design draws no field labels; see `FIELD_LABEL_CLASS`.
     * The label still names the input for assistive tech either way.
     * @default false
     */
    isLabelVisible?: boolean;
    /**
     * Error message rendered below the input. When set, also switches the
     * input to its error visual state (danger border/outline).
     */
    error?: string;
    /** Helper text rendered below the input. Hidden while `error` is set. */
    description?: string;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * Shared mapping from due-date urgency onto the accent palette, so the card, the table
 * cell and the table row cannot drift from each other on what "overdue" looks like.
 *
 * Not spec-verified: no warning/overdue instance of the due-date `Tag` appears anywhere
 * in `Cards00.md`/`Cards01.md`, so this is spec-*consistent* (it reuses the real `Tag`
 * palette rather than inventing one-off colours) rather than spec-confirmed.
 */
export declare const DUE_DATE_URGENCY_COLOR: Record<DueDateUrgency, AccentColor>;

/** Renders a task's due date with color-coded urgency. Figma "Due Date Cell" (Task Column02.md). */
export declare function DueDateCell({ date, urgency }: DueDateCellProps): JSX.Element;

export declare interface DueDateCellProps {
    /** Due date text to display (already formatted, e.g. `"6 July, 2020"`). */
    date: string;
    /**
     * Color treatment conveying how urgent the due date is.
     * @default 'normal'
     */
    urgency?: DueDateUrgency;
}

/**
 * How close a task's due date is, as a domain concept the kit renders directly.
 *
 * `soon` was previously called `warning`, which collided with `StatusTone`'s `warning`
 * while meaning something unrelated and resolving to a different ramp. `soon` also
 * matches the consuming app's own `DueDateTone` (`'overdue' | 'soon' | 'normal'`),
 * so the two sides no longer need a translation table for this concept.
 *
 * Renders through `AccentColor`: `normal` → `neutral`, `soon` → `yellow`,
 * `overdue` → `red`.
 */
export declare type DueDateUrgency = 'normal' | 'soon' | 'overdue';

/**
 * What fills the space where content would be.
 *
 * **No Figma source.** The design file draws no empty state for any surface — every
 * mockup shows populated boards, tables and lists. It exists anyway because the kit
 * shipped two hardcoded English strings for exactly this ("No tasks in this view." in
 * `TaskListView`, "No tasks yet." in `TaskTable`), which a consumer could neither
 * translate, restyle, nor attach a "create the first task" action to. Ported from the
 * consuming app's own `EmptyState`, which had already worked the semantics out.
 *
 * **Deliberately not a live region.** It used to carry `role="status"` in the app, on
 * the reasoning that it appears in response to something the user just did — but a live
 * region announces *changes* to its contents, and this mounts with its text already
 * inside, so it announced nothing at all. The fix is a region that outlives the states
 * and swaps its text (the consuming board has one that reports "no tasks to show"); do
 * not re-add `role="status"` here expecting it to work. It stays a labelled `group` so
 * it is still something a screen-reader user can find and step into.
 */
export declare function EmptyState({ title, description, icon, action, label, className, }: EmptyStateProps): JSX.Element;

export declare interface EmptyStateProps {
    /** The headline — what is missing, in the user's terms. Required: an empty state with no text is just a gap. */
    title: string;
    /** Optional second line explaining why it is empty or what would fill it. */
    description?: string;
    /**
     * Optional glyph rendered above the title, at 48×48. Should use `currentColor` so it
     * picks up the muted tint rather than fighting it.
     */
    icon?: React.ReactNode;
    /** A way out of the empty state — clearing a filter, creating the first task. Rendered below the text. */
    action?: React.ReactNode;
    /**
     * Names the region for assistive technology, so it is findable rather than three loose
     * strings. Override it whenever more than one empty state can be on screen at once —
     * two identically-named groups are two things a screen-reader user cannot tell apart.
     * @default 'No results'
     */
    label?: string;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * EstimateModal
 *
 * Figma: "Estimate Modal" COMPONENT inside "Task Column" frame (Task Column01.md L1800-2231).
 * A small anchored popover (122×208, neutral-3 bg, 1px neutral-2 border, 8px radius) — not a
 * centered dialog, so unlike the shared `Modal` shell this has no backdrop/close chrome: the
 * parent conditionally mounts it, same convention as `DatePickerMenu`. Built on the shared
 * `Popover` primitive (see that file's doc comment) for real Escape/outside-click dismissal and
 * focus management, previously missing entirely. Anatomy is a decorative header label (Figma's
 * "Input text" placeholder style, Desktop/Body/XL/bold, neutral-2) followed by 5 point-value rows
 * (icon + label, 4px/16px padding, 4px radius, no background by default) with no footer —
 * clicking a row is the confirm action.
 */
export declare function EstimateModal({ value, onSelect, onClose, triggerRef, className, }: EstimateModalProps): JSX.Element;

export declare interface EstimateModalProps {
    /** Currently selected point value, if any — highlights the matching row. */
    value?: number;
    /** Called with the point value of the row the user clicked. */
    onSelect: (points: number) => void;
    /** Called when the popover should close without a selection — Escape or an outside click. */
    onClose: () => void;
    /** Ref to the trigger button that opens this popover — see `Popover`'s `triggerRef`. */
    triggerRef?: PopoverProps['triggerRef'];
    /** Additional class names, merged last via `cn()` so they can override defaults (e.g. absolute positioning). */
    className?: string;
}

/**
 * Renders a task's estimation as plain text -- Figma's "Estimation Cell" (Task Column02.md,
 * "3 Days" sample text; the real in-context "Task Default View" mockup renders it as
 * "N Points") is plain Desktop/Body/M/regular text directly in the cell, no badge/pill chrome.
 */
export declare function EstimationCell({ points }: EstimationCellProps): JSX.Element;

export declare interface EstimationCellProps {
    /** Numeric estimation (story points) rendered as `"N Points"` / `"1 Point"`. */
    points: number;
}

/**
 * Shared helper-text styling.
 *
 * `--color-muted-on-dark`, not the plain `--color-muted` this used to be. Description
 * text renders *outside* the control, on whatever container the field sits in, and that
 * container is not knowable from here — a form field is as likely to be inside a modal as
 * on the shell. `neutral-2` clears AA on the shell (5.25:1) and on a panel (4.58:1) but
 * only manages **3.73:1** on `surface-overlay`, which is precisely the modal card case.
 *
 * `transparent-light-65` composites against whatever is behind it, so it clears AA on all
 * three (6.55 / 6.27 / 5.11:1) without the component having to know its own surface.
 */
export declare const FIELD_DESCRIPTION_CLASS = "text-xs text-muted-on-dark font-sans";

/**
 * Shared error-message styling.
 *
 * `--color-danger-text` (`danger-3`, `#FFA19E`), not the `--color-danger` alias
 * (`danger-5`, `#E82F39`) which is now documented as a border colour. The
 * design has no error state anywhere — no red text, no invalid border, nothing — so the
 * ramp step is a free choice constrained only by contrast, and `danger-5` fails on every
 * surface the kit uses: 3.59:1 on the shell, 3.14:1 on a panel, 2.55:1 on an overlay.
 *
 * `danger-3` is the only step clearing AA everywhere a form can sit: **5.65:1** on
 * `#393D41`, **6.94:1** on `#2C2F33`, **7.95:1** on `#222528`. `danger-4` (`#FF7875`) is
 * the more conventional-looking error red and was rejected for measuring 4.27:1 on the
 * modal card — passing on two surfaces out of three is how the original defect happened.
 *
 * The invalid *border* on each control stays `danger-5`. A border is a non-text boundary
 * needing 3:1 under 1.4.11, measured against the colours it is *adjacent to* — and it
 * separates the field's white interior from the container, clearing 4.29:1 against that
 * interior. It does **not** clear 3:1 against a `surface-overlay` container (2.55:1), so
 * the argument rests on the interior side; `contrast.test.ts` asserts exactly that and
 * nothing broader.
 */
export declare const FIELD_ERROR_CLASS = "text-xs text-danger-text font-sans";

/**
 * Styling for a *visible* field label.
 *
 * Most fields should not use it. The design draws **no field labels at all** — not in the
 * Add/Edit Task modal, not on the search bar, nowhere across 100 export files. A field's
 * own text carries its meaning: the placeholder in the empty state, the value in the
 * filled one. So `isLabelVisible` defaults to `false` on every control and the label
 * renders `sr-only`, which keeps the accessible name without inventing visual chrome.
 *
 * When a consumer does opt in, this is the design's real spec for a small label on a dark
 * surface — the sidebar's `PROJECTS` header (`Dashboard Mockup.md:237-254`): 15px / 600 /
 * 0.75px tracking, which is exactly `--text-body-m`.
 *
 * **The colour is a deliberate deviation, and the ratio is why.** That header's own colour
 * is `#94979A` (`neutral-2`), but it sits on `#2C2F33`, where it measures 4.58:1. On the
 * `#393D41` modal card — where a task form actually lives — the same pairing is
 * **3.73:1**, under AA. `#FFFFFF` is the only other colour the design ever puts on a dark
 * surface, and it clears AA on all three: 11.60:1 on overlay, 13.45:1 on panel, 15.40:1
 * on shell.
 *
 * This was `text-field-label font-semibold text-neutral-3 uppercase`, which was invented
 * twice over: `#393D41` measured **1.41:1** on the shell — the design uses it as a
 * background 55 times and as a border 283 times, and as text zero times — at 12px, a size
 * that appears exactly once in the design system, on an iOS type specimen.
 */
export declare const FIELD_LABEL_CLASS = "text-body-m font-semibold text-main font-sans";

/**
 * What a hidden label renders as.
 *
 * `sr-only`, never `hidden`/`display:none`: those take the label out of the accessibility
 * tree along with the pixels, which would strip the field's accessible name — the exact
 * thing the label exists for.
 */
export declare const FIELD_LABEL_HIDDEN_CLASS = "sr-only";

/** Picks the label class for a control's `isLabelVisible`. */
export declare function fieldLabelClass(isLabelVisible: boolean | undefined): string;

/**
 * Renders whichever of description/error applies, with the aria wiring a field hook
 * produced. Shared so every control reports errors the same way rather than each
 * inventing its own markup.
 *
 * Only one shows at a time, and the error wins. Stacking them pushes the layout around
 * at the exact moment the user is trying to read what went wrong, and the helper text
 * has usually just been superseded by the error anyway.
 */
export declare function FieldMessages({ description, error, descriptionProps, errorMessageProps, }: FieldMessagesProps): JSX.Element | null;

export declare interface FieldMessagesProps {
    /** Helper text. Hidden automatically while `error` is set, so the two never stack. */
    description?: string;
    /** Error message. Its presence is what puts the field in its invalid state. */
    error?: string;
    /** Props from a react-aria field hook's `descriptionProps`. */
    descriptionProps?: React.HTMLAttributes<HTMLElement>;
    /** Props from a react-aria field hook's `errorMessageProps`. */
    errorMessageProps?: React.HTMLAttributes<HTMLElement>;
}

/**
 * FloatingPopover
 *
 * A second, deliberately separate popover primitive from `./popover.tsx`'s
 * `Popover` — not a mode flag on it. `Popover` (Section 2 of
 * `MIGRATION_GAPS.md`) is explicitly non-portalled and CSS-anchored
 * (`absolute` inside a `relative` wrapper), which is the right shape for the
 * modal-shaped popovers it serves (`AssigneeModal`/`EstimateModal`/
 * `LabelModal`/`DatePickerMenu`) but the wrong shape for a dropdown: those
 * anchor inside layout contexts (a filter bar, a table cell) that routinely
 * clip `overflow: hidden`, and CSS `absolute` positioning can't escape that
 * ancestor no matter how the z-index is tuned. `Select`/`MultiSelect` need
 * real anchored-floating positioning that survives being clipped —
 * react-aria's `usePopover` + `Overlay` (portal to `document.body`, flip when
 * there's no room, track the trigger's position) — which is a different
 * enough contract (portalled vs. not, position-tracking vs. not) that
 * overloading `Popover` with an `isPortalled` flag would leave every consumer
 * of that component branching on a mode instead of picking the primitive
 * that already matches their layout.
 *
 * The two `DismissButton`s are visually-hidden bookend controls giving
 * assistive-tech users an explicit way to close the popover from either end
 * of its content, matching `Popover`'s reasoning.
 *
 * Wrapped in `FocusScope restoreFocus` (no `autoFocus` here, unlike
 * `Popover`'s — initial focus placement is left to whichever composing
 * component renders inside, e.g. `ListBox`/`MenuList`'s own `autoFocus`)
 * so closing returns focus to the trigger that opened it, matching
 * `Popover`'s same restoration for the non-portalled family. Without it,
 * closing removes the focused option/item from the DOM and the browser
 * drops focus to `<body>` instead.
 *

 * Escape is handled here in the capture phase rather than left to
 * `usePopover`'s own dismissal for two reasons found by driving this in a
 * real browser rather than trusting jsdom: `ListBox` binds Escape for its
 * own purposes (clearing selection) and stops the event there, so a
 * bubble-phase handler on this element never sees it and the popover stays
 * open; and because this popover is portalled to the end of `<body>`, React
 * still replays the event up the *component* tree, so an Escape that did get
 * through would also reach whatever dialog rendered the trigger and close
 * both layers at once. Capturing before the list gets the event, then
 * stopping propagation after closing, makes Escape dismiss exactly the
 * topmost layer.
 */
export declare function FloatingPopover({ state, children, popoverRef, className, ...props }: FloatingPopoverProps): JSX.Element;

export declare interface FloatingPopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
    /**
     * react-stately overlay-trigger state driving open/close (from
     * `useSelectState`/`useOverlayTriggerState`) — `usePopover` reads/closes
     * through this rather than a bare `isOpen`/`onClose` pair.
     */
    state: OverlayTriggerState;
    children: React.ReactNode;
    /** Ref to the popover element. Provide only if a caller needs to measure/observe it directly. */
    popoverRef?: React.RefObject<HTMLDivElement | null>;
    /** Additional class names applied to the popover surface, merged last via `cn()`. */
    className?: string;
}

/**
 * Wraps an arbitrary control in the kit's label / required / description / error surface.
 *
 * For `Input`, `Select`, `MultiSelect`, `Datepicker` and `LabelCheckbox` you do not need
 * this — each accepts `label`/`description`/`error`/`isRequired` directly and renders the
 * same surface internally, which keeps the common case a flat prop list rather than a
 * nested render prop. Reach for `FormField` when wrapping something the kit does not
 * own: a third-party control, a composite of several inputs, or a custom widget that
 * still owes the user a label and an error.
 *
 * Built on react-aria's `useField`, so the ids and `aria-describedby` wiring come from
 * the same implementation the field hooks use rather than a parallel hand-rolled one.
 */
export declare function FormField({ label, isLabelVisible, description, error, isRequired, children, className, ...props }: FormFieldProps): JSX.Element;

export declare interface FormFieldProps extends Omit<AriaFieldProps, 'errorMessage'> {
    /** Label text. Rendered `sr-only` unless `isLabelVisible`. */
    label?: string;
    /**
     * Renders the label visibly above the control instead of `sr-only`.
     *
     * Defaults to `false` because the design draws no field labels — see
     * `FIELD_LABEL_CLASS`. The label is always present for assistive tech either way; this
     * only decides whether it is painted.
     * @default false
     */
    isLabelVisible?: boolean;
    /** Helper text rendered below the control. Hidden while `error` is set. */
    description?: string;
    /** Error message rendered below the control, and what marks the field invalid. */
    error?: string;
    /**
     * Marks the field required — renders the shared indicator next to the label and sets
     * `aria-required` on the control via the props handed to `children`.
     * @default false
     */
    isRequired?: boolean;
    /**
     * The control. Receives the aria props to spread onto it — at minimum `id` and
     * `aria-describedby`, so the description and error are actually associated rather than
     * merely adjacent.
     */
    children: (fieldProps: React.HTMLAttributes<HTMLElement>) => React.ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * Grid/board view — the sidebar's "dashboard" tab, and the grid option in the view switcher.
 *
 * Figma: `remix-icons/line/system/function-line`, 18x18 glyph in a 24x24 box (the export
 * records the vector inset at 12.5% on all four sides, which is exactly 18/24).
 * Tier 1 (verbatim export).
 */
export declare function GridViewIcon(props: IconProps): JSX.Element;

/**
 * The kit's icon vocabulary.
 *
 * ## Why this exists
 *
 * Icon *slots* (`SidebarItemProps.icon`, `TagProps.icon`, `TaskMetaBadge.icon`, ...) are
 * typed `React.ReactNode`, which pushed the entire glyph vocabulary onto the consumer:
 * the kit shipped zero icons while baking ad-hoc `<svg>` literals into eleven of its own
 * components, and the consuming app maintained a seventeenth-of-its-own set in parallel.
 * The two drifted — the kit's local `AlarmIcon` was a hand-drawn clock, the app's is the
 * design's actual `alarm-line` glyph — so the same concept rendered differently depending
 * on which side of the package boundary you were on. A design system that owns the slots
 * has to own the glyphs too.
 *
 * ## Provenance
 *
 * Three tiers, and every icon below says which one it is. Do not blur them.
 *
 * 1. **Figma-exported** — the `d` attribute is the design's own SVG export, verbatim. The
 *    consuming app keeps those raw exports in `src/ui/icons/assets/*.svg` for byte-level
 *    comparison; the path data here was carried across unchanged.
 * 2. **Reconstructed from Figma layout metrics** — no path export exists, but the design
 *    file records the glyph's box, stroke width and percentage insets, so the geometry is
 *    derived rather than guessed. The comment shows the numbers it was derived from.
 * 3. **No Figma source** — an engineering addition for a control the design never drew.
 *    Stated plainly, with why it exists anyway.
 *
 * Where a glyph resolves to a named `remix-icons` component in the Figma file, that name
 * is recorded. (The design is built on remix-icons; `UI_KIT_MASTER_PLAN.md` Chunks 24/25
 * established this, and the per-component CSS exports name several of them outright.)
 *
 * ## Two things change on the way in from Figma, both deliberate
 *
 * - The baked `fill` becomes `currentColor`, so colour comes from the token layer instead
 *   of being frozen at export time. The design ships the alarm glyph twice, once white and
 *   once red, purely because a fill cannot be overridden; here that is one icon and a text
 *   colour.
 * - Nothing else. In particular the artboard is **not** normalised to a square viewBox.
 *   Most of these glyphs are non-square (`0 0 18 4`, `0 0 20.506 19.253`, ...) and are
 *   kept exactly as the design draws them, because `preserveAspectRatio` defaults to
 *   `xMidYMid meet`: a caller setting `size-6` gets the glyph scaled to fit a 24x24 box
 *   with its own aspect ratio and padding intact, which is what the design intends. Each
 *   icon's comment records the box the design places it in.
 *
 *   Normalising every viewBox to a square was considered and rejected: it would make
 *   `size-*` optically uniform across the set, but it also silently rescales every glyph
 *   at every existing call site, which turns a mechanical import swap into a visual diff
 *   nobody asked for. Uniformity is not worth re-tuning sizes across two repos.
 *
 * ## Sizing
 *
 * The caller's job, via `className` — `size-4`, `size-6`, and so on. No `size` prop: these
 * are plain `<svg>` elements and Tailwind's sizing utilities already express every case,
 * so a prop would be a second, weaker way to say the same thing. Icons carry no intrinsic
 * dimensions, so an unsized icon inherits the SVG default of 300x150 — always size them.
 *
 * ## Accessibility
 *
 * Decorative by default: every icon renders `aria-hidden="true"` unless it is given an
 * accessible name. Pass `aria-label` (or `aria-labelledby`) and the icon promotes itself
 * to `role="img"` and drops the `aria-hidden`, because an icon that has been named is by
 * definition not decorative. Both can still be overridden explicitly — caller-supplied
 * props are spread last and win.
 *
 * ## One component per icon, not `<Icon name="..." />`
 *
 * A name-indexed component needs a lookup map holding every glyph, which is a single
 * module-level object every consumer imports whole — no bundler can tree-shake an unused
 * icon out of it. One export per icon keeps each glyph independently shakeable, gives the
 * consumer real autocomplete and a compile error on a typo rather than a blank render,
 * and matches how the kit's icon slots are already typed (`React.ReactNode`, i.e. you pass
 * `<PlusIcon />`, not a string).
 */
export declare type IconProps = SVGProps<SVGSVGElement>;

export declare function Input({ label, isLabelVisible, error, description, className, ...props }: InputProps): JSX.Element;

export declare interface InputProps extends AriaTextFieldProps {
    /** Label text. Rendered `sr-only` unless `isLabelVisible`. When omitted, no label. */
    label?: string;
    /**
     * Renders the label visibly above the input instead of `sr-only`.
     *
     * Defaults to `false` — the design draws no field labels; see `FIELD_LABEL_CLASS`.
     * The label still names the input for assistive tech either way.
     * @default false
     */
    isLabelVisible?: boolean;
    /**
     * Error message rendered below the input. When set, also switches the
     * input to its error visual state (danger border/outline).
     */
    error?: string;
    /** Helper text rendered below the input. Hidden while `error` is set. */
    description?: string;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

export declare interface Label {
    /** Unique identifier, echoed back in `onSelect`. */
    id: string;
    /** Label text shown on the tag pill. */
    text: string;
    /** Color variant applied to the tag pill, matching `Tag`'s own variant palette. */
    variant?: TagProps['variant'];
}

/**
 * LabelCheckbox
 *
 * Figma: "Label Checkbox" COMPONENT_SET inside "Tags" frame (Tags01.md,
 * Add Task Modal04/05.md). Structurally identical to the Tag "Icon=Left"
 * chip - a 24x24 icon slot + a Desktop/Body/M/regular label, 4px padding
 * 16px, gap 8px, radius 4px, no fill/border. The ground-truth export gives
 * Property 1=Default and Property 1=Selected byte-for-byte identical style
 * values (no distinguishing color), so the checked/unchecked distinction is
 * carried entirely by the icon glyph (empty box vs. checked box), exactly
 * like the two vector states a real checkbox input would render.
 * Uses react-aria useCheckbox for full accessibility.
 */
export declare function LabelCheckbox({ children, isSelected, defaultSelected, onChange, isDisabled, isIndeterminate, error, description, isRequired, className, }: LabelCheckboxProps): JSX.Element;

export declare interface LabelCheckboxProps {
    /** Label content rendered next to the checkbox. */
    children: React.ReactNode;
    /** Controlled selected state. Omit to let the component manage its own state via `defaultSelected`. */
    isSelected?: boolean;
    /**
     * Initial selected state for uncontrolled usage.
     * @default false
     */
    defaultSelected?: boolean;
    /** Called with the next selected state whenever the checkbox is toggled. */
    onChange?: (isSelected: boolean) => void;
    /**
     * Disables interaction and applies a dimmed, non-interactive style.
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Renders the indeterminate ("mixed") visual state, overriding the checkmark
     * regardless of `isSelected`.
     * @default false
     */
    isIndeterminate?: boolean;
    /**
     * Error message rendered below the checkbox. When set, also marks the control invalid
     * to assistive tech and tints the box — previously this control had no way to report a
     * validation failure at all, so a form could reject it without being able to say so.
     */
    error?: string;
    /** Helper text rendered below the checkbox. Hidden while `error` is set. */
    description?: string;
    /**
     * Marks the checkbox required — renders the shared indicator after the label and sets
     * `aria-required`.
     * @default false
     */
    isRequired?: boolean;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * Label / tag — marks a tag control in the task modal and the filter bar.
 *
 * Figma: `remix-icons/fill/finance/price-tag-3-fill`, 20.7988x20.7998 glyph in a 24x24 box.
 * Tier 1 (verbatim export).
 */
export declare function LabelIcon(props: IconProps): JSX.Element;

/**
 * LabelModal
 *
 * Live Figma access (Chunk 25, fileKey `ZUAB3jXFyKFktoAzvN7h1T`) confirmed `AddTaskModal`'s
 * "Tags" row has a 3rd real trigger between Assignee and Due date -- text "Label", icon
 * `remix-icons/fill/finance/price-tag-3-fill` -- previously documented as one of "two remaining
 * ground-truth chip slots... with no legible glyph or contradiction-free semantic." That was
 * wrong: there's exactly one missing trigger, and both its text and icon are fully legible.
 *
 * Only the trigger button itself (icon, text, position) is Figma-confirmed. No popover anatomy
 * for it exists anywhere in the export -- unlike Estimate/Assignee/Due date, whose popovers were
 * separately captured as their own components. This popover's shell, list layout, and selection
 * behavior are therefore an engineering-only addition, modeled on the real `AssigneeModal` shell
 * for visual consistency with its siblings -- same "kept because genuinely useful and doesn't
 * contradict spec" bar as `Skeleton`/`Datepicker`'s native input. Built on the shared `Popover`
 * primitive (see that file's doc comment) for real Escape/outside-click dismissal and focus
 * management, previously missing entirely, same as its `AssigneeModal`/`EstimateModal` siblings.
 */
export declare function LabelModal({ labels, onSelect, onClose, triggerRef, className }: LabelModalProps): JSX.Element;

export declare interface LabelModalProps {
    /** Full list of selectable labels shown as rows. */
    labels: Label[];
    /** Called with the label of the row the user clicked. */
    onSelect: (label: Label) => void;
    /** Called when the popover should close without a selection — Escape or an outside click. */
    onClose: () => void;
    /** Ref to the trigger button that opens this popover — see `Popover`'s `triggerRef`. */
    triggerRef?: PopoverProps['triggerRef'];
    /** Additional class names, merged last via `cn()` so they can override defaults (e.g. absolute positioning). */
    className?: string;
}

/**
 * ListBox
 *
 * Headless option list — the `role="listbox"`/`role="option"` surface shared
 * by `Select` and `MultiSelect`'s popovers, and usable standalone. Built on
 * react-aria's `useListBox`/`useOption` over a react-stately `ListState`,
 * populated via the same `items` + `children` render-function
 * `<Item>`/Collection composition pattern `Tabs` uses for its state hook —
 * not a kit-invented flat prop-array shape — so `ListBox` is generic over
 * any item type/shape rather than a hardcoded `{ id, label }`.
 *
 * Keyboard behavior (arrow keys move focus, Home/End jump to the ends,
 * typeahead-to-select, Enter/Space to select) comes from
 * `useListBox`/`useOption` for free; this component only renders what they
 * report.
 */
export declare function ListBox<T extends object>({ state, listBoxRef, className, ...props }: ListBoxProps<T>): JSX.Element;

export declare interface ListBoxProps<T extends object> extends AriaListBoxOptions<T> {
    /**
     * react-stately list state driving this listbox's collection, selection,
     * and focus. `ListBox` never builds its own state — it's built by
     * `useListState` for a standalone list, or by whichever hook a composing
     * component uses (`Select` uses `useSelectState`, `MultiSelect` uses
     * `useListState` with `selectionBehavior: 'toggle'`) — so the same
     * rendering/keyboard logic works no matter which hook produced the state.
     */
    state: ListState<T>;
    /** Ref to the underlying `<ul>` element. */
    listBoxRef?: React.RefObject<HTMLUListElement | null>;
    /** Additional class names applied to the `<ul>`, merged last via `cn()`. */
    className?: string;
}

/**
 * List view — the sidebar's "my task" tab, and the list option in the view switcher.
 *
 * Figma: 18x16 glyph in a 24x24 box. Tier 1 (verbatim export).
 *
 * Note the design's own sidebar puts `remix-icons/line/business/briefcase-4-line` (a 20x20
 * glyph) on the second sidebar tab rather than this one — see `ApplicationSidebar01.md`.
 * This icon is the one the design uses for the *list* option of the view switcher, and the
 * consuming app reuses it for the sidebar tab as well. Recorded here rather than silently
 * reconciled: swapping the sidebar tab to a briefcase is a design decision, not an icon-set
 * one, and nothing in this kit is blocked on it.
 */
export declare function ListViewIcon(props: IconProps): JSX.Element;

/**
 * The RAVN logomark.
 *
 * Figma: 40x40 in the design. Tier 1 (verbatim export), with one mechanical change:
 * Figma exports it as two separate vectors positioned by percentage inset, and those
 * insets are resolved here into one square artboard — the wordmark occupies
 * x 0-39.62 / y 2-38, and the dot an 11x11 box at x 3.5 / y 27.
 *
 * Unlike every other icon here this one is usually *meaningful* rather than decorative,
 * so it is normally given a name: `<LogoMark aria-label="Ravn" />`.
 */
export declare function LogoMark(props: IconProps): JSX.Element;

/**
 * Menu
 *
 * A dropdown/context menu of actions — e.g. the task card's three-dot
 * options menu (`MIGRATION_GAPS.md` Section 4). Composes `FloatingPopover`
 * (the same portalled, anchored surface `Select`/`MultiSelect` use) over
 * react-stately's `useMenuTriggerState`/`useTreeState` and react-aria's
 * `useMenuTrigger`/`useMenu`/`useMenuItem`. Fully generic over item type via
 * the same Collection/`<Item>` composition `Select`/`ListBox`/`Tabs` use, not
 * a kit-invented `{ id, label }` shape.
 *
 * Unlike `Select`'s pill trigger, this component bakes in no default visual
 * chrome for the trigger button beyond focus/disabled affordances — only
 * interaction states, reusing the `primary-4`/`opacity-50` values already
 * established everywhere else in the kit, not new ones. There is no verified
 * Figma source for a kit-generic menu-trigger surface (the task card's
 * three-dot button lives in the consuming app, not this kit), and trigger
 * content is fully consumer-supplied rather than a fixed icon+value shape —
 * baking in fixed dimensions would fight arbitrary content. `triggerClassName`
 * is expected to supply size/background/radius per call site.
 *
 * This also deliberately does not offer a way to mark an item "destructive"
 * (the reference implementation this was built from special-cased a
 * `'delete'`-keyed item with `text-danger`). That's app-specific convenience
 * tied to one consumer's key naming, not something a generic kit component
 * should assume — a consumer wanting a destructive-looking item can style it
 * directly in the `<Item>`'s own children, the same way `MenuItem` below
 * always renders `item.rendered` untouched.
 */
export declare function Menu<T extends object>({ label, triggerContent, isDisabled, triggerClassName, ...menuProps }: MenuProps<T>): JSX.Element;

/**
 * Overflow / "more actions" affordance — opens a task card's options menu.
 *
 * Figma: 18x4 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export declare function MenuDotsIcon(props: IconProps): JSX.Element;

export declare interface MenuProps<T extends object> extends Omit<AriaMenuProps<T>, 'selectionMode' | 'selectedKeys' | 'defaultSelectedKeys' | 'onSelectionChange' | 'disallowEmptySelection' | 'onClose'> {
    /** Accessible name for the trigger button. Required — an icon-only trigger has no name without it. */
    label: string;
    /** Content rendered inside the trigger button — an icon for the common icon-only case, but any content is accepted. */
    triggerContent: ReactNode;
    /** Disables the trigger, preventing the menu from opening. */
    isDisabled?: boolean;
    /**
     * Additional class names applied to the trigger button, merged last via
     * `cn()`. No default background/size/radius is applied — see the
     * component doc comment for why.
     */
    triggerClassName?: string;
}

/**
 * Modal shell used by all modal variants.
 * Uses react-aria's useModalOverlay (composed of useOverlay + usePreventScroll +
 * aria-hide) so that, while open, body scroll is locked and everything outside
 * the dialog is `inert`/`aria-hidden` to assistive tech — not just visually
 * obscured behind the backdrop.
 */
export declare function Modal({ title, isOpen, onClose, children, width, role, }: ModalProps): default_2.JSX.Element | null;

export declare interface ModalProps {
    /** Dialog heading, rendered in the header and programmatically associated via `aria-labelledby`. */
    title: string;
    /** Whether the modal is currently open. When `false`, nothing is rendered. */
    isOpen: boolean;
    /** Called when the modal should close — backdrop click, Escape key, or the header close button. */
    onClose: () => void;
    /** Modal body content. */
    children: default_2.ReactNode;
    /**
     * Tailwind max-width class controlling the dialog's width.
     * @default 'max-w-md'
     */
    width?: string;
    /**
     * ARIA role for the dialog. Use `'alertdialog'` for a destructive-action
     * confirmation (e.g. a delete confirmation) — it tells assistive tech
     * this dialog demands an immediate response, distinct from an ordinary
     * `'dialog'`.
     * @default 'dialog'
     */
    role?: 'dialog' | 'alertdialog';
}

/**
 * MultiSelect
 *
 * The tag/multi-value picker the app currently hand-rolls (`TaskFormDialog`'s
 * tags field, `BoardFiltersBar`'s tags filter — `MIGRATION_GAPS.md` Section
 * 4). Composes `ListBox` and `FloatingPopover` like `Select` does, but over
 * react-stately's `useListState` instead of `useSelectState`: there is no
 * native multi-select element or single "selected item" to show in the
 * trigger, and the popover should stay open while the user picks several
 * items rather than closing after one — different enough in kind from
 * `Select` that folding them into one component behind a `selectionMode`
 * prop would leave every branch of it asking which mode it's in. No
 * `HiddenSelect` counterpart here for the same reason: a native
 * `<select multiple>` is a scrolling list box that looks nothing like this
 * design, and the control is never submitted as a form field directly — a
 * consuming form reads the selection from `onSelectionChange`.
 *
 * Selected items render as `Tag` chips in the trigger — visual only, no
 * `onRemove`, so the trigger stays a single real `<button>` rather than a
 * button nesting more buttons (invalid and a screen-reader trap). Removal
 * happens the same way selection does: reopen the list and toggle the item
 * off, where its checkmark already shows which items are selected.
 */
export declare function MultiSelect<T extends object>({ label, placeholder, icon, isDisabled, error, description, className, ...props }: MultiSelectProps<T>): JSX.Element;

export declare interface MultiSelectProps<T extends object> extends Omit<ListProps<T>, 'selectionMode' | 'selectionBehavior'> {
    /** Accessible name for the control, announced on the trigger and the option list. */
    label: string;
    /** Shown inside the trigger when no item is selected yet. */
    placeholder: string;
    /** Optional leading icon rendered in the trigger, ahead of the value. */
    icon?: React.ReactNode;
    /** Disables the whole control, preventing the popover from opening. */
    isDisabled?: boolean;
    /**
     * Error message rendered below the trigger. When set, also switches the trigger to its
     * error visual state and marks it invalid to assistive tech.
     */
    error?: string;
    /** Helper text rendered below the trigger. Hidden while `error` is set. */
    description?: string;
    /** Additional class names applied to the trigger's wrapping container, merged last via `cn()`. */
    className?: string;
}

/**
 * Add / create.
 *
 * Figma: 14x14 glyph inside the 40x40 create button. Tier 1 (verbatim export).
 */
export declare function PlusIcon(props: IconProps): JSX.Element;

/**
 * Estimate / story points — marks the points control in the task modal and the filter bar.
 *
 * Figma: 20x18 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export declare function PointsIcon(props: IconProps): JSX.Element;

/**
 * Popover
 *
 * The shared floating-surface shell behind `DatePickerMenu`, `AssigneeModal`,
 * `EstimateModal`, and `LabelModal` — previously each was an independent
 * plain `<div>` with no `useOverlay`, `FocusScope`, dismissal, or role at all
 * (see `MIGRATION_GAPS.md` Section 2). Those four all anchor to a trigger via
 * plain CSS (`absolute` positioning inside a `relative` wrapper, set by the
 * caller's `className`), not a portal — so this primitive is built on
 * react-aria's `useOverlay` + `DismissButton` + `FocusScope` directly rather
 * than `usePopover` (which adds portalling via `Overlay` and floating-ui-style
 * anchored positioning these four don't need). The heavier `usePopover`-based
 * version, for consumers that *do* need real anchor positioning and escape
 * from a clipping ancestor, is this kit's own `FloatingPopover` — see
 * `./floating-popover.tsx` for why the two are separate primitives rather
 * than one component behind an `isPortalled` flag.
 *
 * Non-modal by design: `FocusScope` here moves focus in on open and restores
 * it on close, but does not `contain` — Tab can move past the popover to the
 * next element on the page, same as a native `<select>` dropdown. The two
 * `DismissButton`s are visually-hidden bookend controls so an assistive-tech
 * user tabbing (or swiping, on a screen reader) past either end of the
 * content has an explicit way to close the popover, rather than needing to
 * know Escape or find the trigger again.
 */
export declare function Popover({ isOpen, onClose, triggerRef, role, children, className, ...ariaProps }: PopoverProps): default_2.JSX.Element | null;

export declare interface PopoverProps {
    /** Whether the popover is currently open. When `false`, nothing is rendered. */
    isOpen: boolean;
    /** Called when the popover should close — Escape, an outside click, or a `DismissButton`. */
    onClose: () => void;
    /**
     * Ref to the element that toggles this popover open/closed. Clicking it is
     * excluded from "outside interaction" so a toggle-button trigger doesn't
     * immediately reopen the popover it just closed (react-aria's outside-click
     * handling runs in the click event's capture phase, before the trigger's
     * own `onClick` fires).
     */
    triggerRef?: default_2.RefObject<HTMLElement | null>;
    /**
     * ARIA role for the popover surface. `'dialog'` fits every current consumer:
     * `DatePickerMenu` (a calendar grid — `role="grid"` — inside a dialog
     * popover, the same composition a native date input's popup uses) and the
     * `Assignee`/`Estimate`/`Label` pick-one-option lists, none of which
     * implement full `listbox`/`option` semantics (roving tabindex,
     * `aria-selected`) yet — that's the bigger `ListBox`/`Select` family
     * tracked separately in `MIGRATION_GAPS.md` Section 4, out of scope here.
     * `'dialog'` is the honest role for "a floating region with interactive
     * content and no listbox wiring," not a placeholder for one.
     * @default 'dialog'
     */
    role?: 'dialog';
    /** Accessible name for the popover surface, read by screen readers on open. */
    'aria-label'?: string;
    children: default_2.ReactNode;
    /** Additional class names controlling the popover surface's position/size/appearance. */
    className?: string;
}

/**
 * ProjectInfo
 *
 * Figma: "Project Info" COMPONENT (Cards00.md/Cards01.md, also recurring inside
 * "Task Column03.md"). A single row: title text (flex-grow, truncates) + an optional
 * trailing 24×24 icon. Every real instance across both files shares this exact shape —
 * there is no name/description/status-badge/progress-bar variant anywhere in spec (that
 * was a prior fabrication with zero ground-truth basis and zero consumers).
 */
export declare function ProjectInfo({ title, icon, className }: ProjectInfoProps): JSX.Element;

export declare interface ProjectInfoProps {
    /** Task/project title. Grows to fill the row and truncates to a single line. */
    title: string;
    /**
     * Optional trailing 24×24 icon (Figma "Icon Placeholder" slot). Should use `currentColor`
     * for its fill/stroke — the slot always renders it in neutral.2, matching every captured
     * instance (the icon glyph itself is never legible/labeled in the export).
     */
    icon?: React.ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * The kit's shared form-field surface.
 *
 * **No Figma source for the error/description/required states.** The design file draws
 * labelled fields but no invalid state, no helper text and no required marker anywhere.
 * This exists because only `Input` and `Datepicker` accepted an `error` at all —
 * `Select`, `MultiSelect` and `LabelCheckbox` had no way to report one, so a consuming
 * form could validate a field it could not then mark. Everything below is an engineering
 * addition built to WAI-ARIA's field pattern rather than to a mockup.
 */
/**
 * The required marker.
 *
 * `aria-hidden` on purpose: react-aria already sets `aria-required` on the control
 * itself, so announcing the asterisk too would say "required" twice. It is decoration
 * over a fact the accessibility tree already carries.
 *
 * `--color-danger-text` rather than the `--color-danger` alias — see `FIELD_ERROR_CLASS`.
 */
export declare function RequiredIndicator(): JSX.Element;

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
export declare function SearchBar({ placeholder, value: controlledValue, onChange, onSubmit, className, }: SearchBarProps): JSX.Element;

export declare interface SearchBarProps {
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
 * Search — sits at the left of the search bar.
 *
 * Figma: 20.314x20.314 glyph in a 24x24 box. Tier 1 (verbatim export).
 */
export declare function SearchIcon(props: IconProps): JSX.Element;

/**
 * SegmentedControl
 *
 * Figma: "Segmented Control" COMPONENT inside "Button, Switch Button00/01.md" frame.
 * - Container: bg-neutral-4, padding: 4px, border-radius: 10px, now via the
 *   `--radius-10` token (`rounded-10`) added in Chunk 1 -- previously an
 *   arbitrary-value class before that token existed.
 * - Segments: 0 gap between them, height 32px, padding 4px 24px, radius 8px
 *   (`rounded-sm`, which Chunk 1 redefined to 8px).
 * - Active segment: bg-neutral-2 pill + Drop Shadow Small (`shadow-small`
 *   token, Chunk 1). Text: IOS/Subheadline/S.regular -- 13px/13px,
 *   letter-spacing 1px, weight 400 -- rendered via the shared `--font-sans`
 *   token per the Chunk 1 "no separate SF Pro Text token" precedent.
 * - Inactive: same 13px/regular/neutral-1 label -- Figma shows identical
 *   (white) label color for both states, distinguishing selection purely via
 *   the pill background fill, not a text-color change. Spec also carries a
 *   `filter: drop-shadow` on the inactive pill, but that's a Figma effect on
 *   an otherwise-transparent shape with no visible box -- applying our
 *   `shadow-small` (a `box-shadow`, which always renders behind the full
 *   element box) there would draw a visible phantom rectangle that doesn't
 *   exist in the reference; intentionally omitted.
 *
 * Accessibility: this renders `role="radio"` pill `<button>`s, so per WAI-ARIA
 * they must be contained by `role="radiogroup"` (not `role="group"`, the
 * previous — invalid — wrapper role). Navigation is hand-implemented (roving
 * tabindex + arrow keys) rather than via react-aria's `useRadio`/`useRadioGroup`:
 * those hooks return `inputProps` for a real `<input type="radio">` element
 * (native radio inputs are how they get keyboard/arrow-key behavior for free),
 * which doesn't fit this component's single-`<button>`-per-segment pill shape
 * without swapping in a hidden-native-input + `<label>` structure — a
 * disruptive rewrite of the visual design for a control this small. The
 * arrow-key/roving-tabindex behavior below follows the same WAI-ARIA APG
 * radiogroup pattern those hooks implement (selection follows focus, one
 * tab stop for the whole group).
 */
export declare function SegmentedControl({ options, value: controlledValue, defaultValue, onChange, className, }: SegmentedControlProps): default_2.JSX.Element;

export declare interface SegmentedControlOption {
    /** Unique identifier for the option, used to match against `value`/`defaultValue` and reported by `onChange`. */
    id: string;
    /** Text label displayed for the option. */
    label: string;
    /** Optional icon rendered before the label. */
    icon?: default_2.ReactNode;
}

export declare interface SegmentedControlProps {
    /** The list of segments rendered as selectable options, in display order. */
    options: SegmentedControlOption[];
    /** Selected option `id` for controlled usage. When provided, the component no longer manages its own selection state. */
    value?: string;
    /** Initial selected option `id` for uncontrolled usage. Falls back to the first option's `id` when omitted. */
    defaultValue?: string;
    /** Called with the newly selected option's `id` whenever the user picks a segment. */
    onChange?: (value: string) => void;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * Select
 *
 * The single-value dropdown the app currently hand-rolls in several places
 * (`BoardFiltersBar`'s status/estimate/owner filters, `TaskFormDialog`'s
 * points/assignee/status fields — `MIGRATION_GAPS.md` Section 4). Composes
 * `ListBox` (the option list) and `FloatingPopover` (the portalled, anchored
 * surface) over react-stately's `useSelectState` and react-aria's
 * `useSelect`. Fully generic over item type via `AriaSelectProps<T>`'s own
 * `items`/`children` Collection composition (the same pattern `Tabs` and
 * `ListBox` use), not a kit-invented `{ id, label }` shape.
 *
 * `HiddenSelect` renders a real `<select>` element off-screen, wired to the
 * same state. That isn't redundant with the visible trigger — it's what
 * makes the control work inside a `<form>`, gives mobile browsers their
 * native picker UI, and lets autofill/password managers see a field they
 * recognize. The visible pill-shaped trigger below is purely presentational.
 */
export declare function Select<T extends object>({ isLabelVisible, placeholder, icon, error, description, className, ...props }: SelectProps<T>): JSX.Element;

export declare interface SelectProps<T extends object> extends AriaSelectProps<T> {
    /**
     * Renders `label` visibly above the trigger instead of `sr-only`.
     *
     * Defaults to `false` — the design draws no field labels; see `FIELD_LABEL_CLASS`.
     * `label` still names the trigger for assistive tech either way.
     * @default false
     */
    isLabelVisible?: boolean;
    /** Shown inside the trigger when no item is selected yet. */
    placeholder?: string;
    /** Optional leading icon rendered in the trigger, ahead of the value. */
    icon?: React.ReactNode;
    /**
     * Error message rendered below the trigger. When set, also switches the trigger to its
     * error visual state and associates the message with it via `aria-describedby`, so a
     * screen-reader user reaching the trigger is told what is wrong.
     *
     * Note the trigger does *not* get `aria-invalid`: it is a `role="button"`, which does
     * not support that state. `Input`, `Datepicker` and `LabelCheckbox` — all real form
     * controls — do set it.
     */
    error?: string;
    /** Helper text rendered below the trigger. Hidden while `error` is set. */
    description?: string;
    /** Additional class names applied to the trigger's wrapping container, merged last via `cn()`. */
    className?: string;
}

/** Per-toast overrides accepted by `show`. */
export declare interface ShowToastOptions {
    /**
     * How long this toast stays before dismissing itself, in milliseconds. Pass `null` to
     * make it stay until dismissed — appropriate for an error the user must acknowledge,
     * and inappropriate for anything else.
     */
    timeout?: number | null;
}

export declare function SidebarItem({ icon, label, isActive, badgeCount, onClick, className, }: SidebarItemProps): JSX.Element;

/**
 * @remarks
 * Source: `SideBarItem00/01.md`, the "Sidebar Tab" component
 * (States=Default/Hover/Selected block in `01.md`, the isolated,
 * unambiguous component definition — `00.md`'s in-context instances use
 * mixed Android/iOS text styles for the same layers, which is Figma
 * mobile-breakpoint noise, out of scope per the master-plan mobile note).
 *
 * Real anatomy: fixed 56px-tall row, `padding: 0 0 0 16px` (no right/vertical
 * padding — content is vertically centered by the fixed height), `gap: 16px`,
 * Icon Placeholder (24×24) then label (`flex-grow: 1`) then a 4px-wide,
 * full-height "Rectangle 33" indicator bar flush against the row's right
 * edge. Label is Desktop/Body/M/bold: SF Pro Display, 15px/24px, weight 600,
 * letter-spacing 0.75px (`tracking-wider`, the Chunk 2/3 convention).
 *
 * State matrix (colors only — icon/label always share one color):
 * - Default: `neutral.2` (#94979A), no background, indicator `opacity: 0`.
 * - Hover: `primary.4` (#DA584B), still **no background** (the Hover export
 *   has no `background` line at all — only Selected does), indicator stays
 *   `opacity: 0`.
 * - Selected: `primary.4`, `linear-gradient(90deg, transparent, primary.4
 *   @ 10%)` background, indicator visible (`opacity: 1`).
 *
 * The indicator is kept mounted across all states with only its opacity
 * toggled (matching the spec, which always includes the Rectangle 33 layer)
 * rather than conditionally rendered, so it can transition in/out.
 *
 * `badgeCount` has no ground-truth basis (no export shows a count/dot on
 * this component) but is kept as a non-contradicted, opt-in addition, same
 * treatment earlier chunks gave unspecced extras.
 *
 * Neither export contains an instance, frame, or anatomy for
 * `SidebarItemWithOptions` itself — no kebab-menu, extra icon-button, or
 * distinguishing padding/layout shows up anywhere, only one caption
 * sentence naming it as a sibling of this abstract class. So that variant
 * remains unimplemented, gated on real anatomy data not yet provided.
 */
export declare interface SidebarItemProps {
    /** Optional icon rendered before the label (Figma "Icon Placeholder", 24×24). Should use `currentColor` so it inherits the row's state color. */
    icon?: React.ReactNode;
    /** Text label displayed for the item. */
    label: string;
    /**
     * Whether the item is styled as the current/active selection.
     * @default false
     */
    isActive?: boolean;
    /** Optional numeric badge rendered at the end of the item (e.g. unread count). */
    badgeCount?: number;
    /** Called when the item is clicked. */
    onClick?: () => void;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * Skeleton
 *
 * No ground-truth Figma spec (static exports have no concept of an in-flight
 * loading state) — this is a standalone, non-contradicted utility primitive
 * in the same vein as `switch.tsx`/`datepicker.tsx` (Chunks 5/16): genuinely
 * useful, and nothing in the exported specs contradicts it existing. A simple
 * `animate-pulse` block on the kit's own neutral-3 surface tone, matching the
 * pattern used by comparable production design systems for loading
 * placeholders (pulsing muted block, no skeleton-specific token needed).
 */
export declare function Skeleton({ className }: SkeletonProps): JSX.Element;

export declare interface SkeletonProps {
    /**
     * Tailwind size/shape classes (width, height, rounding) — the primitive has no
     * intrinsic size of its own so it can stand in for text lines, avatars, cards, etc.
     */
    className?: string;
}

/**
 * A semantic status: what a state *means*, rather than which colour it is.
 *
 * Deliberately kept separate from `AccentColor`, because it resolves to a different set
 * of ramps entirely — the design's palette carries `Success`/`Warning`/`Danger` ramps
 * alongside, and distinct from, `Primary`/`Secondary`/`Tertiary` (see
 * `UI Guidelines/Design. Colors.md`). `success-4` (`#80DA5B`) is not `secondary-4`
 * (`#70B252`), and `danger-5` (`#E82F39`) is not `primary-4` (`#DA584B`). Merging the
 * two vocabularies would have quietly repainted every status surface with brand hues.
 */
export declare type StatusTone = 'neutral' | 'success' | 'warning' | 'danger';

/**
 * Subtask count — second counter in a task card's footer.
 *
 * Figma: `remix-icons/line/editor/node-tree`, 12x13.3333 glyph in a 16x16 box.
 * Tier 1 (verbatim export).
 */
export declare function SubtaskIcon(props: IconProps): JSX.Element;

export declare interface TabItem {
    /** Unique identifier for the tab; used to key the tab button, its panel, and their ARIA relationships. */
    id: string;
    /** Text label displayed inside the tab button. */
    label: string;
    /** Optional icon to show before the label */
    icon?: default_2.ReactNode;
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
 * Uses react-stately's `useTabListState` + react-aria's
 * `useTabList`/`useTab`/`useTabPanel` for `role="tablist"`/`role="tab"`/
 * `role="tabpanel"` wiring, which gets WAI-ARIA APG arrow-key navigation
 * (Left/Right, Home/End) and roving tabindex for free — matching how
 * `Input`/`Datepicker`/`SearchBar` already lean on react-aria hooks rather
 * than hand-rolled ARIA. Previously this was a hand-rolled, click-only
 * implementation with no arrow-key support.
 */
export declare function Tabs({ items, panels, defaultSelectedKey, selectedKey, onSelectionChange, className, }: TabsProps): default_2.JSX.Element;

export declare interface TabsProps {
    /** Tab item definitions */
    items: TabItem[];
    /** Content to render per tab (keyed by tab id) */
    panels?: Record<string, default_2.ReactNode>;
    /** Default selected tab id (uncontrolled) */
    defaultSelectedKey?: string;
    /** Controlled selected tab id */
    selectedKey?: string;
    /** Called when selected tab changes */
    onSelectionChange?: (key: string) => void;
    /** Additional class names applied to the root container, merged last via `cn()`. */
    className?: string;
}

/** Compact labeled pill (Style=Solid/Outline × Icon=None/Left × Type=General/Green/Blue/Yellow/Red), optionally removable via a trailing "×" button. */
export declare function Tag({ variant, outline, icon, children, onRemove, className, }: TagProps): JSX.Element;

/** Renders a wrapping list of `Tag` pills for a task row. Figma "Task Tag Cell" (Task Column02.md). */
export declare function TagCell({ labels }: TagCellProps): JSX.Element;

export declare interface TagCellProps {
    /** Tags to render, each with its own label text and optional color variant (defaults to `'neutral'` per tag). */
    labels: {
        label: string;
        variant?: AccentColor;
    }[];
}

export declare interface TagProps {
    /**
     * Which accent colour the chip is painted in — Figma's `Type` property
     * (General/Green/Blue/Yellow/Red) by its own names. Carries no meaning of its own;
     * for a chip that says what a state *means*, use `Badge` and its `StatusTone`.
     * @default 'neutral'
     */
    variant?: AccentColor;
    /**
     * Renders the "Style=Outline" variant (border, transparent fill) instead of
     * the default "Style=Solid" (10%-alpha fill, no border).
     * @default false
     */
    outline?: boolean;
    /**
     * Optional leading icon (Figma "Icon=Left" slot, 24×24px). Should use
     * `currentColor` for its fill/stroke so it inherits the tag's variant color.
     */
    icon?: React.ReactNode;
    /** Tag label content. */
    children: React.ReactNode;
    /** Called when the remove (×) button is pressed. When provided, a remove button is rendered. */
    onRemove?: () => void;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * Kanban-style task summary card showing title, points, due date, tags, assignee, and reactions.
 *
 * Figma: "Task Card" COMPONENT (Cards00.md / Cards01.md), consistent across the IOS/Android/Desktop
 * variants. Anatomy is 4 stacked rows: "Project Info" (title + trailing icon, via the `ProjectInfo`
 * component), "Timer" (points text + due-date `Tag`), "Tags" (colored variant tags), "Reactions"
 * (avatar + `TaskMetaBadges`, formerly named `Reactions` — see that component's doc comment).
 */
export declare function TaskCard({ title, points, dueDateText, dueDateUrgency, tags, assigneeName, assigneeAvatar, metaBadges, className, onClick, }: TaskCardProps): JSX.Element;

export declare interface TaskCardProps {
    /** Task title, shown in the header row and truncated to a single line. */
    title: string;
    /**
     * Story point estimate. Omitted entirely when `undefined`.
     * Rendered as plain text in the due-date row (Figma "Timer" auto-layout has no
     * pill/background behind the "N Pts" text — see Cards01.md L340-359).
     */
    points?: number;
    /** Due date label rendered inside the due-date Tag (e.g. `'3 DAYS'`). The Tag is hidden when not provided. */
    dueDateText?: string;
    /**
     * How urgent the due date is, driving the due-date Tag's colour via the shared
     * `DUE_DATE_URGENCY_COLOR` map so the card, the table cell and the table row cannot
     * disagree about what "overdue" looks like.
     * @default 'normal'
     */
    dueDateUrgency?: DueDateUrgency;
    /**
     * Labeled tags rendered below the title/due date row. Each tag's `variant` defaults to `'neutral'` when omitted.
     * @default []
     */
    tags?: {
        label: string;
        variant?: AccentColor;
    }[];
    /** Name of the assignee, shown next to the avatar and used by `Avatar` as the initials fallback. */
    assigneeName?: string;
    /** Avatar image URL for the assignee, forwarded to `Avatar`. */
    assigneeAvatar?: string;
    /**
     * Metadata badges (e.g. attachment/subtask/comment counts) rendered in the footer (Figma
     * "Frame 653"), via `TaskMetaBadges`. Hidden entirely when empty. Read-only — see
     * `TaskMetaBadges`'s doc comment for why this is no longer a toggleable emoji-reaction row.
     * @default []
     */
    metaBadges?: TaskMetaBadge[];
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
    /** Called when the card is clicked. */
    onClick?: () => void;
}

/**
 * TaskListView
 *
 * Figma: "Task List View" COMPONENT (`Task Column03.md`; confirmed in-context
 * in `Mockups/Dashboard Default View/Dashboard Mockup.md`'s "Frame 654", which
 * lays out 3 Task List View instances in a row, `gap: 32px` — that row is the
 * real "board" layout, not a separately-chromed "TaskColumn" component; see
 * the removal note on `--radius-20` in `theme.css`). Each instance is just a
 * `ProjectInfo` header (order 0) followed by a stack of `TaskCard`s (order 1+),
 * `flex-direction: column`, `gap: 16px` — no background, border, radius, count
 * badge, or "add task" affordance on the frame itself in any real instance
 * across the isolated doc export or the in-context dashboard mockup.
 */
export declare function TaskListView({ title, icon, tasks, isLoading, emptyTitle, emptyDescription, emptyAction, className, }: TaskListViewProps): JSX.Element;

export declare interface TaskListViewProps {
    /** Project/section title, rendered via `ProjectInfo` (e.g. `"Working (03)"`). */
    title: string;
    /** Optional trailing 24×24 icon forwarded to `ProjectInfo`. */
    icon?: React.ReactNode;
    /** Tasks rendered as a vertical stack below the header, each spread onto a `TaskCard`. Renders an `EmptyState` when the array is empty. */
    tasks: TaskCardProps[];
    /**
     * Headline shown when `tasks` is empty. Overridable because the kit cannot know the
     * consumer's language or domain — it previously hardcoded this English string.
     * @default 'No tasks in this view'
     */
    emptyTitle?: string;
    /** Optional second line on the empty state, explaining why the view is empty. */
    emptyDescription?: string;
    /** Optional way out of the empty state (e.g. a "Create task" button), rendered below the text. */
    emptyAction?: React.ReactNode;
    /**
     * Renders 3 skeleton task-card placeholders instead of `tasks` while data is in flight.
     * No ground-truth basis (static exports have no loading state) — an engineering-only
     * addition, same precedent as `Skeleton` itself.
     * @default false
     */
    isLoading?: boolean;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

export declare interface TaskMetaBadge {
    /** Icon rendered before the count. Should use `currentColor` so it inherits the badge's text color. */
    icon: React.ReactNode;
    /** Count value shown next to the icon. Omitted entirely for an icon-only badge (e.g. a plain attachment indicator). */
    count?: number;
    /** Accessible label describing what this badge represents (e.g. "3 comments"). Used as its React key and announced to screen readers in place of the visual count+icon. */
    label: string;
}

/**
 * TaskMetaBadges
 *
 * Formerly `Reactions` — renamed after live Figma access (Chunk 24/25, fileKey
 * `ZUAB3jXFyKFktoAzvN7h1T`) confirmed the real "Reactions" COMPONENT inside "Task Card" doesn't
 * render emoji at all: its instances use named icons `remix-icons/line/editor/attachment-2`,
 * `remix-icons/line/editor/node-tree`, and `remix-icons/line/communication/chat-3-line` — real
 * task metadata (attachments/subtasks/comments), not user-togglable emoji reactions. A full-file
 * structural check also confirmed the component has no variant set at all (a single static
 * COMPONENT, not a COMPONENT_SET), and none of its 505 instances across the entire file ever
 * carries a fill/border override, so there's no active/pressed state in spec either.
 *
 * Redesigned as a read-only row of icon+count badges: `isActive`/`onToggle` are gone (attachments,
 * subtasks, and comments aren't things a user toggles), and `emoji: string` became
 * `icon: React.ReactNode` (a real icon slot, matching the icon-prop convention already used by
 * `Tag`/`AddTaskModal`'s triggers), since the real content is icon components, not emoji
 * characters. `count` is optional — the real leading slot in "Frame 653" renders icon-only, no
 * count ever shown next to it (previously left unimplemented as an "un-glyphed slot"; now just a
 * badge with `count` omitted). Every real captured instance renders as plain white text+icon with
 * no fill, border, or radius (Cards00.md L595-875, Cards01.md L552-833) — preserved exactly.
 */
export declare function TaskMetaBadges({ badges, className }: TaskMetaBadgesProps): JSX.Element;

export declare interface TaskMetaBadgesProps {
    /** Ordered list of metadata badges to render (e.g. attachment/subtask/comment counts). */
    badges: TaskMetaBadge[];
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

/**
 * TaskTable
 *
 * Figma: "Table View" (Mockups/Task Default View/My Task Mockup.md) -- a shared column-header
 * row ("Frame 657") followed by one bordered "Task Table" box per status group (each starting
 * with a "Task Cell" group header, e.g. "To Do (05)"), stacked with a 16px gap. Column widths:
 * Task Name 500 | Task Tags 168 | Estimate 140 | Task Assign Name 168 | Due Date 132 (1108px
 * total). Each group renders as its own `<table>` with `border-collapse` so the individually
 * bordered cells in `TaskTableRow` merge into single hairlines instead of doubling, resolving
 * the boxed-grid-vs-flat-row mismatch this chunk was flagged to fix.
 */
export declare function TaskTable({ groups, isLoading, emptyTitle, emptyDescription, emptyAction, className, }: TaskTableProps): JSX.Element;

export declare interface TaskTableGroup {
    /** Group/status title, e.g. `"To Do (05)"`. Figma "Task Cell" -- Desktop/Body/L/bold. */
    title: string;
    /** Rows belonging to this group. */
    rows: TaskTableRowProps[];
    /**
     * Trailing action icons for this group's header (Figma shows an "add"/"more" icon pair,
     * `display: none` in most captured groups and visible in exactly one -- no legible glyph or
     * contradiction-free trigger condition, so left as a spec-free opt-in slot rather than a
     * fabricated always-on pair).
     */
    actions?: React.ReactNode;
}

export declare interface TaskTableProps {
    /** Status groups rendered top to bottom, each its own bordered box per Figma's "Task Table". */
    groups: TaskTableGroup[];
    /**
     * Renders the header row plus 5 skeleton rows instead of `groups` while data is in
     * flight. No ground-truth basis (static exports have no loading state) — an
     * engineering-only addition, same precedent as `Skeleton` itself.
     * @default false
     */
    isLoading?: boolean;
    /**
     * Headline shown when `groups` is empty. Overridable because the kit cannot know the
     * consumer's language or domain — it previously hardcoded this English string.
     * @default 'No tasks yet'
     */
    emptyTitle?: string;
    /** Optional second line on the empty state, explaining why the table is empty. */
    emptyDescription?: string;
    /** Optional way out of the empty state (e.g. a "Create task" button), rendered below the text. */
    emptyAction?: React.ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

export declare interface TaskTableReaction {
    /** Emoji/glyph shown next to the count, also used as its React key. */
    emoji: string;
    /** Count value shown before the glyph. */
    count: number;
}

/**
 * TaskTableRow
 *
 * Figma: "Task Table Row" (Task Column02.md; in-context inside "Task Table" in
 * Mockups/Task Default View/My Task Mockup.md). A row of 5 individually boxed cells --
 * own neutral.4 fill + 1px neutral.3 border each -- not a single flat row with one shared
 * border, resolving the structural mismatch this chunk was flagged to fix. Must be rendered
 * inside a `<table><tbody>` (see `TaskTable`) so the cell borders collapse into hairlines.
 */
export declare function TaskTableRow({ index, title, indicatorColor, reactions, isSelected, onSelectedChange, tags, estimationPoints, assigneeName, assigneeAvatar, dueDate, dueDateUrgency, onClick, onViewDetails, }: TaskTableRowProps): JSX.Element;

export declare interface TaskTableRowProps {
    /**
     * Row index shown before the title (Figma's "01"/"02" sample text), zero-padded to 2 digits.
     * Restarts per status group, matching the real "Task Default View" mockup ("To Do (05)"'s
     * rows read 01-05, "In Progress"'s restart at 01).
     */
    index: number;
    /** Task title shown in the Task Name column, truncated to a single line. */
    title: string;
    /**
     * Color of the "Line 1" status/priority stripe flush against the row's left edge. Takes the
     * shared `AccentColor` vocabulary, though only `red`/`green`/`yellow` actually appear across
     * the row samples in the real "Task Default View" mockup -- `neutral` and `blue` are
     * available for consistency with `Tag`, not because the spec shows them. No spec evidence
     * ties this color to due-date urgency or any other field, so it's a plain, independent prop.
     * @default 'green'
     */
    indicatorColor?: AccentColor;
    /**
     * Reaction counters (e.g. comment count, subtask count) rendered after the title, via a plain
     * `count`+`emoji` pair -- read-only, not the clickable/toggleable footer reactions `Reactions`
     * renders on `TaskCard`. Figma's 3rd slot in this same row is a separate "Details" link, not
     * another count widget -- see `onViewDetails` below.
     * @default []
     */
    reactions?: TaskTableReaction[];
    /**
     * Called when the row's trailing "Details" link is clicked; renders a "Details" label with a
     * right-chevron icon when provided, hidden otherwise. Confirmed via live Figma access (Chunk 25,
     * fileKey `ZUAB3jXFyKFktoAzvN7h1T`) that this row's 3rd slot -- previously documented as having
     * "no legible glyph/count content" -- is in fact literal text "Details" paired with
     * `remix-icons/line/system/arrow-right-s-line`, not another reaction-style count.
     */
    onViewDetails?: () => void;
    /**
     * Shows a checkbox before the row index. Figma's "Task Name Cell" renders this icon slot at
     * `opacity: 0` in "Property 1=Default" and fully opaque in "Property 1=Hover" -- an evidenced
     * hover-reveal, reproduced here via `group-hover`. Stays visible once `isSelected` so a
     * checked row doesn't hide its own checkmark when the pointer moves away.
     * @default false
     */
    isSelected?: boolean;
    /** Called with the row's next selected state when the checkbox is toggled. */
    onSelectedChange?: (isSelected: boolean) => void;
    /**
     * Tags rendered in the Task Tags column.
     * @default []
     */
    tags?: {
        label: string;
        variant?: AccentColor;
    }[];
    /** Estimation points. Column renders empty when omitted. */
    estimationPoints?: number;
    /** Assignee's full name. Column renders empty when omitted. */
    assigneeName?: string;
    /** Assignee's avatar image URL, passed through to `AssigneeNameCell`. */
    assigneeAvatar?: string;
    /** Due date text (already formatted). Column renders empty when omitted. */
    dueDate?: string;
    /**
     * Color treatment conveying how urgent `dueDate` is.
     * @default 'normal'
     */
    dueDateUrgency?: DueDateUrgency;
    /** Called when the row is clicked. */
    onClick?: () => void;
}

/**
 * TextButton
 *
 * Figma: "Text Button" COMPONENT_SET inside "Button, Switch Button" frame
 * (Button, Switch Button01.md). Despite the name, this is a solid-fill pill
 * (State=Default/Disable/Hover/Selected × Type=Primary/Secondary), not an
 * underline/link style. Desktop/Body/M/regular: SF Pro Display, 15px/24px,
 * weight 400, letter-spacing 0.75px (tracking-wider). Padding 8px on all
 * sides, border-radius 8px (--radius-sm).
 *
 * Note: the spec's Type=Primary "Disable" state (bg primary-2) is literally
 * identical to its "Hover" state — not a transcription error, both frames
 * use the same #EBA59E swatch.
 */
export declare function TextButton({ variant, isSelected, className, isDisabled, ...props }: TextButtonProps): JSX.Element;

export declare interface TextButtonProps extends AriaButtonProps {
    /**
     * Figma "Type": Primary is a solid primary-4 fill by default. Secondary
     * starts fully transparent and only gains a fill on hover/selected.
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary';
    /** Figma "State=Selected" — a persisted toggle state, distinct from hover/press. */
    isSelected?: boolean;
    /** Button label / content. */
    children: React.ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

export declare interface ToastApi {
    /** Queues a toast. Safe to call from an event handler; returns the queued toast's key. */
    show: (tone: ToastTone, message: string, options?: ShowToastOptions) => string;
}

/** The payload the queue carries for each toast. */
export declare interface ToastContent {
    /** What the toast is reporting, driving its colour. */
    tone: ToastTone;
    /** The message text. Becomes the toast's accessible name. */
    message: string;
}

/**
 * Queues and renders toast notifications.
 *
 * **No Figma source.** The design file draws no notification surface anywhere. It exists
 * because the kit had nothing here at all while the consuming app had already built one
 * and paid for the accessibility lesson documented on `ToastRegion` above — that
 * knowledge belongs in the design system rather than in one of its consumers.
 *
 * Wrap the app once, then call `useToast().show(...)` from anywhere beneath it.
 */
export declare function ToastProvider({ children, duration, maxVisibleToasts, label, closeLabel, }: ToastProviderProps): JSX.Element;

export declare interface ToastProviderProps {
    /** The app (or subtree) that can queue toasts. */
    children: React.ReactNode;
    /**
     * How long a toast stays before dismissing itself, in milliseconds. Individual calls
     * can override it via `show`'s options.
     * @default 5000
     */
    duration?: number;
    /**
     * How many toasts are on screen at once; the rest queue behind them.
     * @default 4
     */
    maxVisibleToasts?: number;
    /**
     * Accessible name for the notification landmark.
     *
     * Worth overriding when the surrounding app already has something called
     * "Notifications" — the kit's own `TopNav` renders a notifications bell, and two
     * landmarks sharing one name is a worse thing to hand a screen reader than a slightly
     * duller label. The consuming app uses `"Alerts"` for exactly this reason.
     * @default 'Notifications'
     */
    label?: string;
    /**
     * Accessible name for each toast's dismiss button.
     * @default 'Dismiss'
     */
    closeLabel?: string;
}

/** What a toast is reporting. Uses the kit's shared `StatusTone` vocabulary. */
export declare type ToastTone = StatusTone;

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
export declare function TopNav({ searchValue: controlledSearchValue, searchPlaceholder, onSearchChange, onSearchSubmit, icon, userName, userAvatar, className, }: TopNavProps): JSX.Element;

export declare interface TopNavProps {
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
 * Convenience hook for uncontrolled modal open/close state.
 * Named `useModalState` (not `useModal`) to avoid shadowing react-aria's own
 * `useModal` hook now that `useModalOverlay` (which composes it) is used above.
 */
export declare function useModalState(defaultOpen?: boolean): {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
};

/**
 * UserRow
 *
 * Figma: "User" COMPONENT inside the "Avatar" frame.
 * - Layout: Avatar (left) + name + role (stacked, right)
 * - Used in the Assignee Modal (no ApplicationSidebar footer exists in the
 *   ground truth — see the Chunk 9 note in `application-sidebar.tsx`)
 * - Background: transparent
 */
export declare function UserRow({ name, role, avatarSrc, size, isOnline, className, onClick, }: UserRowProps): JSX.Element;

export declare interface UserRowProps {
    /** Full name of the user */
    name: string;
    /** Job title or role (e.g. "Frontend Developer") */
    role?: string;
    /** Avatar image URL */
    avatarSrc?: string;
    /**
     * Size variant — matches Avatar sizes
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Whether to show a status dot (online indicator)
     * @default false
     */
    isOnline?: boolean;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
    /** Called when the row is clicked. When provided, the row renders as a `<button>` instead of a `<div>`. */
    onClick?: () => void;
}

/**
 * Access the toast queue from anywhere inside a `ToastProvider`.
 *
 * Throws rather than returning `undefined` outside a provider. A silent no-op would mean
 * a mutation reporting success into nothing, and the missing provider would only be
 * noticed when someone eventually wondered why they never see confirmations.
 */
export declare function useToast(): ToastApi;

/**
 * ViewSwitcher
 *
 * Figma: "Swicter" (`Button, Switch Button01.md`; confirmed as a real, repeated
 * page-level fixture via the identical in-context "Top Bar" instance on both
 * `Mockups/Dashboard Default View/Dashboard Mockup.md` and `Mockups/Task
 * Default View/My Task Mockup.md`) — an 80×40, `neutral.5` background, 8px-radius
 * wrapper holding exactly two of the existing icon `Button`s (`variant="secondary"`),
 * toggling which one carries `isSelected` (`Property 1=Right Selected` /
 * `Property 1=Left Selected`). Both real page instances render the identical
 * selected side, so nothing in spec ties a given side to a given content type
 * (board vs. table) — `value`/`onChange` stay purely positional (`left`/`right`)
 * rather than baking in an unverified board/list semantic, and both icon slots
 * are consumer-supplied (no default glyph) since the source vector paths aren't
 * legible enough to reproduce faithfully, the same "leave the un-legible glyph
 * unimplemented" discipline used for TaskTable/TaskCard's unglyphed slots.
 */
export declare function ViewSwitcher({ value, onChange, leftIcon, rightIcon, leftLabel, rightLabel, className, }: ViewSwitcherProps): JSX.Element;

export declare interface ViewSwitcherProps {
    /** Which side is currently active. */
    value: 'left' | 'right';
    /** Called with the side that was pressed. */
    onChange?: (value: 'left' | 'right') => void;
    /** 24×24 icon for the left button (`currentColor`). */
    leftIcon: React.ReactNode;
    /** 24×24 icon for the right button (`currentColor`). */
    rightIcon: React.ReactNode;
    /** Accessible name for the left button. */
    leftLabel: string;
    /** Accessible name for the right button. */
    rightLabel: string;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}

export { }
