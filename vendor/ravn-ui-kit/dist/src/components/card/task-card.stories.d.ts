import type { Meta, StoryObj } from '@storybook/react';
import { TaskCard } from './task-card';
declare const meta: Meta<typeof TaskCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Playground: Story;
export declare const Overdue: Story;
