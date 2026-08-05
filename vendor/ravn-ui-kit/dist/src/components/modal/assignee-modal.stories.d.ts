import type { Meta, StoryObj } from '@storybook/react';
import { AssigneeModal } from './assignee-modal';
declare const meta: Meta<typeof AssigneeModal>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithRoles: Story;
