import type { Meta, StoryObj } from '@storybook/react';
import { TaskMetaBadges } from './task-meta-badges';
declare const meta: Meta<typeof TaskMetaBadges>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const CountsOnly: Story;
