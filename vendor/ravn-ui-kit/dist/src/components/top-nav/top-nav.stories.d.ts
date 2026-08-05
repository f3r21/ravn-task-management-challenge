import type { Meta, StoryObj } from '@storybook/react';
import { TopNav } from './top-nav';
declare const meta: Meta<typeof TopNav>;
export default meta;
type Story = StoryObj<typeof meta>;
/** Property 1=Default — a single trailing icon + avatar, no search value. */
export declare const Default: Story;
export declare const Playground: Story;
/**
 * Property 1=Selected — Frame 648 grows from 88px (1 icon + avatar) to 136px
 * (2 icons + avatar) once there's a value to clear.
 */
export declare const WithSearchValue: Story;
export declare const NoUser: Story;
