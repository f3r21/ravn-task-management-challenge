export interface Assignee {
    /** Unique identifier, echoed back in `onSelect`. */
    id: string;
    /** Display name shown in the row. */
    name: string;
    /** Optional secondary text (job title/role) — no ground-truth "User" row instance shows one; kept as a non-contradicted, opt-in field forwarded to `UserRow`. */
    role?: string;
    /** Optional avatar image URL; falls back to initials when omitted. */
    avatarSrc?: string;
}
export interface AssigneeModalProps {
    /** Full list of assignable people shown as rows. */
    assignees: Assignee[];
    /** Called with the assignee of the row the user clicked. */
    onSelect: (assignee: Assignee) => void;
    /** Additional class names, merged last via `cn()` so they can override defaults (e.g. absolute positioning). */
    className?: string;
}
/**
 * AssigneeModal
 *
 * Figma: "Assignee Modal" COMPONENT inside "Task Column" frame (Task Column01.md L762-1386).
 * A small anchored popover (239×432 for the full 7-row export, height scales with the list here),
 * neutral-3 bg, 1px neutral-2 border, 8px radius — not a centered dialog, so unlike the shared
 * `Modal` shell this has no backdrop/close chrome and no isOpen/onClose: the parent conditionally
 * mounts it, same convention as `DatePickerMenu`. Anatomy is a decorative header label (Figma's
 * "Input text" placeholder style, Desktop/Body/XL/bold, neutral-2) followed by one 56px-tall "User"
 * row (Avatar + name, reusing `UserRow`) per assignee, no selection checkmark and no footer —
 * clicking a row is the assign action (every real "User" row instance renders identically, with
 * no highlighted/selected variant anywhere in the export).
 */
export declare function AssigneeModal({ assignees, onSelect, className }: AssigneeModalProps): import("react").JSX.Element;
