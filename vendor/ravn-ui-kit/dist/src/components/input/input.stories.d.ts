import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
declare const meta: Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Playground: Story;
export declare const Error: Story;
export declare const Disabled: Story;
