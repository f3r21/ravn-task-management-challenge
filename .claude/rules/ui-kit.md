---
name: ui-kit
description: The kit is a git dependency pinned to a tag; which build you actually have, and the one test that spans both repos.
paths:
  - 'package.json'
  - 'package-lock.json'
  - 'src/test/ui-kit-smoke.test.tsx'
  - 'src/**/*.tsx'
---

# `@ravn/ui-kit` is somebody else's package

The Figma file for this challenge is a component library rather than a set of screens, so it was
built as one: `@ravn/ui-kit` (https://github.com/f3r21/ravn-ui-kit), a separate repo with its own
Storybook, tests and CI. This app is its first and only consumer. What stays app-owned is what
the app still implements rather than imports. Read the imports, not a list in a document: the
list keeps moving.

The standing rule (fix a failing kit component in the kit, never in the test) is in the root
`CLAUDE.md`. The corollary lives here: **a migration can be blocked on a kit gap, and that is a
legitimate place to stop.** Record the gap, leave the app correct, do not migrate a component
into a regression. Nothing is blocked on the kit today. The worked arc is
`delete-task-dialog.tsx`, whose own doc comment holds it, beside the code so it cannot go stale
the way a paragraph here did.

## The dependency is a git tag

`"@ravn/ui-kit": "github:f3r21/ravn-ui-kit#<tag>"`. There is no registry, so the dependency is
the repository. **Read the pinned tag from `package.json`** (`grep ui-kit package.json`), never
from prose: this line named a stale version for three releases once. The kit repo is public, so
`npm ci` clones it anonymously, with no token in CI or on Vercel. A git install runs no build,
because the kit commits its `dist/` and checks its freshness in its own CI.

- **A tag, never a branch.** A branch re-resolves on every `npm ci` behind an unchanged lockfile
  entry, which is the moving target the pin exists to close.
- **Bumping the tag is its own commit**, never mixed into an app change. The kit lands breaking
  changes on minor bumps under SemVer's pre-1.0 carve-out, so read its `CHANGELOG.md` first,
  including on a Dependabot PR.
- **Never hand-edit anything under `node_modules/@ravn/ui-kit/`.** It is installed build output.
  A change there is invisible to the kit's tests and is destroyed by the next install.

**Exactly one field says which build you have:
`packages['node_modules/@ravn/ui-kit'].resolved` in `package-lock.json`.** The root spec, the
`version` field beside `resolved` and the packed filename are all claims about intent, and every
one can say `v0.8.0` over an installed `v0.7.0`. A bare `npm install` after editing
`package.json` rewrote the root spec, left `resolved` on the previous tag's commit, printed
`up to date` and exited 0.

```bash
npm install '@ravn/ui-kit@github:f3r21/ravn-ui-kit#<tag>'   # the form that actually bumps
node -e 'const l=require("./package-lock.json");const p="node_modules/@ravn/ui-kit";
  console.log("resolved  ", l.packages[p].resolved);
  console.log("root spec ", l.packages[""].dependencies["@ravn/ui-kit"]);
  console.log("version   ", l.packages[p].version);'
git ls-remote https://github.com/f3r21/ravn-ui-kit 'refs/tags/<tag>*'
```

**Compare `resolved` against the `^{}` line of that last command, not the bare tag line.** The
kit's tags are annotated, so `refs/tags/v0.8.0` is the tag object and `refs/tags/v0.8.0^{}` is
the commit, and `resolved` holds the commit. Comparing against the bare ref makes a correct
lockfile look wrong, which is a third decoy on top of the two above. The four currently agree,
so the disagreement is reproducible rather than present. Do not read agreement as proof the trap
is gone.

## The one test that spans the two repos

`src/test/ui-kit-smoke.test.tsx`. Nothing else can see the seam: `gate` typechecks against
whatever `dist/` is installed, and the kit's CI tests its source tree rather than the artifact a
consumer installs, so a tag whose `dist/` was never rebuilt, or a pin missing an export this app
imports, ships green and breaks on Vercel.

It imports from the public barrel, never a deep `@ravn/ui-kit/dist/...` path, which would resolve
past the `exports` map and keep passing after the package stopped exporting a name. It renders
one component, asserts its accessible name, and compares the installed manifest version against
the tag `package.json` pins. That last assertion is why bumping the pin without running
`npm install` is a failing test rather than a warm `node_modules` serving the old build to the
whole suite. It names the components the app imports one by one: add to the list when the app
starts importing another, and never delete an assertion to make a bump land.

## Reading the kit without its source

The kit's source is not in this checkout. `node_modules/@ravn/ui-kit/dist/index.d.ts` keeps the
doc comments through the build and is the authoritative local reference for what a component does.

**A shell reader is refused there, and that is not this instruction being wrong.**
`permissions.deny` carries `Read(./node_modules/**)`, so a `grep` under that path comes back
denied. The rule matches the command rather than the file, so `node -e` reads it, which is also
how the `resolved` check above reaches `package-lock.json` under a deny rule of its own.
Deliberate friction, not a boundary. Component and icon counts are derived from that `.d.ts`
file, never remembered.

**`vite.config.ts`'s `dedupe` list is a no-op as committed, and kept anyway.** npm packs only
what the kit's `files: ["dist"]` names and never installs a dependency's devDependencies, so
`node_modules/@ravn/ui-kit` has no `node_modules` of its own and every bare specifier resolves up
to this project's single install. The list guards the other consumption mode: switching to a
sibling `file:../ravn-ui-kit` brings a checkout that does have its own `node_modules`, and then
two React instances mean "Invalid hook call". That switch is a one-line `package.json` edit and
the failure reads as a bug in the component rather than in how it was installed.
