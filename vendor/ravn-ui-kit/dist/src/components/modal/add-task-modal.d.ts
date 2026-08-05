import React from 'react';
import { type Assignee } from './assignee-modal';
import { type Label } from './label-modal';
export interface AddTaskModalProps {
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
export declare function AddTaskModal({ isOpen, onClose, assignees, labels, onSubmit, initialTitle, initialDueDate, initialPoints, initialAssignee, initialLabel, className, }: AddTaskModalProps): React.JSX.Element | null;
