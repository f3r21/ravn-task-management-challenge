# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Everything here is something the code does not say for itself. The _why_ behind individual
decisions lives in comments and commit messages — the density there is deliberately high — so
this file covers the shape of the whole thing, and the traps that have already cost time.

## Commands

```bash
npm run dev            # Vite dev server on :5173. Runs with no credentials — see "Two backends, one code path"
npm run gate           # typecheck → lint → format:check → coverage. This is the bar.
npm run build          # tsc --noEmit, then a production bundle. CI runs this too.
npm test               # the suite, once
npm run codegen        # regenerate src/graphql/generated/ from schema.graphql
npm run schema:check   # re-introspect the live API and fail if schema.graphql has drifted
npm run test:e2e       # one Playwright spec against a DEPLOYMENT. Needs E2E_BASE_URL — see below
```

Running less than everything:

```bash
npx vitest run src/lib/due-date.test.ts    # one file
npx vitest run -t 'unassign'               # tests whose name matches
npx vitest src/features/board              # watch a directory
npx vitest run --coverage src/lib          # coverage over a subset (thresholds still apply, so this fails)
```

`schema:check` is deliberately outside `gate`: it needs network access, and a red build because
someone else's server is having a bad afternoon is not a signal about this code. It only
**checks** — updating `schema.graphql` is by hand, then `npm run codegen`.

`test:e2e` is outside `gate` for a harder reason than `schema:check`: it needs a deployment,
not just a network. `E2E_BASE_URL` is required with no default and no localhost fallback,
because a fallback would turn the one test that reaches `api/graphql.ts` into a slow copy of
the unit suite. Pointing it at `npm run dev` is legitimate for exactly one purpose — proving
the selectors still match after a UI change — and it will still fail its last assertion,
which is the one checking the run went through `/api/graphql`. See "The e2e spec" below.

CI runs `gate` plus `build` on every pull request, not only those targeting `main` — a stacked
PR needs checks most, because its base has not landed yet. Two more workflows sit beside it:
`dependency-review.yml` (every PR, advisory check on the dependencies the diff adds) and
`e2e.yml` (every successful deployment, plus manual dispatch).

## Architecture

### Two backends, one code path

The load-bearing decision in the project; most confusion traces back to it.

`src/lib/env.ts` is the app's only read of `import.meta.env`, and it requires `VITE_API_URL`
and `VITE_API_TOKEN` **together** — a URL without a token reaches a real server that answers
every query `UNAUTHENTICATED`, which looks broken rather than unconfigured. With either
missing, `apiUrl` falls back to `MOCK_API_URL` (`https://mock.local/graphql`) and `main.tsx`
_awaits_ MSW's worker before the first render.

So there is no "mock mode" branch inside the app. `src/graphql/client.ts` always performs a
real `fetch` against a real URL and MSW intercepts at the network layer, which means the
request a test exercises is the request that runs in production, and nothing under
`src/features` knows which backend it is talking to. `BoardPage` renders a banner when
`isUsingMockApi` so a reviewer does not mistake seeded data for a live connection.

`shouldStartMockWorker()` is a separate export purely so the bootstrap has something to call
rather than re-deciding "are we mocking" from the raw env. It got that wrong once — gating on
the URL alone while everything else required both values — and `main.tsx` is excluded from
coverage, so nothing caught it.

**Checking which backend is live, in this checkout.** `.env` is gitignored and
per-developer, so whether it is filled in varies by machine — check with
`grep -c '^VITE_API_TOKEN=.\+' .env` (or the absence of the mock banner after `npm run dev`)
rather than assuming either way. When both `.env` values are present, reads —
`Tasks`/`Users`/`Profile` queries, `npm run schema:check`, and the `graphql` MCP server's
`introspect-schema`/`query-graphql` tools — can be run live with confidence. Mutations
(`createTask`/`updateTask`/`deleteTask`) still call for the same confirmation as any other
change to shared, live data.

**The `graphql` MCP server (`.mcp.json`) needs `VITE_API_TOKEN` exported into the shell
before `claude` starts** (e.g. `export $(grep -v '^#' .env | xargs) && claude`), since
`${VAR}`-style expansion in `.mcp.json` reads the launching shell's environment, not `.env`
directly. `ALLOW_MUTATIONS` is deliberately left unset, so the tool structurally cannot
mutate regardless of what this file says.

**MCP servers can exist in more than one scope with the same name, and the wrong one wins
silently.** `claude mcp add` writes to a per-project "local" scope in `~/.claude.json`,
completely separate from the "project" scope `.mcp.json` provides — and a local-scope
entry shadows a project-scope one of the same name without any warning that it's doing so.
This project's `graphql` server was broken for an entire debugging session for exactly this
reason: an empty-`env` local-scope entry from an earlier `claude mcp add` (missing both the
correct `ENDPOINT` key and any `HEADERS`) kept silently winning over the correctly-configured
`.mcp.json` entry, producing a generic `TypeError: fetch failed` on every query regardless of
how correct `.mcp.json` was. `claude mcp remove <name>` on a server that exists in multiple
scopes fails loudly and requires a scope flag (`claude mcp remove graphql -s local`) — but
nothing surfaces the conflict _before_ that point, so if an MCP tool that should work is
failing outright, check `claude mcp remove <name>` first: if it complains about multiple
scopes, that's the bug.

### The UI layer is somebody else's package

The second load-bearing decision, and the one this document used to omit entirely.

The Figma file for this challenge is a component library rather than a set of screens, so it
was built as one: **`@ravn/ui-kit`** (https://github.com/f3r21/ravn-ui-kit), a separate repo
with its own Storybook, tests and CI. This app is its first consumer. `Modal`, `Select`,
`MultiSelect` and `Menu` come from it today; `Avatar`, `Button`, `Tag`, `Skeleton` and the
board components are still app-owned and queued to move.

**It arrives as a git dependency pinned to a tag, not from npm.** There is no registry to
publish to, so the dependency is the repository itself:
`"@ravn/ui-kit": "github:f3r21/ravn-ui-kit#v0.4.0"`. The kit repo is public, so `npm ci`
clones it anonymously — no token, in CI or on Vercel. A git install runs no build; the kit
commits its `dist/` and checks its freshness in its own CI. Consequences:

- **A tag, never a branch.** A branch re-resolves on every `npm ci` behind an unchanged
  lockfile entry. Bumping the kit means editing the tag in `package.json` and running
  `npm install`, which rewrites the resolved commit SHA in `package-lock.json` — check that
  SHA rather than the packed filename, which does not distinguish `v0.4.0` from
  `v0.4.0-rc.1`.
- **`src/test/ui-kit-smoke.test.tsx` is the only check that spans the two repos.** Nothing
  else can see the seam: `gate` typechecks against whatever `dist/` is already installed, and
  the kit's CI tests its source tree rather than the artifact a consumer installs — so a tag
  whose `dist/` was never rebuilt, or a pin missing an export this app imports, ships green
  and breaks on Vercel. It imports from the public barrel (never a deep
  `@ravn/ui-kit/dist/...` path, which resolves past the `exports` map and would keep passing
  after the package stopped exporting a name), renders one component and asserts its
  accessible name, and compares the installed manifest version against the tag
  `package.json` pins. That last assertion is why bumping the pin without running
  `npm install` is now a failing test rather than a warm `node_modules` quietly serving the
  old build to the whole suite. It names the components the app imports one by one — add to
  the list when the app starts importing another.
- **The kit lands breaking changes on minor bumps**, under SemVer's pre-1.0 carve-out (its
  `CONTRIBUTING.md` requires calling them out; its `CHANGELOG.md` does). `v0.4.0` renamed
  `AddTaskModal`'s `initial*` props to `default*` with no alias. Read the changelog before
  moving the pin — including on a Dependabot PR, which is now a thing that can happen since
  the `@ravn/ui-kit` ignore entry is gone.
- **The kit's source is not in this checkout**, so "what does this component actually do" is
  answered by `node_modules/@ravn/ui-kit/dist/index.d.ts` — the doc comments survive the
  build and are unusually detailed — or by the repo, or the published Storybook.
- **`vite.config.ts`'s `dedupe` list is a no-op as committed, and kept anyway.** npm packs
  only what the kit's `files: ["dist"]` names and never installs a dependency's
  devDependencies, so `node_modules/@ravn/ui-kit` has **no `node_modules` of its own** and
  every bare specifier resolves up to this project's single install — exactly one copy of
  `react`, `react-dom`, `react-aria` and `react-stately` on disk. (The installed manifest
  _does_ list `react-aria`/`react-stately` under devDependencies now, since a git install
  ships the kit's `package.json` whole. That is not a nested copy.) The list guards the
  _other_ consumption mode: switching to a sibling `file:../ravn-ui-kit` to work on the kit
  brings a checkout that does have its own `node_modules`, and then two React instances mean
  "Invalid hook call". That switch is a one-line `package.json` edit, and the failure reads as
  a bug in the component rather than in how it was installed. The comment there has the full
  shape of it.
- **The Tailwind `@source` scan is the silent failure to watch.** `src/styles/base.css` names
  `../../node_modules/@ravn/ui-kit/dist`; if that scan ever breaks, kit-only utility classes
  vanish from the built CSS **with no build error**. `max-w-[120px]` and `tabular-nums` occur
  in the kit's `dist` and nowhere in `src/`, so grepping the built CSS for both is the canary:

  ```bash
  npm run build
  grep -c 'tabular-nums' dist/assets/*.css        # expect >= 1
  grep -c 'max-w-\\\[120px\\\]' dist/assets/*.css   # expect >= 1 — note the escaping
  ```

  **Grep the escaped form, not the literal one.** Tailwind escapes the brackets of an
  arbitrary-value class, so it emits `.max-w-\[120px\]`, and `grep -F 'max-w-[120px]'`
  therefore matches **nothing on a completely healthy build** — indistinguishable from the
  failure this check exists to detect. That false alarm has been hit twice; what settled it
  was running the same grep against the deployed production CSS, which "failed" too. If this
  canary ever fires, run it against production before believing it.

**The standing rule: when a kit component fails an assertion here, the fix goes in the kit,
not in the test.** This app is what proves the package works, and every defect found by
wiring it into something real — a popover that could not escape an `overflow: hidden`
ancestor, a focus ring that computed a colour and painted nothing, `onAction` firing twice
per menu pick — was found exactly this way. Loosening an assertion to accommodate the kit
throws away the only signal the arrangement generates, and leaves the defect in a package
meant to outlive this app. Weakening a test to match a component is the one refactor that is
never in scope here.

The corollary is that a migration can be _blocked_ on the kit, and that is a legitimate
place to stop — see `delete-task-dialog.tsx`, which stays on the app's own `Dialog` because
the kit's `Modal` drops `useDialog`'s `contentProps` and so cannot describe an
`alertdialog`. Record the gap and leave the app correct; do not migrate a component into a
regression.

### The data path

`useBoardFilters` (URL query params) → debounce → `FilterTaskInput` → React Query key →
`useTasks` → `request()` → MSW or the live API.

- **Filters live in the URL**, not component state — linkable, survives reload, and lets the
  header's search box and the board's filter bar share state without importing each other.
  Every value read back out is validated first (`readMember`, `readDate`, `readOwner`), because
  a hand-edited `?status=nonsense` would otherwise reach the API and turn a typo into an error
  screen. Writes are all `{ replace: true }`, so back leaves the board rather than retracing
  keystrokes.
- **`queryInput` omits empty values** rather than sending `null`: the query key is derived from
  it, so `{ name: '' }` and `{}` would be two cache entries for the same board.
- **Filtering is server-side**, per the brief's query arguments — and because filtering locally
  would mean fetching every task to show three.
- **`taskKeys.all` is what mutations invalidate**, prefix-matching every filtered variant at
  once. All three mutation hooks do this; `useTasks` uses `keepPreviousData` so the board does
  not thrash back to a skeleton on every keystroke.
- **Server state is React Query's, client state is React's**, with no GraphQL cache underneath —
  one source of truth per task, deliberately. Do not add Apollo/Relay/`graphql-request`.

### Generated types are the domain model

`schema.graphql` → `npm run codegen` → `src/graphql/generated/`. `features/board/task-types.ts`
only _aliases_ those generated names (`Task = TaskFieldsFragment`) and adds the ordered lists
the UI iterates. Nothing redeclares an API shape.

Those lists go through `exhaustiveList<Status>()([...])` and every enum-to-display mapping in
`task-display.ts` closes its switch with `assertNever`. Both exist for the same reason: when
the API gains a sixth status, that is a compile error naming exactly what needs a case, instead
of a card rendering a raw `IN_PROGRESS`.

Six operations, all in `src/graphql/operations/tasks.graphql`: queries `Tasks`, `Users`,
`Profile`; mutations `CreateTask`, `UpdateTask`, `DeleteTask`.

### Structure and routing

Feature-scoped, named exports, no barrel files. `app/` (routing, providers, query client,
error pages) · `features/` (board, profile, navigation) · `ui/` (shared design-system pieces) ·
`graphql/` · `lib/` · `shared/` · `mocks/` · `test/`. A component lives in the feature that
uses it and moves to `ui/` when something else needs it. `@/` aliases `src/`.

`routes` is exported as a plain `RouteObject[]` rather than a configured router, so tests mount
the real table in a memory router and navigate for real — swapping components would not
exercise route matching. `AppLayout` wraps each element instead of being a parent route with an
`<Outlet />`: a parent would keep the shell mounted across navigations, which would put the
not-found page inside chrome implying the app is fine.

### The token layer

**The app defines no tokens.** `src/styles/base.css` is the only stylesheet here, and it
imports `@ravn/ui-kit/theme.css` for the whole colour, radius and type vocabulary — the raw
Figma ramp and the semantic `@theme` names both live in the kit now. A new token is a change
to the kit, released and re-pinned, not a `:root` block added here.

Two things in `base.css` are easy to delete as noise and are not. The kit ships tokens only,
never compiled utilities, so this app's own `@tailwindcss/vite` build generates every class —
including the ones baked into the kit's `dist/index.js` as string literals. Tailwind excludes
`node_modules` from automatic scanning, so the `@source "../../node_modules/@ravn/ui-kit/dist"`
line is what keeps kit components from rendering unstyled. And `color-scheme: dark` is set
because the design is dark-only, so form controls, scrollbars and focus rings need telling.

Colours still reach a component only through a semantic name that says what the colour is
_for_ (`text-main`, `bg-surface-panel`, `border-subtle`): Tailwind v4 generates utilities only
for what it finds in `@theme`, so `bg-neutral-4` is not a class that exists in the app's
output. Icons in `src/ui/icons/` are the design's own SVG exports with `fill` swapped for
`currentColor`, so their colour comes from the token layer too. The kit exports the same set
and this one is a duplicate awaiting migration, not a deliberate fork.

### Two structures that look like tidiness and are not

- **`Dialog` is split into `Dialog` + `ModalContents`.** `useModalOverlay` and `useDialog` ask
  for focus containment through a context `<Overlay>` provides to its _children_. Called in the
  component that renders `<Overlay>`, the request is silently dropped: Tab walks out of the
  modal and Escape stops working. Do not flatten it.
- **The toast region is portalled to `document.body` _and_ marked by `useToastRegion`.** React
  Aria's hiding pass walks out from the body and rejects whole subtrees, so an exempt node
  nested inside a hidden ancestor is never reached. Either half alone leaves notifications
  unreachable exactly when a modal is open — which is when the delete dialog's only error
  report is a toast.

### Test harness

Every test renders through `src/test/test-utils.tsx` (`renderWithProviders` / `renderApp`), each
call building a fresh `QueryClient` so one test's fetched board cannot satisfy the next test's
query and hide a missing handler. `vitest.setup.ts` runs MSW with
`onUnhandledRequest: 'error'` — a missing handler is a loud failure rather than a silent fall
through to the real network — and resets `taskStore` after each test, because the store is
stateful on purpose.

Coverage config in `vite.config.ts`: `exclude` **replaces** the defaults rather than merging,
so the `...coverageConfigDefaults.exclude` spread is what keeps colocated `*.test.tsx` files
from counting as source and inflating every metric toward ~99%. `mocks/` and `generated/` are
excluded from the _metric_ but `task-store.test.ts` still pins the fake's filter semantics
directly, because the filter tests trust it to narrow correctly.

### The e2e spec

`e2e/` is Playwright's, `src/` is Vitest's, and the boundary is enforced in three places
because nothing else keeps two test runners out of each other's files:

- **`vite.config.ts` excludes `e2e/**`.** Vitest's default `include` matches `*.spec.ts` at
  any depth, so without it `npm test` collects the Playwright file and fails the entire run
  with "Playwright Test did not expect test() to be called here" — a message listing four
  causes, none of them "a second runner picked this up".
- **`e2e/tsconfig.json` is a third project**, alongside the root one and `api/`, for the same
  reason `api/` has its own: this code runs in Node and must not see the DOM lib. `typecheck`
  builds all three.
- **`e2e/playwright.config.ts` lives beside the spec**, not at the root, so that tsconfig
  covers it and typescript-eslint's project service finds it by walking up.

One spec, `deployed-proxy.spec.ts`: create → filter → edit → delete, in a browser, against a
deployment. It is the only test that reaches `api/graphql.ts` as it actually runs — nothing
imports that file, so no unit test can. It writes to RAVN's live board through the proxy and
deletes what it created, including from `test.afterEach` when the assertions never got that
far; a leftover `e2e smoke <token>` card means a run died mid-flight.

Adding a second spec is almost always the wrong move. Everything else is already covered in
jsdom, faster and more precisely, and each extra flow is more live mutation.

## Conventions

- **No test ids.** Query by role, label and text — the things a user perceives. A test reaching
  for a test id is testing the DOM, not the behaviour.
- **Comments explain why.** A stale comment is worse than no comment, because a reader trusts
  it. If you change behaviour, grep for comments describing the old one — several rounds of
  that have already been needed.
- **Zero `any`, zero `@ts-ignore`.** Both are lint _errors_. The one unavoidable assertion sits
  at the transport boundary in `client.ts`, so nothing downstream repeats it.
- **`date-fns` for `isValid` / `parseISO` only.** All formatting is `Intl` with an explicit
  `timeZone: 'UTC'` — see the trap below for what a date library reading local fields did.
- **React Aria _hooks_ only.** Never `react-aria-components`.

## Traps this project has already paid for

Each was a real defect, most of them shipped and caught later.

**jsdom and the browser disagree, in both directions.** jsdom does not reflect the `inert`
property to an attribute and does not evaluate media queries, so it will report a hidden
notification as reachable and show two navigation landmarks where a browser shows one. A
browser, conversely, reports focus dropped on `<body>` if you drive React Aria with
`element.click()` instead of real input — that is not the press sequence it listens for.
**Anything about focus or the accessibility tree gets checked in both.**

**Use `isInaccessible` for "can assistive tech reach this".** Hand-rolled `closest('[inert]')`
does not work here (see above), and the page behind a modal ends up `aria-hidden` rather than
inert anyway.

**A React Aria toast is itself `role="alertdialog"`.** An unqualified
`getByRole('alertdialog')` matches both a toast and the delete confirmation. Name the dialog.

**The `TZ` pin is a fixed offset.** `Pacific/Kiritimati` is UTC+14 with no daylight saving, so
it catches local-vs-UTC confusion loudly and cannot catch anything needing a gap hour. A
formatter that shifted by an hour in DST-gap zones shipped straight past it. Tests that care
switch zone with `vi.stubEnv('TZ', …)`.

**Live regions announce _changes_.** One that mounts with its text already inside announces
nothing. Three components made this mistake; all three now use a region that outlives the
states and swaps its text. If you add a loading or empty state, do the same.

**The mock is not a contract.** `FilterTaskInput` carries no descriptions, so every filter rule
in `src/mocks/task-store.ts` is that fake's own reading of the field names. `dueDate` in
particular is more permissive than an exact `DateTime` comparison. Tests over it pin the fake;
they do not prove the real API agrees.

**`UpdateTaskInput` is a patch, `CreateTaskInput` is not.** Omitting `assigneeId` on update
means "leave it alone", which made unassigning impossible — `null` is what says "nobody". The
opposite applies to `position`: omit it to leave the server's ordering alone, because `null` on
a `Float!` is a request to unset it.

## When proving a test has teeth

Break the code, watch the test fail, restore. Two rules learned the hard way:

- **Commit the fix first**, then sabotage. `git checkout <file>` to undo a sabotage takes any
  uncommitted fix with it. Use `git stash` to restore.
- **Target the right function.** A sabotage applied to `handleCreate` will not fail a test about
  `handleEdit`, and the passing test looks like a toothless one.

Both of those are about the local loop. **The CI counterpart is the sabotage-on-a-real-runner step
of `/finish-issue`**, which is where that procedure lives.

## Branch layout

`dev` is the standing integration branch — all new work branches off `dev` and PRs back into
it. `main` only receives periodic promotions of a verified-stable `dev` (gate green, and for
anything MCP-related, live-checked, not just "connected") via a `dev` → `main` PR. Nothing
merges into `main` directly.

**That is now enforced on the server, not by habit.** A repository ruleset covers
`refs/heads/main` and `refs/heads/dev` with four rules: changes arrive by pull request, the
`Typecheck, lint, format, test, build` check must be green, no force-push, no deletion.
`bypass_actors` is empty on purpose, so the owner account is subject to it too — before this,
CI was decorative: red runs never blocked the merge button, and PR #17 (`build(deps): bump
graphql from 16.14.2 to 17.0.2`) merged straight into `main` unreviewed, leaving the two
branches disagreeing about `package.json` until `chore/reunify-dev-with-main` cleaned it up.
That is what an ungated merge button costs, and it is the failure `dependabot.yml`'s
`target-branch: dev` comment already records. Three consequences for anyone working here:

- **It is a _ruleset_, not classic branch protection.** `gh api repos/…/branches/main/protection`
  answers `404 Branch not protected` and that is not the answer to the question — read it back
  with `gh api repos/f3r21/ravn-task-management-challenge/rulesets`.
- **`Typecheck, lint, format, test, build` is the _only_ required check.** `Dependency review`
  and the e2e workflow report without blocking, deliberately: promoting a check to required is
  a ruleset edit with the whole repository as its blast radius, and a required check that
  cannot report — the e2e one only fires on a deployment — deadlocks every merge. Decide that
  separately from adding a workflow.
- **Approvals are deliberately _not_ required** (`required_approving_review_count: 0`). There is
  one account here and GitHub forbids approving your own pull request, so requiring even one
  approval deadlocks the repository outright. Review is a `gh pr review --comment` from a
  separate session, and the PR template's `Second-session review:` line is the only record that
  it happened.
- **The check must be green _against current `dev`_, not against whatever `dev` was when the
  branch was cut** (`strict_required_status_checks_policy: true`). Two lanes land into `dev`
  concurrently, so without this a run goes green describing a merge base that no longer exists
  — issues #27, #35 and #42 all edit `.github/workflows/ci.yml`, and git will catch the
  textual conflict between them while saying nothing about the semantic one. The cost is real
  and intended: **every merge into `dev` staleness-marks the other lane's open PR**, which then
  has to update its branch and re-run the check before it can merge. Combined with zero
  required approvals that serializes merges rather than deadlocking them. A PR sitting at
  `mergeStateStatus: BEHIND` is this rule, not a broken build — update the branch, wait for CI.

Merged branches now delete themselves (`deleteBranchOnMerge`), so a branch still on the remote
means unmerged work, not litter.

This wasn't always the layout. The six brief sections plus the README shipped as eight
stacked branches, `feat/01-project-setup` → `feat/02-dashboard-ui` → `feat/03-connect-api` →
`feat/04-create-task` → `feat/05-update-delete` → `feat/06-search-filter` → `feat/07-profile`
→ `feat/08-readme-polish`, each PR targeting the one below it, each merged in order into
`dev` and deleted once merged — that history is preserved as individual merged PRs, not
squashed away. One of those merges (`feat/02-dashboard-ui`) had to be redone as a fresh PR
after its predecessor branch was deleted before merging: GitHub permanently closes a PR when
its base branch is deleted, rather than retargeting it — retarget the _next_ PR in a chain to
its new base **before** deleting the branch it used to point at, never after.

A comment can still be _true_ on one piece of work and false on a later one — several "stale
comment" fixes had to land further along than the file's original owner, because that is
where the second caller or the changed behaviour arrives. Check with `git log -S` before
assuming.

## Claude Code setup in this repo

`.claude/rules/` (`bonus-points`, `code-review`, `figures`, `graphql-api`, `ui-kit`) restates the
conventions above and nothing in the build depends on it; `ui-kit.md` exists because the
fix-it-in-the-kit rule was previously carried only in host-local agent memory, one machine away
from being lost. `figures.md` is the one rule here that governs this document too: a number
written down anywhere, including in these pages, carries the command that re-derives it.
`.github/ISSUE_TEMPLATE/lane-task.md` is where that obligation is collected for new work. It
applies to figures written **from now on** rather than retroactively — the numbers already in
this file were not swept, deliberately, because a bulk edit that re-derives a hundred figures at
once is exactly the unverified pass the rule exists to prevent.

`.claude/commands/` is two different kinds of file under one directory. `/gate` and
`/schema-check` are thin wrappers over the npm scripts; `/rebase-stack` is a procedure over the
eight stacked branches "Branch layout" says were merged and deleted, so it describes a layout that
no longer exists. **`/start-issue` and `/finish-issue` are neither.** They are where this project's
process rules live, and for most of them the only copy in the repository — deadlocked gates, stale
readings, checks never observed failing, the four couplings that cross a lane boundary invisibly,
and the scope of a dispatched subagent. That is `ui-kit.md`'s failure mode one level up: a rule
surviving only in a transcript is a rule already lost. `ravn-ui-kit` keeps its own deliberately
diverging copies, and each file opens by naming its sibling and the differences that are real.

`.claude/hooks/` the build _does_ depend on — `scripts/hooks.test.mjs` runs inside
`npm run gate`, so deleting either script fails the build. `format-file.sh` (`PostToolUse`)
runs ESLint and Prettier over the file just edited; `block-dangerous.sh` (`PreToolUse`) refuses
a recursive forced `rm` aimed at `/` or `$HOME`, a plain force push, and a download piped into
a shell.

**Both of those read their payload as JSON on stdin, and that is the whole point of the test.**
The pair shipped in `7ff3376` did not: the formatters interpolated a `$FILE_PATH` that Claude
Code never sets, and the safety hook read `$1` when a `PreToolUse` hook is passed no positional
arguments. Installed, running, exiting 0, and completely inert — a state nothing in `gate`
could distinguish from a working hook, which is why `hooks.test.mjs` now drives both the way
Claude Code drives them. A denial is also a `permissionDecision` object on stdout, never a
non-zero exit: any exit code other than 2 is a _non-blocking_ error, so the old `exit 1` would
have printed its refusal and then run the command.

**Three layers refuse a force push, and they are not the same rule.** `block-dangerous.sh`
excludes `--force-with-lease` and `--force-if-includes` on purpose, and says why; `permissions.deny`
in `.claude/settings.local.json` is a glob list; the repository ruleset rejects the push server-side
on `main` and `dev`. The middle layer is per-machine and **gitignored**, so it drifts out of
agreement with the hook and nothing in the repository can see that it has. A `Bash(git push
--force*)` glob there matched `--force-with-lease` — the glob does not stop at the word — and
`deny` offers no prompt, so a lane that had rebased correctly could not push at all and simply
stopped. The coarser layer wins silently, and its blast radius is every session on the machine
rather than this repository. `/finish-issue` carries the rule that follows from it; what belongs
here is that these are the three, and that only one of them is visible to review.

**The glob layer is weaker than it reads, and the hook has holes the glob cannot cover.** Claude
Code matches Bash rules per _subcommand_, splitting on `&&`, `||`, `;`, `|`, `|&`, `&` and
newlines, so a deny rule that itself contains a separator can never match one — which is why
`Bash(curl * | sh*)` and its two siblings in `settings.local.json` are very likely inert, and why
the hook is what actually stops a piped download. In the other direction the hook's
`git … push` regex models a global option as one attached token, so `git -C <path> push --force`
matches neither the hook nor any deny glob, while `Bash(git *)` positively allows it. Neither
layer covers the other; see #63.

`permissions.deny` in `settings.json` keeps `package-lock.json`, `coverage/`, `dist/` and
`node_modules/` out of context. `.claudeignore`, which used to claim that job, is not a Claude
Code feature and never excluded anything. Note the reach of a `Read()` rule: it also covers
Edit, Write, Glob, Grep and the shell's own readers, so reading a dependency's source now takes
a deliberate change here rather than a `cat`.

**Nothing enforces `gate` before a commit** — running it is on you. It _is_ enforced before a
merge (see "Branch layout"), but finding out in CI costs a push and a five-minute round trip to
learn what four minutes locally would have told you.

## Not built

Drag-and-drop (bonus #1). Not blocked on anything: every hook needed is already installed. See
the README's bonus section for why it was left out.
