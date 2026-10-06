---
name: backends
description: The three-state API config, the GraphQL data path, generated types, and the MCP scope trap.
paths:
  - 'src/lib/env.ts'
  - 'src/graphql/**'
  - 'src/mocks/**'
  - 'api/**'
  - '.mcp.json'
---

# Two backends, one code path

`readApiConfig` in `src/lib/env.ts` resolves to **three** states, not two. `src/lib/env.ts` is
the app's only read of `import.meta.env`.

- **`direct`**: an absolute `VITE_API_URL` **plus** `VITE_API_TOKEN`. Required together, because
  an absolute URL with no token reaches a real server that answers `UNAUTHENTICATED`, which looks
  broken rather than unconfigured.
- **`proxied`**: a same-origin path, no token. A token set alongside it is dropped, not
  forwarded, because the proxy attaches its own. This is the deployed shape: Vercel serves
  `/api/graphql` and `api/graphql.ts` holds the credential.
- **`undefined`, so mock**: no `VITE_API_URL`, or an absolute one with no token. `apiUrl` falls
  back to `MOCK_API_URL` and `main.tsx` awaits MSW's worker before first render.

Re-derive: `grep -n "mode: '" src/lib/env.ts`.

**There is no mock-mode branch in the app.** `src/graphql/client.ts` always performs a real
`fetch` and MSW intercepts at the network layer, so the request a test exercises is the request
that runs in production, and nothing under `src/features` knows which backend it talks to.
`shouldStartMockWorker()` exists so the bootstrap does not re-decide "are we mocking" from raw
env. It got that wrong once, gating on the URL alone, and `main.tsx` is excluded from coverage,
so nothing caught it.

**Which backend is live varies by machine**, since `.env` is gitignored. Check with
`grep -c '^VITE_API_TOKEN=.\+' .env`, do not assume. Reads can be run live with confidence.
Mutations need the same confirmation as any other change to shared live data.

## The credential and the shell

**Start `claude` plainly. Do not export anything.** The `graphql` MCP server sources `.env`
inside its own process. `${VAR}` expansion in `.mcp.json` reads the launching shell instead,
which is why this used to require an `export` line. `ALLOW_MUTATIONS` is left unset, so the tool
structurally cannot mutate.

That fixes verification, not exposure. Vite reads `.env` from disk itself, so any build in a
checkout that has one inlines the token. The hazard is that **a shell carrying `VITE_*`
contaminates any clone-equivalent check run from it**: a fresh clone has no `.env`, Vite falls
back to `process.env`, and a "is this app credential-free" run silently talks to the live API and
passes for the wrong reason. Confirm the shell is clean with
`env -i HOME=$HOME PATH=$PATH zsh -l -c 'echo ${VITE_API_TOKEN:-UNSET}'`. A plain `zsh -l -c`
inherits the parent's exports, so it answers the wrong question.

## The MCP scope trap

**An MCP server can exist in more than one scope under the same name, and the wrong one wins
silently.** `claude mcp add` writes a per-project local scope in `~/.claude.json`, separate from
the project scope `.mcp.json` provides, and the local entry shadows it with no warning. This
project's `graphql` server was broken for a whole debugging session that way, producing a generic
`TypeError: fetch failed` regardless of how correct `.mcp.json` was. If an MCP tool that should
work fails outright, run `claude mcp remove <name>` first: if it complains about multiple scopes,
that is the bug.

**A worktree inherits the shadow rather than escaping it.** Local scope is keyed by the main
checkout's absolute path, so a lane resolves through that key even though its own path appears
nowhere in `~/.claude.json`. A stale local entry follows every worktree and keeps winning.
`scripts/new-lane.sh` names the collision in its checklist, which is all a provisioner should do,
since clearing it means deleting configuration a human wrote.

# The data path

`useBoardFilters` (URL query params) to debounce to `FilterTaskInput` to a React Query key to
`useTasks` to `request()` to MSW or the live API.

- **Filters live in the URL**, not component state. Linkable, survives reload, and lets the
  header's search box and the board's filter bar share state without importing each other. Every
  value read back out is validated (`readMember`, `readDate`, `readOwner`), because a hand-edited
  `?status=nonsense` would otherwise turn a typo into an error screen. Writes are
  `{ replace: true }`, so back leaves the board rather than retracing keystrokes.
- **`queryInput` omits empty values** rather than sending `null`. The query key derives from it,
  so `{ name: '' }` and `{}` would be two cache entries for one board.
- **Filtering is server-side**, per the brief's query arguments, and because filtering locally
  means fetching every task to show three.
- **`taskKeys.all` is what mutations invalidate**, prefix-matching every filtered variant at
  once. `useTasks` uses `keepPreviousData` so the board does not thrash to a skeleton on every
  keystroke.
- **Server state is React Query's, client state is React's**, with no GraphQL cache underneath.
  Do not add Apollo, Relay or `graphql-request`.

# Generated types are the domain model

`schema.graphql` to `npm run codegen` to `src/graphql/generated/`. Nothing redeclares an API
shape. `Task` and `User` are canonical at `@/graphql/domain`;
`features/board/task-types.ts` only aliases and re-exports them, and keeps the three
`exhaustiveList` orderings, which are board policy rather than API vocabulary.

`exhaustiveList<Status>()([...])` and `assertNever` on every enum switch in `task-display.ts`
exist for one reason: when the API gains a sixth status, that is a compile error naming what
needs a case, instead of a card rendering a raw `IN_PROGRESS`.

Six operations, all in `src/graphql/operations/tasks.graphql`: queries `Tasks`, `Users`,
`Profile`; mutations `CreateTask`, `UpdateTask`, `DeleteTask`. Do not add one outside that
contract.

`npm run schema:check` re-introspects the live API and fails if `schema.graphql` drifted. It only
checks. Updating the schema is by hand, then `npm run codegen`. Never `any` or `@ts-ignore` on a
GraphQL response.

## The mock is not a contract

`FilterTaskInput` carries no descriptions, so every filter rule in `src/mocks/task-store.ts` is
that fake's own reading of the field names. `dueDate` in particular is more permissive than an
exact `DateTime` comparison. Tests over it pin the fake, they do not prove the real API agrees.

**`UpdateTaskInput` is a patch, `CreateTaskInput` is not.** Omitting `assigneeId` on update means
"leave it alone", which made unassigning impossible: `null` is what says nobody. The opposite
holds for `position`, where omitting leaves the server's ordering alone because `null` on a
`Float!` is a request to unset it.
