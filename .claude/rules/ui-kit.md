# `@ravn/ui-kit` Rules

The app's UI layer comes from a separate package, `@ravn/ui-kit`
(https://github.com/f3r21/ravn-ui-kit), built from the Figma export and consumed here as a
dependency. This app is its first and only consumer.

## The standing rule

- **When a kit component fails an assertion in this app, the fix goes in the kit — never in
  the test.** Loosening an assertion to accommodate a kit component discards the only signal
  this arrangement produces, and leaves the defect in a package meant to outlive this app.
  Real defects found exactly this way: a popover that could not escape an `overflow: hidden`
  ancestor, a focus ring that computed a colour and painted nothing, `onAction` firing twice
  per menu pick.
- **A migration blocked on a kit gap stops.** Record the gap, leave the app's own component
  in place, and say why in a comment. Do not migrate a component into a regression, and do
  not weaken the app to make a migration land.

## `vendor/` is build output

- The dependency is `file:./vendor/ravn-ui-kit` — a committed copy of the kit's `dist/`.
  `file:../ravn-ui-kit` cannot be used: CI clones only this repository.
- **Never hand-edit anything under `vendor/ravn-ui-kit/`.** A change there is invisible to
  the kit's own tests and is destroyed by the next re-sync. Fix it in the sibling repo,
  rebuild, re-vendor.
- Re-syncing is its own commit, never mixed into an app change. Procedure lives in
  `vendor/ravn-ui-kit/README.md`.

## Reading the kit without its source

- The kit's source is not in this checkout. `vendor/ravn-ui-kit/dist/index.d.ts` keeps the
  doc comments through the build and is the authoritative local reference for what a
  component does and why.
- Component and icon counts are derived from that file, not remembered — capitalized
  `export declare`s, minus the ones typed `IconProps`, minus the `const` exports.
