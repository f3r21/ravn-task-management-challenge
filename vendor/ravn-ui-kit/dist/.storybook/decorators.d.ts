import type { Decorator } from '@storybook/react';
declare const SURFACE: {
    readonly 'neutral-5': "bg-neutral-5";
    readonly 'neutral-4': "bg-neutral-4";
};
type Surface = keyof typeof SURFACE;
/**
 * Wraps a story in a padded container matching one of the two dark Figma
 * surfaces, for components whose canvas needs both a background color and
 * layout padding (not just a canvas color swap — use the `backgrounds`
 * toolbar parameter for that instead).
 */
export declare function withSurface(bg?: Surface, className?: string): Decorator;
export {};
