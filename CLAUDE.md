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

`src/styles/tokens.css` holds the raw Figma ramp in `:root` and only _semantic_ names in
`@theme`. Tailwind v4 only generates utilities for what it finds in `@theme`, so `bg-neutral-4`
is not a class that exists and a component physically cannot reach a colour except through a
name that says what it is for. Add a `@theme` name rather than reaching for the ramp. Icons are
the design's own SVG exports with `fill` swapped for `currentColor`.

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

`.claude/` holds optional extras, none of which the code depends on: `commands/` (`/gate`,
`/schema-check`, `/rebase-stack` — thin wrappers over the npm scripts), `agents/`, and
`rules/`, which restate the conventions above. `settings.json` runs `eslint --fix` and
`prettier --write` on every edit, and a `PreToolUse` hook that blocks a handful of destructive
bash patterns (`rm -rf /`, force push, `curl | sh`). **Nothing enforces `gate` before a
commit** — running it is on you. It _is_ enforced before a merge (see "Branch layout"), but
finding out in CI costs a push and a five-minute round trip to learn what four minutes locally
would have told you.

## Not built

Drag-and-drop (bonus #1). Not blocked on anything: every hook needed is already installed. See
the README's bonus section for why it was left out.
