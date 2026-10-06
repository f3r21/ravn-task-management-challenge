---
name: styling
description: The app defines no tokens; the Tailwind @source scan is the silent failure, and the canary may not name the classes it seeks.
paths:
  - 'src/styles/**'
  - '**/*.css'
  - 'src/**/*.tsx'
---

# The token layer

**The app defines no tokens.** `src/styles/base.css` is the only stylesheet here and it imports
`@ravn/ui-kit/theme.css` for the whole colour, radius and type vocabulary. A new token is a
change to the kit, released and re-pinned, never a `:root` block added here.

Colours reach a component only through a semantic name that says what the colour is for
(`text-main`, `bg-surface-panel`, `border-subtle`). Tailwind v4 generates utilities only for what
it finds in `@theme`, so `bg-neutral-4` is not a class that exists in this app's output. Icons
come from the kit and are the design's own SVG exports with `fill` swapped for `currentColor`, so
their colour comes from the token layer too.

Two lines in `base.css` look like noise and are not. The kit ships tokens only, never compiled
utilities, so this app's own `@tailwindcss/vite` build generates every class, including the ones
baked into the kit's `dist/index.js` as string literals. Tailwind excludes `node_modules` from
automatic scanning, so `@source "../../node_modules/@ravn/ui-kit/dist"` is what keeps kit
components from rendering unstyled. And `color-scheme: dark` is set because the design is
dark-only, so form controls, scrollbars and focus rings need telling.

## The `@source` scan is the silent failure, and it is checked in CI

If that scan breaks, kit-only utility classes vanish from the built CSS **with no build error and
no test failure**. `npm run css:canary` reads a production build and fails if too few kit-only
classes reached it. CI runs it after `npm run build`.

**The hand-written version of this canary could not fail.** It named two specific classes to grep
for, and Tailwind scans the whole project, Markdown included, so naming them in a document
generated them from that document. Both survived `@source` being deleted outright. A canary is
not allowed to name the classes it looks for. `css:canary` derives them at run time and its
header explains the derivation. **Do not add an example class name back to this file.**

The old spelling had an escaping trap worth remembering if you grep the CSS by hand: Tailwind
escapes the brackets of an arbitrary-value class, so a literal `grep -F` for one matches nothing
on a completely healthy build, which is indistinguishable from the failure. That false alarm was
hit twice. `css:canary` unescapes selectors itself, so it cannot recur there.
