import type { Meta, StoryObj } from '@storybook/react';
import { TaskTable } from './task-table';
declare const meta: Meta<typeof TaskTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Playground: Story;
export declare const Empty: Story;
export declare const Loading: Story;
