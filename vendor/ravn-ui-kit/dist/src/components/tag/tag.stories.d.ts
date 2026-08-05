import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './tag';
declare const meta: Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Playground: Story;
/** Style=Solid × Type=General/Green/Blue/Yellow/Red (Tags00/01.md). */
export declare const SolidVariants: Story;
/** Style=Outline × Type=General/Green/Blue/Yellow/Red (Tags00/01.md). */
export declare const OutlineVariants: Story;
/** Icon=Left slot, Style=Solid (Tags00/01.md). */
export declare const WithIcon: Story;
export declare const Removable: Story;
