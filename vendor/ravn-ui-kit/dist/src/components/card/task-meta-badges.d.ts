export interface TaskMetaBadge {
    /** Icon rendered before the count. Should use `currentColor` so it inherits the badge's text color. */
    icon: React.ReactNode;
    /** Count value shown next to the icon. Omitted entirely for an icon-only badge (e.g. a plain attachment indicator). */
    count?: number;
    /** Accessible label describing what this badge represents (e.g. "3 comments"). Used as its React key and announced to screen readers in place of the visual count+icon. */
    label: string;
}
export interface TaskMetaBadgesProps {
    /** Ordered list of metadata badges to render (e.g. attachment/subtask/comment counts). */
    badges: TaskMetaBadge[];
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
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
export declare function TaskMetaBadges({ badges, className }: TaskMetaBadgesProps): import("react").JSX.Element;
