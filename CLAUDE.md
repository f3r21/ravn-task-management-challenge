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

CI runs `gate` plus `build` on every pull request, not only those targeting `main` — a stacked
PR needs checks most, because its base has not landed yet.

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
`Tasks`/`Users`/`Profile` queries and `npm run schema:check` — can be run live with
confidence. Mutations (`createTask`/`updateTask`/`deleteTask`) still call for the same
confirmation as any other change to shared, live data.

**The `graphql` MCP server (`.mcp.json`) is configured but unreliable — verify before
trusting it.** It needs `VITE_API_TOKEN` exported into the shell before `claude` starts
(e.g. `export $(grep -v '^#' .env | xargs) && claude`), since `${VAR}`-style expansion in
`.mcp.json` reads the launching shell's environment, not `.env` directly. `ALLOW_MUTATIONS`
is deliberately left unset, so the tool structurally cannot mutate regardless of what this
file says. Even correctly configured, though, `query-graphql`/`introspect-schema` have been
seen failing with a generic `TypeError: fetch failed` in this environment (Claude Code
2.1.221) — a transport-level error thrown before any HTTP response, reproduced even with a
verified-correct token and endpoint, and not resolved by fixing the config (confirmed by
manually driving the identical `npx -y mcp-graphql` process outside Claude Code, which
works every time). This looks like an undocumented quirk in how that Claude Code version
spawns MCP subprocesses, not a problem with the credential or endpoint. If the MCP tool
throws that error, fall back to a direct authenticated request instead — this has been
reliable every time it's been tried:

```bash
curl -s "$VITE_API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VITE_API_TOKEN" \
  -d '{"query":"{ __typename }"}'
```

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

Eight branches in a stack, one per step of the brief: `feat/01-project-setup` →
`feat/02-dashboard-ui` → `feat/03-connect-api` → `feat/04-create-task` →
`feat/05-update-delete` → `feat/06-search-filter` → `feat/07-profile` → `feat/08-readme-polish`.

Each PR targets the branch below it. A fix belongs on the branch that **introduced** the code,
and its test on the earliest branch where the test can be written — those are not always the
same branch. After changing a branch, rebase its descendants and re-run `gate` at each tip;
`gate` must be green at all eight, not only the top.

Note that a comment can be _true_ on one branch and false on a later one — several "stale
comment" fixes had to be applied further up the stack than the file's owner, because that is
where the second caller or the changed behaviour arrives. Check with `git log -S` before
assuming.

## Claude Code setup in this repo

`.claude/` holds optional extras, none of which the code depends on: `commands/` (`/gate`,
`/schema-check`, `/rebase-stack` — thin wrappers over the npm scripts), `agents/`, and
`rules/`, which restate the conventions above. `settings.json` runs `eslint --fix` and
`prettier --write` on every edit, and a `PreToolUse` hook that blocks a handful of destructive
bash patterns (`rm -rf /`, force push, `curl | sh`). **Nothing enforces `gate` before a
commit** — running it is on you.

## Not built

Drag-and-drop (bonus #1). Not blocked on anything: every hook needed is already installed. See
the README's bonus section for why it was left out.
