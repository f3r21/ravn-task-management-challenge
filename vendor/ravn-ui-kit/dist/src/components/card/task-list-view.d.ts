import { type TaskCardProps } from './task-card';
export interface TaskListViewProps {
    /** Project/section title, rendered via `ProjectInfo` (e.g. `"Working (03)"`). */
    title: string;
    /** Optional trailing 24×24 icon forwarded to `ProjectInfo`. */
    icon?: React.ReactNode;
    /** Tasks rendered as a vertical stack below the header, each spread onto a `TaskCard`. Renders an empty-state message when the array is empty. */
    tasks: TaskCardProps[];
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
export declare function TaskListView({ title, icon, tasks, isLoading, className }: TaskListViewProps): import("react").JSX.Element;
