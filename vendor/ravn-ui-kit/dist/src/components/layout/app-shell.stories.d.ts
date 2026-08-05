import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from './app-shell';
declare const meta: Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * `Mockups/Dashboard Default View/Dashboard Mockup.md` — `Sidebar` + `Search
 * Bar` + a `Top Bar` (`ViewSwitcher` + primary "add" `Button`) + `Frame 654`'s
 * row of 3 `Task List View`s (`gap: 32px`), all at the real offsets encoded in
 * `AppShell`.
 */
export declare const Dashboard: Story;
/**
 * `Mockups/Task Default View/My Task Mockup.md` — the same `AppShell` (same
 * `Sidebar`/`Search Bar`/`Top Bar` offsets, `Table View` content starting
 * 8px lower than the Dashboard's card row, treated as canvas-measurement
 * noise rather than a real distinct offset) with a `TaskTable` in place of
 * the card board, confirming this page is table- not card-based.
 */
export declare const TaskDefaultView: Story;
