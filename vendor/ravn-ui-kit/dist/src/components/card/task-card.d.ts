import { type TaskMetaBadge } from './task-meta-badges';
export interface TaskCardProps {
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
     * Color treatment applied to the due date Tag, reflecting how urgent the due date is.
     * Maps onto the real `Tag` variant palette (Chunk 3) rather than one-off warning/danger
     * classes — no warning/overdue instance of this due-date "Tag" appears anywhere in
     * Cards00.md/Cards01.md, so this mapping isn't spec-verified, only spec-consistent.
     * @default 'normal'
     */
    dueDateUrgency?: 'normal' | 'warning' | 'overdue';
    /**
     * Labeled tags rendered below the title/due date row. Each tag's `variant` defaults to `'neutral'` when omitted.
     * @default []
     */
    tags?: {
        label: string;
        variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
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
 * Kanban-style task summary card showing title, points, due date, tags, assignee, and reactions.
 *
 * Figma: "Task Card" COMPONENT (Cards00.md / Cards01.md), consistent across the IOS/Android/Desktop
 * variants. Anatomy is 4 stacked rows: "Project Info" (title + trailing icon, via the `ProjectInfo`
 * component), "Timer" (points text + due-date `Tag`), "Tags" (colored variant tags), "Reactions"
 * (avatar + `TaskMetaBadges`, formerly named `Reactions` — see that component's doc comment).
 */
export declare function TaskCard({ title, points, dueDateText, dueDateUrgency, tags, assigneeName, assigneeAvatar, metaBadges, className, onClick, }: TaskCardProps): import("react").JSX.Element;
