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

## The dependency is a git tag

- `"@ravn/ui-kit": "github:f3r21/ravn-ui-kit#<tag>"`. **Read the tag from `package.json`**
  (`grep ui-kit package.json`), never from prose — this line named `v0.4.0` for three
  releases after that stopped being true. The kit repo is public, so `npm ci` clones it
  anonymously — no token needed in CI or on Vercel.
- **A tag, never a branch.** A branch re-resolves on every `npm ci` behind an unchanged
  lockfile entry, which is exactly the moving target the pin exists to close.
- **Never hand-edit anything under `node_modules/@ravn/ui-kit/`.** It is installed build
  output — a change there is invisible to the kit's own tests and is destroyed by the next
  install. Fix it in the kit repo, release, then bump the tag here.
- Bumping the tag is its own commit, never mixed into an app change. It is a one-line
  `package.json` edit plus `npm install`; verify by the resolved commit SHA in
  `package-lock.json`, not by a version string. The kit ships breaking changes on minor
  bumps (pre-1.0), so read its `CHANGELOG.md` first.
- **`src/test/ui-kit-smoke.test.tsx` guards the seam between the two repos** — the one
  failure neither repository's CI can see. It asserts, from the public barrel rather than a
  deep path, that the components the app imports exist, that one renders with its accessible
  name intact, and that the installed manifest version matches the pinned tag. Forgetting
  `npm install` after a pin bump fails it. Extend it when the app imports a new component;
  never delete an assertion to make a bump land.

## Reading the kit without its source

- The kit's source is not in this checkout. `node_modules/@ravn/ui-kit/dist/index.d.ts`
  keeps the doc comments through the build and is the authoritative local reference for what
  a component does and why.
- Component and icon counts are derived from that file, not remembered — capitalized
  `export declare`s, minus the ones typed `IconProps`, minus the `const` exports.
