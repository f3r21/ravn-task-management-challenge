import type { Meta, StoryObj } from '@storybook/react';
import { ProjectInfo } from './project-info';
declare const meta: Meta<typeof ProjectInfo>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithIcon: Story;
export declare const LongTitle: Story;
