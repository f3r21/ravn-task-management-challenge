# The design system is a separate package

The Figma file for this challenge is not a set of screens — it is a component library, with
a style guide, per-component specs and variant states. Building those components inline in
`src/ui/` would have meant a design system that only existed as a side effect of one app.

So it is its own package: **[`@ravn/ui-kit`](https://github.com/f3r21/ravn-ui-kit)** — 46
components and 21 icons built from the Figma export, with Storybook stories for all but two
components, its own test suite and its own CI.
**[Browse the Storybook](https://f3r21.github.io/ravn-ui-kit/)** to see every component, its
props and its states without cloning anything.

Both counts are re-derived from the installed artifact rather than trusted here — note that
it is the _function_ exports that are counted, since interfaces and types are capitalized
exports too and grepping for those instead returns 132:

```bash
f=node_modules/@ravn/ui-kit/dist/index.d.ts
grep -E '^export declare function [A-Z]' $f | grep -vc IconProps   # 46 components
grep -E '^export declare function [A-Z]' $f | grep -c  IconProps   # 21 icons
```

"All but two" is `popover.tsx`, which ships a test and no stories while its sibling
`FloatingPopover` has both, and `due-date-urgency-state.tsx`, added with the overdue fix — 2 of
41 component source files. Re-derive at whatever tag is actually pinned rather than a written
one, since this sentence said "1 of 40 at the pinned `v0.4.0`" for three releases after that
stopped being true:

```bash
t=$(grep -oE 'ravn-ui-kit#v[0-9.]+' package.json | cut -d'#' -f2)
gh api "repos/f3r21/ravn-ui-kit/git/trees/$t?recursive=1" --jq '[.tree[].path|select(test("^src/components/.*\\.tsx$"))]'
# component sources = paths ending .tsx that are not .test.tsx or .stories.tsx
# without stories  = those with no matching .stories.tsx sibling
```

This app is its first consumer, and consuming it is what proves the package
works: several real defects (a popover that could not escape an `overflow: hidden` ancestor,
a focus ring that computed a colour and painted nothing, `onAction` firing twice per menu
pick) were found only by wiring it into something real, and were fixed in the kit rather
than patched around here.

The migration is deliberately incomplete and tracked as such. `Modal`, `Select`,
`MultiSelect` and `Menu` come from the kit today; `Avatar`, `Button`, `Tag`, `Skeleton` and
the board components are still app-owned and queued to move.

`EmptyState`, the toast system and the icon set are also still app-owned, and the reason is
worth stating precisely because it is the opposite of the obvious one: the kit has all
three, and it has them **because this app wrote them first**. Its `EmptyState` and
`ToastProvider` are both marked "No Figma source" in the kit and were ported from here — the
design file draws neither, and the accessibility lessons behind them (an empty state that
must not be a live region, a toast region that has to be portalled _and_ exempted) were paid
for in this repo. So they are duplicates awaiting deletion, not gaps: the kit's versions are
supersets, and swapping to them is queued work with no user-visible change to show for it.

**`ErrorBoundary` is the only one of the four the original claim still holds for.** The kit
genuinely has no equivalent, and arguably should not: it renders nothing designed, and its
whole surface is an `onError` seam for wiring up crash reporting in a host application.

One migration is blocked rather than queued, which is a different thing. The delete
confirmation stays on the app's own `Dialog` because the kit's `Modal` accepts
`role="alertdialog"` but drops React Aria's `contentProps`, so the body text it exists to
announce is never wired to `aria-describedby` — a test here asserts that description, and
per the rule below the fix belongs in the kit rather than in the assertion.

That rule is the whole point of the arrangement: **when a kit component fails an assertion
in this app, the fix goes in the kit, not in the test.** Weakening a test to make a
migration land would throw away the only signal a second consumer-shaped repo produces.

### Why the dependency is a git tag

`@ravn/ui-kit` has no npm registry to publish to, so the dependency is the repository
itself, pinned to a tag: `"@ravn/ui-kit": "github:f3r21/ravn-ui-kit#<tag>"`. For the tag
actually installed, read `package.json` — `grep ui-kit package.json` — rather than any
version written into prose, which named `v0.4.0` here for three releases after it stopped
being true. The kit repo is public,
so `npm ci` clones it anonymously — no cross-repo token, in CI or on Vercel. A git install
runs no build; the kit commits its `dist/` and guards its freshness in its own CI, so what
installs here is the tagged artifact rather than a rebuild.

**A tag, not a branch, and that is the whole point.** A branch re-resolves on every `npm ci`
behind an unchanged lockfile entry. A tag resolves once, and `package-lock.json` records the
commit it resolved to — so the installed bytes are identified rather than described.

This app used to hold a built copy at `vendor/ravn-ui-kit/` instead, because the kit repo was
private and reaching it from CI would have needed a PAT secret. Two things that cost, both
worth knowing if the idea ever comes back: minified output reflows on any change, so a kit
contrast fix touching a handful of hex values produced a 1,300-line diff here, and by the time
the directory was deleted it accounted for more of this repository's line churn than every
hand-written file combined — `git log --format='' --numstat -- vendor/ravn-ui-kit | awk '$1!="-"{a+=$1+$2}END{print a}'`
against the same command without the pathspec. And the lockfile entry for a `file:` link
is `{"resolved": "vendor/ravn-ui-kit", "link": true}`, carrying no version and no integrity
hash, so `@ravn/ui-kit@0.3.0` named four mutually different `dist/` trees over this repo's
history with nothing able to detect it.

The alternative was a monorepo. It was not chosen because the kit is meant to outlive this
app, and a package that can only be built from inside its one consumer is not really a
package.
