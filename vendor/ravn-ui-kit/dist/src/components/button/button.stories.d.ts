import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
declare const meta: Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Playground: Story;
/** Property 1=Primary, State=Normal / Property 1=Secondary, State=Selected/Unselected. */
export declare const States: Story;
export declare const Disabled: Story;
