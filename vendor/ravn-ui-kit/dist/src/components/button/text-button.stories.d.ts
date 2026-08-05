import type { Meta, StoryObj } from '@storybook/react';
import { TextButton } from './text-button';
declare const meta: Meta<typeof TextButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Playground: Story;
/** State=Default/Hover/Selected/Disable × Type=Primary/Secondary (Button, Switch Button01.md). */
export declare const StateMatrix: Story;
export declare const Selected: Story;
export declare const Disabled: Story;
