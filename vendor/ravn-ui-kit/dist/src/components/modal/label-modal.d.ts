import { type TagProps } from '../tag/tag';
export interface Label {
    /** Unique identifier, echoed back in `onSelect`. */
    id: string;
    /** Label text shown on the tag pill. */
    text: string;
    /** Color variant applied to the tag pill, matching `Tag`'s own variant palette. */
    variant?: TagProps['variant'];
}
export interface LabelModalProps {
    /** Full list of selectable labels shown as rows. */
    labels: Label[];
    /** Called with the label of the row the user clicked. */
    onSelect: (label: Label) => void;
    /** Additional class names, merged last via `cn()` so they can override defaults (e.g. absolute positioning). */
    className?: string;
}
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
 * contradict spec" bar as `Skeleton`/`Datepicker`'s native input.
 */
export declare function LabelModal({ labels, onSelect, className }: LabelModalProps): import("react").JSX.Element;
