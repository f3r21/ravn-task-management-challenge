export interface DueDateCellProps {
    /** Due date text to display (already formatted, e.g. `"6 July, 2020"`). */
    date: string;
    /**
     * Color treatment conveying how urgent the due date is.
     * @default 'normal'
     */
    urgency?: 'normal' | 'warning' | 'overdue';
}
/** Renders a task's due date with color-coded urgency. Figma "Due Date Cell" (Task Column02.md). */
export declare function DueDateCell({ date, urgency }: DueDateCellProps): import("react").JSX.Element;
export interface AssigneeNameCellProps {
    /** Assignee's full name, shown next to the avatar and used for initials fallback. */
    name: string;
    /** Avatar image URL. Falls back to initials derived from `name` when omitted. */
    avatarSrc?: string;
}
/**
 * Renders an assignee's 32px avatar and name together in a table cell.
 * Figma "Task Assign Name Cell" (Task Column02.md): Avatar (32x32, matches `Avatar` `size="sm"`)
 * + name text, Desktop/Body/M/regular, neutral.1.
 */
export declare function AssigneeNameCell({ name, avatarSrc }: AssigneeNameCellProps): import("react").JSX.Element;
export interface EstimationCellProps {
    /** Numeric estimation (story points) rendered as `"N Points"` / `"1 Point"`. */
    points: number;
}
/**
 * Renders a task's estimation as plain text -- Figma's "Estimation Cell" (Task Column02.md,
 * "3 Days" sample text; the real in-context "Task Default View" mockup renders it as
 * "N Points") is plain Desktop/Body/M/regular text directly in the cell, no badge/pill chrome.
 */
export declare function EstimationCell({ points }: EstimationCellProps): import("react").JSX.Element;
export interface TagCellProps {
    /** Tags to render, each with its own label text and optional color variant (defaults to `'neutral'` per tag). */
    labels: {
        label: string;
        variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'blue';
    }[];
}
/** Renders a wrapping list of `Tag` pills for a task row. Figma "Task Tag Cell" (Task Column02.md). */
export declare function TagCell({ labels }: TagCellProps): import("react").JSX.Element;
export interface TaskTableReaction {
    /** Emoji/glyph shown next to the count, also used as its React key. */
    emoji: string;
    /** Count value shown before the glyph. */
    count: number;
}
export interface TaskTableRowProps {
    /**
     * Row index shown before the title (Figma's "01"/"02" sample text), zero-padded to 2 digits.
     * Restarts per status group, matching the real "Task Default View" mockup ("To Do (05)"'s
     * rows read 01-05, "In Progress"'s restart at 01).
     */
    index: number;
    /** Task title shown in the Task Name column, truncated to a single line. */
    title: string;
    /**
     * Color of the "Line 1" status/priority stripe flush against the row's left edge. Reuses the
     * same 3 hues already verified for `Tag` (`primary`/`secondary`/`tertiary`) -- the only 3 that
     * appear across the row samples in the real "Task Default View" mockup. No spec evidence ties
     * this color to due-date urgency or any other field, so it's a plain, independent prop.
     * @default 'secondary'
     */
    indicatorColor?: 'primary' | 'secondary' | 'tertiary';
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
        variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'blue';
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
    dueDateUrgency?: 'normal' | 'warning' | 'overdue';
    /** Called when the row is clicked. */
    onClick?: () => void;
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
export declare function TaskTableRow({ index, title, indicatorColor, reactions, isSelected, onSelectedChange, tags, estimationPoints, assigneeName, assigneeAvatar, dueDate, dueDateUrgency, onClick, onViewDetails, }: TaskTableRowProps): import("react").JSX.Element;
export interface TaskTableGroup {
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
export interface TaskTableProps {
    /** Status groups rendered top to bottom, each its own bordered box per Figma's "Task Table". */
    groups: TaskTableGroup[];
    /**
     * Renders the header row plus 5 skeleton rows instead of `groups` while data is in
     * flight. No ground-truth basis (static exports have no loading state) — an
     * engineering-only addition, same precedent as `Skeleton` itself.
     * @default false
     */
    isLoading?: boolean;
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
export declare function TaskTable({ groups, isLoading, className }: TaskTableProps): import("react").JSX.Element;
