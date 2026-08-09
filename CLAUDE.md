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

`src/lib/env.ts` is the app's only read of `import.meta.env`, and `readApiConfig` resolves to
**three** states, not two (`src/lib/env.ts:87-104`):

```ts
export type ApiConfig =
  { mode: 'direct'; url: string; token: string } | { mode: 'proxied'; url: string }
```

- **`direct`** — an _absolute_ `VITE_API_URL` **plus** `VITE_API_TOKEN`. The two are required
  together, because an absolute URL without a token reaches a real server that answers every
  query `UNAUTHENTICATED`, which looks broken rather than unconfigured.
- **`proxied`** — a **same-origin path**, and **no token is required**; one set alongside it is
  deliberately _dropped_ rather than forwarded, since the proxy attaches its own. This is the
  **deployed** shape: Vercel serves `/api/graphql` and `api/graphql.ts` holds the credential.
- **`undefined` → mock** — no `VITE_API_URL` at all, or an absolute one with no token. Then
  `apiUrl` falls back to `MOCK_API_URL` (`https://mock.local/graphql`) and `main.tsx` _awaits_
  MSW's worker before the first render.

So "requires both together" is true only of the _absolute_ shape. An earlier revision of this
paragraph described the two-state version and was therefore wrong about the mode production
actually runs in. Re-derive with `grep -n "mode: '" src/lib/env.ts` → `:98` proxied, `:103`
direct.

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

**The `graphql` MCP server reads `.env` itself, so start `claude` plainly — do not export
anything.** `${VAR}` expansion in `.mcp.json` reads the launching shell's environment rather
than `.env`, which is why this used to say `export $(grep -v '^#' .env | xargs) && claude`.
The entry now runs through `sh -c`, sources `.env` inside the server's own process and builds
`HEADERS` there, so the credential exists in that one process and never in your shell.
`ALLOW_MUTATIONS` is deliberately left unset, so the tool structurally cannot mutate
regardless of what this file says.

**What that fixes is verification, not exposure, and the difference is worth being exact
about.** It does **not** stop the token reaching a local `dist/`: Vite reads `.env` from disk
on its own, so any build in a checkout that has one inlines it, and no shell hygiene changes
that. Nor does it need to — `dist/` is gitignored and Vercel builds from a clean checkout with
no `.env`, serving the app in `proxied` mode where the credential lives in `api/graphql.ts`.

The hazard the old recipe created is that **a shell carrying `VITE_*` contaminates any
clone-equivalent check run from it.** A fresh clone has no `.env`, so Vite falls back to
`process.env` — and a "does this app work credential-free" run then silently talks to the live
API and passes for the wrong reason. That happened to a careful run, which nearly reported the
app as not credential-free. Confirm your shell is clean with `env -i HOME=$HOME PATH=$PATH zsh
-l -c 'echo ${VITE_API_TOKEN:-UNSET}'`, and note that a plain `zsh -l -c` **inherits** the
parent's exports, so it answers the wrong question.

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

**A worktree inherits that shadow rather than escaping it.** Local scope is keyed by the main
checkout's absolute path, and a lane resolves through that key even though its own path appears
nowhere in `~/.claude.json` — a freshly provisioned lane reported `context7` and `playwright` as
"Project config" and `eslint` and `graphql` as "Local config" (`claude mcp get <name>`, run in
the lane). So a stale local entry does not merely fail to reach a new worktree; it follows every
one of them and keeps winning. `scripts/new-lane.sh` names the collision in its checklist, which
is all a provisioner should do: clearing it means deleting configuration a human wrote.

### The UI layer is somebody else's package

The second load-bearing decision, and the one this document used to omit entirely.

The Figma file for this challenge is a component library rather than a set of screens, so it
was built as one: **`@ravn/ui-kit`** (https://github.com/f3r21/ravn-ui-kit), a separate repo
with its own Storybook, tests and CI. This app is its first consumer. The migration onto it is
substantially done: `Modal`, `Select`, `MultiSelect` and `Menu` came first, then `Avatar`,
`Button`, `Tag` and `Skeleton` (#30), then the board itself (#31). What remains app-owned is
what this app still implements rather than imports: `src/ui/` holds the shared primitives that
have not moved, and individual components elsewhere stay app-owned for reasons recorded beside
them — see the corollary below on a migration blocked by a kit gap. Read the imports rather
than this sentence; it is the list that keeps moving.

**It arrives as a git dependency pinned to a tag, not from npm.** There is no registry to
publish to, so the dependency is the repository itself, of the form
`"@ravn/ui-kit": "github:f3r21/ravn-ui-kit#<tag>"`. For the tag actually pinned, read
`package.json` — `grep ui-kit package.json` — rather than any version written into this
document, which has already gone stale once. The kit repo is public, so `npm ci`
clones it anonymously — no token, in CI or on Vercel. A git install runs no build; the kit
commits its `dist/` and checks its freshness in its own CI. Consequences:

- **A tag, never a branch.** A branch re-resolves on every `npm ci` behind an unchanged
  lockfile entry.
- **Exactly one field says which build you have: `packages['node_modules/@ravn/ui-kit'].resolved`
  in `package-lock.json`.** The root spec, the `version` beside it and the packed filename are
  all claims about _intent_, and every one of them can say `v0.8.0` over an installed `v0.7.0`.
  That is not hypothetical — a bare `npm install` after editing `package.json` rewrote the root
  spec, left `resolved` on the previous tag's commit, printed `up to date` and exited 0. Use the
  form that actually performs the bump:

  ```bash
  npm install '@ravn/ui-kit@github:f3r21/ravn-ui-kit#<tag>'   # this bumps; bare `npm install` may not
  node -e 'const l=require("./package-lock.json");const p="node_modules/@ravn/ui-kit";
    console.log("resolved  ", l.packages[p].resolved);
    console.log("root spec ", l.packages[""].dependencies["@ravn/ui-kit"]);
    console.log("version   ", l.packages[p].version);'
  git ls-remote https://github.com/f3r21/ravn-ui-kit 'refs/tags/<tag>*'
  ```

  **Compare `resolved` against the `^{}` line of that last command, not the bare tag line.** The
  kit's tags are annotated, so `refs/tags/v0.8.0` is the _tag object_ and `refs/tags/v0.8.0^{}`
  is the commit — and `resolved` holds the commit. Comparing against the bare ref makes a
  perfectly correct lockfile look wrong, which is a third decoy on top of the two above.

  On `dev` at `9ddc8a4` all four agree on `v0.8.0` (`resolved` = `18e5908…` =
  `refs/tags/v0.8.0^{}`), so the disagreement is **reproducible rather than currently present** —
  do not read the agreement as proof the trap is gone.

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
- **The Tailwind `@source` scan is the silent failure to watch, and it is now checked in CI.**
  `src/styles/base.css` names `../../node_modules/@ravn/ui-kit/dist`; if that scan ever breaks,
  kit-only utility classes vanish from the built CSS **with no build error and no test
  failure**. `npm run css:canary` reads a production build and fails if too few kit-only
  classes reached it; CI runs it after `npm run build`.

  **The hand-written version of this canary could not fail, and this file is why.** It named
  two specific classes to grep for — and Tailwind scans the whole project, Markdown included,
  so naming them here generated them from _this document_. Both survived `@source` being
  deleted outright. A canary is not allowed to name the classes it looks for; `css:canary`
  derives them at run time instead, and its header explains the derivation. **Do not add an
  example class name back to this bullet.**

  The old spelling also had an escaping trap worth remembering if you ever grep the CSS by
  hand: Tailwind escapes the brackets of an arbitrary-value class, so a literal
  `grep -F 'max-w-[…]'` matches nothing on a completely healthy build — indistinguishable
  from the failure. That false alarm was hit twice. `css:canary` unescapes selectors itself,
  so it cannot recur there.

**The standing rule: when a kit component fails an assertion here, the fix goes in the kit,
not in the test.** This app is what proves the package works, and every defect found by
wiring it into something real — a popover that could not escape an `overflow: hidden`
ancestor, a focus ring that computed a colour and painted nothing, `onAction` firing twice
per menu pick — was found exactly this way. Loosening an assertion to accommodate the kit
throws away the only signal the arrangement generates, and leaves the defect in a package
meant to outlive this app. Weakening a test to match a component is the one refactor that is
never in scope here.

The corollary is that a migration can be _blocked_ on the kit, and that is a legitimate
place to stop. Record the gap and leave the app correct; do not migrate a component into a
regression.

**Nothing here is blocked on the kit today, and the worked example is one where the rule ran
to completion rather than one that is still waiting.** `delete-task-dialog.tsx` was stopped
for months — the kit's `Modal` had no `role`, then had one but dropped `useDialog`'s
`contentProps`, which for an `alertdialog` means the role is announced without the body text
that is the whole reason for choosing it. The gap was filed against the kit, fixed there
rather than worked around here, released, re-pinned, and the migration then landed with no
compensating code in this app. **The arc lives in that file's own doc comment, which is
where to read it** — beside the code it explains, so it cannot go stale the way this
paragraph did. It said the migration was still blocked for four releases after it landed,
and pointed at an app-owned `Dialog` that no longer exists.

Do not go looking for a currently-blocked migration to replace it with; there is none. The
only other component that ever cited a kit gap — `metaBadges` in
`task-card/to-kit-props.ts` — records its gap as closed too, and stays omitted for a reason
the kit cannot fix. `src/ui/`'s survivors are app-owned by design rather than blocked.

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

**That layering is lint-enforced since #40, having been prose until then — and prose does not
fail a build.** `no-restricted-imports` in `eslint.config.js` bans `@/features/*` and
`@/features/*/**` across `src/`, so no feature reaches into another and no lower layer
(`mocks/`, `lib/`, `ui/`, `graphql/`) reaches up into any of them.

What forced it: `User` is `UserFieldsFragment`, returned by the `Users`, `Profile` **and** `Tasks`
queries and belonging to none of them — yet it lived in `features/board/task-types.ts`, so
`features/profile` and every MSW handler imported `@/features/board` to learn what a user is, and
deleting `features/board` would have stopped the mocks compiling. `Task` and `User` now live in
`src/graphql/domain.ts` and `grep -rn "task-types" src | grep -v features/board` returns nothing.
`task-types.ts` keeps the three `exhaustiveList` orderings — those are board policy rather than API
vocabulary, since column order is the workflow's and the schema lists its members alphabetically —
and re-exports the types for its own 20 modules
(`grep -rl "task-types" src/features/board | grep -v '\.test\.' | wc -l`). That re-export is the
one concession: #40 asked for `task-types.ts` to be left board-only, which meant editing 23 files
in a feature another lane was actively rewriting, so the edge was cut at one file instead.
`@/graphql/domain` is the canonical path; anything outside `features/board` must use it.

**Two directories override the ban and neither is cleanup debt.** `src/app/` composes features
because that is the routing layer's entire job — the rule as first drafted would have failed on
`routes.tsx` itself. `src/features/navigation/` is the shell in everything but its directory,
mounted once by `AppLayout` rather than by any feature, and its `useBoardFilters` edge is
load-bearing: the `name` URL parameter had two independent writers until `FILTER_PARAMS`
collapsed them, so renaming the key broke the header's search box with no type error and no
failing test. Re-derive that rather than taking it from here:

```bash
git log -S 'FILTER_PARAMS' --oneline          # f683cb0 is the fix; later hits only mention it
git show f683cb0 -- src/features/navigation/app-header.tsx | grep -E '^[-+].*(URLSearchParams|setFilter)'
```

The second command prints the `- const next = new URLSearchParams(current)` the header used to
build for itself against the `+ setFilter('name', …)` that replaced it — that diff is the claim.
Banning the import and re-exporting the hook would satisfy the linter and restore the defect.

**The generated barrel is banned by `paths`, not deleted, and the spelling is the trap.**
`src/graphql/generated/index.ts` is a one-line `export * from "./gql"` that nothing imports, and it
does contradict the no-barrels rule — but it is codegen output the `client` preset cannot be told
to skip, so deleting it buys one clean commit and a dirty diff on every `npm run codegen` after.
A `patterns` entry is a gitignore-style glob, in which a bare directory name also matches
everything beneath it: spelled `{ group: ['@/graphql/generated'] }` it flagged the 13 imports of
`@/graphql/generated/graphql`, which is the correct path every consumer already uses. `paths`
matches the specifier exactly. Note that grep answers **14** there
(`grep -rl "from '@/graphql/generated/graphql'" src | wc -l`) — the fourteenth is that string
inside a test fixture's string literal, not an import, which is the same parser-versus-grep gap
the assertion count runs into under "Conventions".

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
output. Icons come from the kit, and are the design's own SVG exports with `fill` swapped for
`currentColor`, so their colour comes from the token layer too. The app briefly kept a
duplicate set in `src/ui/icons/`; #93 deleted it, and that path no longer exists.

### The browser floor is declared, not inherited

`package.json`'s `browserslist` — `chrome >= 111`, `edge >= 111`, `firefox >= 128`,
`safari >= 16.4`, `ios_saf >= 16.4` — is the single declaration. `vite.config.ts` converts it
into `build.target` and `eslint.config.js` converts it into a compat lint; neither writes the
numbers down a second time, because two hand-written copies of one floor drift and a lint that
passes against a floor the build does not use is worse than no lint. Both readers accept only
the explicit `<browser> >= <version>` form and **throw** on anything else: a usage-share query
like `defaults` resolves against `caniuse-lite` data that moves on every bump, so the floor
would silently be a different floor next month.

It used to be Vite's `baseline-widely-available` default, which nobody chose and no tool could
read — it is computed inside Vite. `URL.canParse` (Chrome 120) went through `gate`, `build` and
CI untouched and threw on every browser in that floor. Firefox is 128 rather than the default's
114 because that is Tailwind v4's documented requirement; the old number was a claim the
stylesheet could not honour. Declaring the floor changed no shipped bytes — the CSS and every JS
chunk are byte-identical — it only made the floor readable by something.

**Two lint rules enforce it and they are not redundant.** `compat/compat`
(`eslint-plugin-compat`) covers bare globals and members read off a global object — it flags
`new URLPattern()` and `navigator.scheduling` here. A generated `no-restricted-properties` list
covers **static** members of Web API interfaces, because the plugin's API inventory
(`ast-metadata-inferer`) has no entry for `URL.canParse`, `URL.parse`, `URL.createObjectURL` or
`Notification.requestPermission` — verified, not assumed. Adopting the plugin alone would have
been adopting a check that cannot fail on the one call it was added for. The generated list
throws if it ever comes out empty, because that means MDN changed shape rather than that the
code got safe.

**What it structurally cannot see.** Anything reached through a value rather than a name —
`u.canParse(x)` needs types, which is why MDN's `Element.checkVisibility` only ever matches
source that literally writes `Element.checkVisibility`. Also `window.`-prefixed access, which
the plugin misses; CSS and HTML entirely; and any API MDN has no data for. Test files and
`src/test/` are exempt on purpose — they run in jsdom on Node and reach no browser, and
`decommissioned-avatar.test.ts` shadows `URL.canParse` deliberately, which the rule would read
as the very call it forbids.

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
- **Zero `any`, zero `@ts-ignore`.** Both are lint _errors_, so `npm run lint` is what holds
  them at zero. **Type assertions are one as of #110** — the transport boundary, and nothing
  downstream — plus zero non-null `!`: `npm run assertions`, which lists each one and prints
  both totals. Like the count below it, that is a reading at a commit rather than a floor;
  re-run it rather than quoting this sentence.

  Count them with a parser, never a regex. Comment density here is deliberately high, so `as`
  is overwhelmingly prose: `grep -rn ' as ' src | wc -l` answers 191, and tightening it to
  `grep -rnE ' as (readonly |[A-Z])' src | wc -l` only gets to 26 — that still matches
  `import type * as UiKit`, and still matches comments, which is now most of what it finds: the
  three downstream assertions are gone and the sentences explaining why they went quote the code
  that replaced them. Grep also counts lines rather than expressions, which is how it missed that
  `use-board-filters.ts` once carried **two** assertions on one line. The non-null half cannot be
  grepped at all, `!` being negation and JSX punctuation far more often than an assertion.

  `client.ts:101` is the one that remains, and it is genuinely unavoidable: `response.json()` is
  `Promise<any>` and something has to name the shape.

  The other three went the way `select-option.tsx:44` describes — a lookup returns a value that
  is _already_ typed, so nothing is asserted and an unknown key is simply absent. It replaced six
  call sites in #40; `readMember` and `board-toolbar.tsx` followed in #110, and both are worth
  reading for what the change costs rather than what it saves. `readMember` collapsed to
  `allowed.find((member) => member === raw)` with nothing left over. `board-toolbar.tsx` did not:
  a lookup can miss, and `onViewChange: (view: BoardView) => void` cannot accept
  `BoardView | undefined`, so the guard is **type-required** and its else-branch is unreachable
  through the UI. That file sits at 75% branch coverage as a result, deliberately — the
  alternatives were reinstating the assertion, or `.filter().forEach()`, which reports 100% by
  emitting no branch for the metric to miss.

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

Break the code, watch the test fail, restore. Three rules learned the hard way:

- **Commit the fix first**, then sabotage. `git checkout <file>` to undo a sabotage takes any
  uncommitted fix with it — committing first is what removes that hazard.

  **"First" is not the whole of it: the restore discards whatever is uncommitted in that file at
  the moment you run it, including anything you added _after_ the sabotage.** A lane lost a
  `title` line it had written five minutes into a sabotage, because the line lived in the file it
  then restored. So the rule is stronger than its name: before restoring, everything in that file
  you intend to keep must already be committed, not just the fix you started with. If you find
  yourself improving the code mid-sabotage — which is common, because you are staring at it —
  commit that before you restore, or you are choosing between the improvement and the proof.

- **Restore with `git checkout -- <the file you sabotaged>`**, naming the file rather than `.`.
  Once the fix is committed this is precise, local, and touches nothing another lane can see.
  **Do not reach for `git stash` here.** This bullet used to end "use `git stash` to restore",
  which was advice for the uncommitted case the rule above has already ruled out — leaving stash
  as strictly the riskier tool for the only case that remains.

  **`refs/stash` lives in the common git dir, so the stash stack is shared by every worktree** —
  and this repo runs several lanes in parallel worktrees. The ref itself is the proof, next to one
  that _is_ per-worktree:

  ```bash
  git rev-parse --git-path refs/stash   # …/ravn-task-management-challenge/.git/refs/stash
  git rev-parse --git-path HEAD         # …/.git/worktrees/<lane>/HEAD
  ```

  So two lanes following this procedure at once push onto one stack, and a bare `git stash pop` in
  one worktree restores the other's work into it. A _sabotage_ is the worst possible thing to
  restore by accident: it is designed to break something, and it arrives looking like your own
  uncommitted edit.

  **For uncommitted single-file work, copy the file — do not stash it.** `cp <file> /tmp/<file>.bak`
  and copy it back. That has no shared namespace and no ordering, so the hazard is removed rather
  than managed. Keep `git stash` for the genuinely multi-file case.

  When you must use the stack, **resolve entries by matching the branch name in `git stash list`,
  never by index** — and that applies to `drop` as much as `pop`. `pop` is the loud failure;
  `drop` is the silent one, and the incident behind this rule was a lane dropping _its own_
  stashes. Its three were `stash@{0}`–`{2}` and another lane's was `stash@{3}`, so index-based
  drops happened to be safe; the other interleaving destroys the foreign entry with nothing
  reporting it.

  **Match on the branch git records, not on a convention you adopted.** Git puts it in the subject
  either way — `WIP on <branch>: …` for a bare stash, `On <branch>: …` with `-m` — which matters
  because the entry you must not clobber belongs to a lane that may never have read this file.
  `-m "<what>"` is still worth passing, for the description rather than the discriminator.

- **Target the right function.** A sabotage applied to `handleCreate` will not fail a test about
  `handleEdit`, and the passing test looks like a toothless one.

All three are about the local loop. **The CI counterpart is the sabotage-on-a-real-runner step of
`/finish-issue`**, which is where that procedure lives.

## Branch layout

`dev` is the standing integration branch — all new work branches off `dev` and PRs back into
it. `main` only receives periodic promotions of a verified-stable `dev` (gate green, and for
anything MCP-related, live-checked, not just "connected") via a `dev` → `main` PR. Nothing
merges into `main` directly.

**One consequence is easy to miss and cost six issues a day of staying open: `Closes #<n>` is
inert here.** GitHub fires the keyword only on a merge into the repository's _default_ branch,
which is `main`, and every lane PR targets `dev` — so the keyword records the link and closes
nothing. Issues are closed by hand, with the merge commit in the closing comment, as
`/finish-issue` step 8 describes. `ravn-ui-kit` is the control that makes this a cause rather
than a theory: its PRs target `main`, so the identical keyword closes its issues automatically,
and its ritual therefore must **not** carry the by-hand step. Making `dev` the default branch
would also fix the keyword and is the wrong trade — `main` is what a reviewer of this submission
clones, and GitHub shows the default branch first.

**`/start-issue` cuts that branch for you, and refuses when it cannot do so safely.** It derives
the base (`origin/dev` if the repo has one, else the repo's default — `dev` here, `main` in
`ravn-ui-kit`), then **stops** if the branch you are standing on has an open PR, rather than
extending work a reviewer is already looking at. Issue branches are named
`<type>/<issue>-<slug>`, so branch → issue is `^[a-z]+/([0-9]+)-`; the number is optional
because `int/` branches, `main` and `dev` answer to no issue, and branches cut before #70 do not
have one. Branches are cut `--no-track`, so that an unpushed branch still reads as unpushed
rather than inheriting `origin/dev` as an upstream it never earned. The reasoning, and the
`switch -C` variant that looks idempotent and silently orphans commits, are in
`.claude/commands/start-issue.md`.

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
readings, checks never observed failing, red checks that are somebody else's outage rather than
your defect, the four couplings that cross a lane boundary invisibly, and the scope of a
dispatched subagent. That is `ui-kit.md`'s failure mode one level up: a rule
surviving only in a transcript is a rule already lost.

**Issues are amended by commenting, so reading an issue means reading its comments.** Neither
human-readable `gh` view shows both: `gh issue view <n>` prints the body without comments, and
`--comments` prints the comments and suppresses the body. `/start-issue` and `/finish-issue`
carry the `--json body,comments` form that returns both in one call, and it is one command
precisely because two can be half-followed. Until this was fixed the correction channel this
project relies on was write-only, and every amendment posted was invisible to every lane —
including two of four "readiness gates" in `ravn-ui-kit#9` that had been corrected as wrong.
Where a comment contradicts the body, the comment is newer and wins. `ravn-ui-kit` keeps its own deliberately
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

**The glob layer is weaker than it reads, and only one of the two layers can be fixed from
here.** Claude Code matches Bash rules per _subcommand_, splitting on `&&`, `||`, `;`, `|`,
`|&`, `&` and newlines, so a deny rule that itself contains a separator can never match one —
which is why `Bash(curl * | sh*)` and its two siblings in `settings.local.json` are very likely
inert, and why the hook is what actually stops a piped download. Delete them on your own
machine; they are three lines of reassurance with nothing behind them. The same reading cuts
the other way for the force-push globs: all six hardcode the literal two-token prefix
`git push`, so `-C <path>` between those two words defeats every one of them at once, and
`Bash(git *)` then positively _allows_ the result. The hook missed it too until #63 — its
`git … push` regex modelled a global option as one whitespace-free token — as it missed
`git push --force;` and the parenthesised twin, which one character of shell punctuation was
enough to slip past. That side is now closed and pinned in `scripts/hooks.test.mjs`. The glob
side is not, and structurally cannot be: `settings.local.json` is gitignored, so no change to
it lands in a PR and nothing in the repository can see it drift. **Treat `block-dangerous.sh`
as the layer that has to be right** — the permissions documentation says outright that Bash
patterns constraining arguments are fragile, and the hook is the only one of the three layers
that review, `gate` and a test can all see.

`permissions.deny` in `settings.json` keeps `package-lock.json`, `coverage/`, `dist/` and
`node_modules/` out of context. `.claudeignore`, which used to claim that job, is not a Claude
Code feature and never excluded anything.

**A `Read()` rule matches the command, not the file, and this passage used to overstate how far
that reaches.** It claimed to cover "Edit, Write, Glob, Grep and the shell's own readers".
Measured here, on paths every one of these rules names:

| probe                                                | result      |
| ---------------------------------------------------- | ----------- |
| `grep -c … node_modules/@ravn/ui-kit/dist/theme.css` | **refused** |
| `grep -c … ./package-lock.json`                      | **refused** |
| `ls -la coverage/<file>`                             | **refused** |
| `node -e` reading `./package-lock.json`              | allowed     |
| `node -e` reading a file under `node_modules/`       | allowed     |
| the **Write** tool, to a path under `coverage/`      | allowed     |

So it does stop a shell reader whose command shape it recognises — that half is real, and the
refusals above are what make the permissions below them meaningful. It does **not** stop a
program that opens the path itself, and it does not reach `Write` at all, which is the least
surprising of the three once you notice a _read_-deny rule was being credited with preventing a
write. `Edit` and `Glob` are untested here and this file no longer claims either way.

**The practical consequence is that four recipes in these pages deliberately go around it, and
they are not violations.** `CLAUDE.md:172` and `.claude/rules/ui-kit.md:42` hand you
`node -e 'require("./package-lock.json")'` to read the `resolved` field, which is the one field
that says which kit build is installed; `CLAUDE.md:206` and `ui-kit.md:62` send you to
`node_modules/@ravn/ui-kit/dist/index.d.ts` as the authoritative local reference for what a kit
component does. Both are load-bearing and both are the point of the rule's boundary rather than
a hole in it: the deny list stops a whole dependency tree arriving in context by accident, and a
named `node -e` reading one field is a deliberate act. That is the distinction the old sentence
collapsed by promising enforcement instead of friction.

The value is real and worth keeping — it is what stops `cat node_modules/…` and a 300 kB
lockfile filling a context window. Treat it as friction, not a boundary.

`scripts/new-lane.sh <lane-name> [branch]` provisions a lane worktree, and exists because doing
it by hand went silently wrong four times: `.claude/skills/` is gitignored so a lane starts with
none, `.claude/settings.local.json` and `.env` are gitignored so a lane starts without either,
and an MCP server can resolve to the wrong scope. Every one of those looks like a working lane.
The path is derived from `git rev-parse --git-common-dir`, never from the working directory:
`../wt/<lane>` is the obvious spelling and it is wrong from inside a worktree, where `..` is
already the worktree root, so it lands at `wt/wt/<lane>` — and a worktree nested inside the repo
is the `.worktrees` episode that `vite.config.ts`, `eslint.config.js` and `.prettierignore` each
carry an entry for. `settings.local.json` is **copied, never regenerated**; it holds approvals a
human accumulated, and a fresh guess silently drops them. The run ends with `npm run gate` and a
checklist read back off the provisioned worktree, because a lane that starts on a red tree
attributes the failure to its own first change. `scripts/new-lane.test.mjs` pins the pre-flight
guards only — everything past them creates a worktree and runs `npm ci`, which no unit suite
should do on every run. Lanes are cut from `origin/dev` here and `origin/main` in the kit, which
is the one line a copy between the two repos gets wrong, so the usage message states it and a
test asserts that it does.

**Nothing enforces `gate` before a commit** — running it is on you. It _is_ enforced before a
merge (see "Branch layout"), but finding out in CI costs a push and a five-minute round trip to
learn what four minutes locally would have told you.

## Not built

Drag-and-drop (bonus #1). Not blocked on anything: every hook needed is already installed. See
the README's bonus section for why it was left out.
