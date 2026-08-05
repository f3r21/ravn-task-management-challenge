import type { Meta, StoryObj } from '@storybook/react';
import { AddTaskModal } from './add-task-modal';
declare const meta: Meta<typeof AddTaskModal>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
/**
 * `Mockups/Dashboard Edit Task/Add  Task Modal00.md` reopens this exact same
 * widget pre-filled (Estimate "0 Points", Assignee "Jerome Bell" already
 * set) rather than showing a distinct edit component.
 */
export declare const Edit: Story;
