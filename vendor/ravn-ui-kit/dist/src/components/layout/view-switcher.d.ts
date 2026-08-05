export interface ViewSwitcherProps {
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
export declare function ViewSwitcher({ value, onChange, leftIcon, rightIcon, leftLabel, rightLabel, className, }: ViewSwitcherProps): import("react").JSX.Element;
