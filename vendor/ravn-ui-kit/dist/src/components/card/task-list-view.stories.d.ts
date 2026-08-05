import type { Meta, StoryObj } from '@storybook/react';
import { TaskListView } from './task-list-view';
declare const meta: Meta<typeof TaskListView>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Playground: Story;
export declare const Empty: Story;
export declare const Loading: Story;
/**
 * Figma's `Frame 654` (`Mockups/Dashboard Default View/Dashboard Mockup.md`)
 * lays out 3 `Task List View` instances side by side, `flex-direction: row`,
 * `gap: 32px` — this is the real "board" layout; there is no separate
 * per-column background/border/radius component wrapping each list.
 */
export declare const Board: Story;
