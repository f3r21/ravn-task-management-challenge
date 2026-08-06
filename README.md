# Task Management Challenge

A task management dashboard built for the RAVN frontend code challenge: browse tasks on a
status board, create them, edit them, delete them, search and filter them, and view the
signed-in user's profile.

**[Live app](https://ravn-task-management-challenge.vercel.app)** — deployed on Vercel and
running against the real API. How it does that without publishing RAVN's token is under
[Deployment](#deployment).

Every checkbox in the brief's six sections is implemented, with two exceptions that are
the API's shape rather than choices — both spelled out under
[Things the brief asks for that the API cannot do](#things-the-brief-asks-for-that-the-api-cannot-do).

![The dashboard](docs/screenshots/dashboard.jpg)

## Setup

Requires Node 22.13 or newer (see `engines` in `package.json`).

```bash
npm install
npm run dev          # http://localhost:5173
```

**It runs with no configuration.** With no API token present the app serves its own mocked
data and says so on screen, so you can clone this and see a working board immediately.

To point it at the real API instead:

```bash
cp .env.example .env
# paste your token after VITE_API_TOKEN= and restart the dev server
```

The token is the one RAVN issues by email. `.env` is gitignored and no token appears
anywhere in this repository. Once both values are filled in, `npm run dev` connects to the
live API automatically and the mock banner disappears — there is no separate "live mode" to
switch on.

### Commands

| Command                | What it does                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Dev server                                                     |
| `npm run build`        | Typecheck, then production build                               |
| `npm test`             | Test suite                                                     |
| `npm run coverage`     | Tests with the 85% coverage gate                               |
| `npm run gate`         | Typecheck, lint, format check, coverage — what CI runs         |
| `npm run codegen`      | Regenerate GraphQL types from `schema.graphql`                 |
| `npm run schema:check` | Re-introspect the API and fail if `schema.graphql` has drifted |

## What it does

|                                                      |                                                   |
| ---------------------------------------------------- | ------------------------------------------------- |
| ![Creating a task](docs/screenshots/create-task.jpg) | ![No results](docs/screenshots/empty-results.jpg) |
| Creating a task                                      | Filters that match nothing                        |
| ![Settings](docs/screenshots/settings.jpg)           | ![List layout](docs/screenshots/list-view.jpg)    |
| The signed-in user                                   | The list layout                                   |

- **Board** — five status columns, task cards with name, tags, due date, points, assignee
  and an options menu. Loading, error and empty states are three distinct things.
- **Create / edit / delete** — a modal for create and edit, a confirmation for delete, and
  a notification for each outcome.
- **Search and filter** — all six filters the brief lists, sent to the API rather than
  applied to a loaded list. Filters live in the URL.
- **My task** (`/settings`) — the signed-in user, from the `profile` query. The label is
  the design's; the route is the one §6 asks for.

## Stack, and why

| Choice                                                     | Why                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[`@ravn/ui-kit`](https://github.com/f3r21/ravn-ui-kit)** | The Figma file for this challenge is a component library, so it was built as one — a separate package with its own Storybook, tests and CI, consumed here. See [The design system is a separate package](#the-design-system-is-a-separate-package).                              |
| **React 19 + TypeScript (strict)**                         | `any` and `@ts-ignore` are lint errors, not warnings.                                                                                                                                                                                                                            |
| **Vite 8**                                                 | Fast dev server; the build is `tsc --noEmit` then bundle, so types gate the build.                                                                                                                                                                                               |
| **Tailwind v4**                                            | RAVN's published frontend standard. Tailwind v4 configures through CSS custom properties in `@theme`, so the Figma palette becomes semantic design tokens rather than a JS config object.                                                                                        |
| **TanStack Query v5**                                      | Server state has different needs from client state — caching, deduplication, invalidation. RAVN's `state-server-vs-client` rule says to separate them, and this is the library its own examples use.                                                                             |
| **A hand-written `fetch` GraphQL client**                  | React Query already owns caching. A GraphQL client with its own normalised cache underneath it would put two sources of truth under the same task, and two places to look when the board disagrees with itself. What was actually needed is one typed function.                  |
| **graphql-codegen**                                        | Operations are typed from the schema, so reading a field a query did not select is a compile error.                                                                                                                                                                              |
| **React Aria (hooks)**                                     | Modals, menus, selects, radio groups and toasts are where accessibility is easy to get subtly wrong — focus containment and restoration, Escape, inerting the page behind, roving tabindex, typeahead. RAVN's `aria-use-react-aria-hooks` rule calls for the hooks specifically. |
| **MSW v2**                                                 | RAVN's `mock-msw-external-apis` rule. It intercepts at the network layer, so tests exercise the real client code rather than a stubbed module — and the same handlers let the app run without credentials.                                                                       |
| **Vitest + Testing Library**                               | Queries by role and label, never by test id.                                                                                                                                                                                                                                     |
| **react-router 8**                                         | §1's routing requirement. Pinned rather than caret-ranged: every 7.x release falls inside at least one published advisory range. The route table is a plain array so tests mount the real thing and navigate for real.                                                           |
| **date-fns**                                               | Parsing and validating API dates. Formatting is `Intl` with an explicit `timeZone` — see the UTC note below for why a date library reading local fields was the wrong tool for that half.                                                                                        |
| **react-stately**                                          | The state half of the React Aria hooks: collections, overlay triggers, radio groups, the toast queue.                                                                                                                                                                            |
| **clsx + tailwind-merge**                                  | One `cn` helper, so a component's own class can override a variant's instead of both landing in the output and letting source order decide.                                                                                                                                      |

Those RAVN rules are published at
[`ravnhq/ai-toolkit`](https://github.com/ravnhq/ai-toolkit) — `platform-frontend`,
`tech-react`, `design-frontend`, `tech-vitest`, `lang-typescript`.

### Structure

Organised by feature, not by type, with named exports and no barrel files — all three from
RAVN's `platform-frontend` rules.

```
src/
├── main.tsx     bootstrap: starts MSW when unconfigured, then renders
├── app/         routing, providers, query client, error boundary
├── features/    board/ · profile/ · navigation/
├── ui/          design-system pieces still owned here: button, dialog, tag, toast, …
├── graphql/     operations, the fetch client, generated types
├── lib/         cn, dates, env, assertNever, exhaustive
├── shared/      debounce
├── styles/      the token layer
├── mocks/       MSW handlers + an in-memory store
└── test/        the one render helper every test goes through
```

A component lives inside the feature that uses it, and moves to `ui/` only once something
else needs it.

## The design system is a separate package

The Figma file for this challenge is not a set of screens — it is a component library, with
a style guide, per-component specs and variant states. Building those components inline in
`src/ui/` would have meant a design system that only existed as a side effect of one app.

So it is its own package: **[`@ravn/ui-kit`](https://github.com/f3r21/ravn-ui-kit)** — 36
components built from the Figma export, each with Storybook stories, its own test suite and
its own CI. **[Browse the Storybook](https://f3r21.github.io/ravn-ui-kit/)** to see every
component, its props and its states without cloning anything.

This app is its first consumer, and consuming it is what proves the package
works: several real defects (a popover that could not escape an `overflow: hidden` ancestor,
a focus ring that computed a colour and painted nothing, `onAction` firing twice per menu
pick) were found only by wiring it into something real, and were fixed in the kit rather
than patched around here.

The migration is deliberately incomplete and tracked as such. `Modal`, `Select`,
`MultiSelect` and `Menu` come from the kit today; `Avatar`, `Button`, `Tag`, `Skeleton` and
the board components are still app-owned and queued to move. `EmptyState`, `ErrorBoundary`,
the toast system and the icon set stay here for now because the kit has no equivalent yet.

### Why there is a `vendor/` directory

`@ravn/ui-kit` has no npm registry to publish to, so this app depends on it by path. Locally
that would be `file:../ravn-ui-kit` — but CI clones only _this_ repository, so that path can
never resolve there and `npm ci` would fail on the first import.

The fix is to vendor a built copy: `vendor/ravn-ui-kit/` holds the package's `dist/` output
and a trimmed `package.json`, and the dependency is `file:./vendor/ravn-ui-kit`. It is build
output, never hand-edited — `vendor/ravn-ui-kit/README.md` documents the re-sync procedure,
and every re-sync lands as its own commit so a kit change is never mixed into an app change.

The alternative was a monorepo. It was not chosen because the kit is meant to outlive this
app, and a package that can only be built from inside its one consumer is not really a
package.

## Deployment

Vercel, at **[ravn-task-management-challenge.vercel.app](https://ravn-task-management-challenge.vercel.app)**,
with a preview deployment per pull request.

**Why a static SPA has a serverless function.** Vite replaces `import.meta.env.VITE_*` at
build time, which means a deployed build configured the way local development is configured
would ship RAVN's access token as a readable string in `dist/` — findable with devtools, or
with `grep`, on a public URL. There is no browser-side fix for that: the token has to reach
the API, and everything the browser can read is public. So it never reaches the browser.
`api/graphql.ts` runs on Vercel, reads `API_TOKEN` from the deployment's environment — no
`VITE_` prefix, which is exactly what would put it back in the bundle — and forwards the
query. The app posts to `/api/graphql` on its own origin carrying no credential at all.

**What that cost.** `readApiConfig` in `src/lib/env.ts` had two states, and it required a
URL and a token together — so a deployment pointed at `/api/graphql` with the token held
server-side read as "not configured", fell back to the MSW mock, and would have served
seeded data under a banner telling the visitor to edit a `.env` file they do not have. It
now has three:

|             | `VITE_API_URL` | Token    | Where                                               |
| ----------- | -------------- | -------- | --------------------------------------------------- |
| **mock**    | unset          | —        | a clone with no credentials; MSW serves seeded data |
| **direct**  | absolute       | required | local development with a filled-in `.env`           |
| **proxied** | `/api/graphql` | none     | the deployment; the server holds it                 |

The rule that a URL needs a token is unchanged rather than relaxed. It exists because an
absolute URL reaches a server that answers every query `UNAUTHENTICATED` — the app looks
broken rather than unconfigured — and a same-origin path cannot fail that way, because it
reaches this app's own origin. `//host/path` is excluded by name: it starts with a slash
and resolves somewhere else entirely.

**The endpoint is intentionally open, which is a trade rather than an oversight.** The app
has no concept of a user, so there is nothing to authenticate a caller against; anyone who
finds the URL can post a query through it. Checking `Origin` would stop nothing, since a
header is trivially set outside a browser. What the proxy does buy is that the credential
itself stays unreadable and can be rotated in one place — the difference between a misused
endpoint and a leaked token.

The rest is small. `vercel.json` rewrites everything that is not a static file or a function
to `index.html`, because `createBrowserRouter` serves `/settings` from JavaScript and a
direct hit on it would otherwise ask the host for a file that does not exist; `/api/` is
excluded so a mistyped function path 404s instead of being answered with the app's HTML.
`VITE_API_URL` is pinned in that file rather than in the dashboard, because forgetting it is
silent — the deployed board would quietly show mock data. `API_TOKEN` is the only secret,
and it only exists in Vercel's environment.

The proxy is exported as `POST`, not as a default handler. Vercel reads a default export as
Node's `(req, res) => void` and ignores what it returns, so the first deploy answered
nothing at all and hung until the platform timed it out. The export name doubles as the
method restriction: anything that is not a POST is refused before the function runs.

**Two response headers, and no Content-Security-Policy.** `vercel.json` sends
`X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.
Neither can break this app — nothing here is served with a content type a browser would want
to second-guess — and the referrer policy does something real: task cards load avatars from
whatever host the API names, and without it every one of those requests carries the board's
full URL, filters and search term included, to a third party.

There is deliberately no CSP, and `frame-ancestors` is deliberately not set. A CSP would be
about eight lines and it is the thing reviewers grep for, so the reasoning matters more than
the answer. Two parts:

- **It cannot be verified before it ships.** Header rules do not apply to `vite preview` or
  `npm run dev`; the first time a policy is real is on a deployment, and a policy that is one
  directive short takes the app down in a way no local check can see beforehand. Against
  that, what a CSP defends is script injection, and this app has no `dangerouslySetInnerHTML`,
  no `eval`, no user-supplied markup and no third-party scripts — React escapes every string
  that reaches the DOM. The trade is a real outage risk against a hypothetical one.
- **Framing buys an attacker nothing here.** `frame-ancestors` stops clickjacking, and the
  action worth clickjacking is deleting a task. But `/api/graphql` is intentionally open —
  the app has no users to authenticate, so anyone who wants to delete a task can simply post
  the mutation. There is no privilege a framed click could borrow that a `curl` does not
  already have.

Both would change the moment this app grew a login. The e2e spec against the deployment (see
[Testing](#testing)) is what would catch a CSP that broke the board, so the ordering is:
users first, then the policy, with a check that can prove it.

## Decisions worth explaining

**Design tokens are read out of Figma, not eyeballed.** They live in the kit
(`@ravn/ui-kit/theme.css`), which this app imports as its single token layer — the app
defines none of its own. Colours reach a component only through a semantic name that says
what the colour is _for_ (`text-main`, `bg-surface-panel`, `border-subtle`), so a component
cannot quietly reach past the system for a raw hex. Icons are the design's own SVG exports
with the baked `fill` swapped for `currentColor`, so colour still comes from the token layer.

**The board shows five columns where the mockup shows three.** The brief lists five
statuses; the mockup predates the schema. Five equal shares of a 1440px viewport leaves
each card around 200px, at which point the points label, date badge and tag row all wrap
and the card stops resembling the design — so columns keep the 348px width they are drawn
at and the row scrolls sideways, collapsing to two columns and then one on smaller screens.

**Search is a text field, not the button Figma draws.** The mockup renders the whole search
bar as a `<button>` containing the word "Search". That is a mockup convention; a button
would not accept typing.

**Filters live in the URL.** A filtered board can be linked and bookmarked, and a reload
does not silently reset to "everything" while the controls still look set. It is also what
lets the search box in the app shell drive a query on the page without either side importing
the other. Every value read back out is validated first — enums against their member list,
`due` as a real calendar date, `owner` against the directory — because a hand-edited
`?status=nonsense` or `?due=nonsense` would otherwise reach the API and be rejected, turning
a typo in a shared link into an error screen.

Filter changes _replace_ the history entry rather than pushing one, so a single back press
leaves the board instead of retracing every keystroke. That is a deliberate trade: the
board is linkable but the back button is not a filter undo.

**Dates are read in UTC.** The API types `dueDate` as a `DateTime` but uses it as a date:
the values it returns sit at midnight UTC. Interpreting those in the viewer's local zone
moves them — west of Greenwich a task due tomorrow renders as "Yesterday", in overdue red.
The whole test suite therefore runs at **UTC+14**, so any code reaching for a local calendar
field fails a test rather than shipping.

That pin is necessary and not sufficient, which took a bug to learn. UTC+14 is a _fixed_
offset, so it cannot catch anything that depends on daylight saving — and the original
implementation reconstructed the UTC clock by writing those fields into a local `Date`,
which lands on a time that does not exist in any zone that skips an hour. Formatting now
goes through `Intl` at an explicit `timeZone`, and the tests switch zone deliberately to
cover it.

**The failure a user can act on is different from the one they cannot.** GraphQL answers
`200 OK` with an `errors` array, so "did this work" is not a status code. A rejected token
is called out specifically and offers no retry button, because retrying cannot fix it;
anything else can be retried.

## Things the brief asks for that the API cannot do

- **§6 asks the settings page to show `Position`.** `User` has no such field. It exposes
  `id`, `fullName`, `email`, `avatar`, `type`, `createdAt` and `updatedAt` — confirmed
  against the live endpoint's own introspection response, not inferred. The other five
  requested fields are all shown. Inventing a sixth seemed worse than saying this.

  Worth separating from the other `Position`: **§4's editable position is a different
  field and it does exist.** `Task.position` is a `Float` and `UpdateTaskInput` accepts
  it, so the edit modal sets it. Only `User.position` is missing.

- **§5 calls the points filter `EstimatedPoints`.** The field is `pointEstimate`. The
  schema wins.
- **`CreateTaskInput` has no `position`.** The server assigns it on create, so the field
  appears in the edit modal only — a control on create would collect a value with nowhere
  to send it.

## Bonus items

Three of the five:

- **Task count per column** — the design draws it (`In Progress (03)`), zero-padded.
- **Due-date colour by urgency** — red when overdue, amber when due today or tomorrow. The
  brief suggests green for on-time; this uses the design's neutral badge instead, because
  green is already the `iOS app` tag colour and a green badge sitting above a green chip
  reads as a relationship that is not there.
- **A list layout as well as the board** — each status becomes a full-width section and
  each task a single row, rather than the same card stacked. Worth being precise about why
  that distinction matters: the board is _already_ one stacked column at narrow widths, so
  a list view built by stacking would have been a switcher that did nothing on a phone.

Drag-and-drop was left out for scope, not difficulty — and it is worth being precise about
that, because the easy excuse would be accessibility. The installed React Aria ships the
whole accessible drag story: a keyboard mode, drop-target navigation and localised screen
reader announcements. The obstacle was the collection layer each column would need, not the
keyboard. A task's status and its position within a column can both be changed from the
options menu, which exercises the same `updateTask` mutation a drop would.

## Testing

247 tests. `npm run gate` runs typecheck, lint, format check and coverage against an 85%
threshold on every metric; CI runs the same thing, plus a production build, on every pull
request.

The suite pins `VITE_API_URL`/`VITE_API_TOKEN` empty in `vite.config.ts`'s `test.env`, so it
always runs against the MSW mock. That is not belt-and-braces — Vitest loads `.env` through
Vite like any other build, and `.env` here is gitignored and per-developer, so without the
pin two tests passed or failed depending on whether the machine running them happened to
have real credentials configured. CI never saw it, because CI has no `.env`.

A few conventions:

- **No test ids.** Queries go through role, label and text — the things a user perceives.
- **MSW runs with `onUnhandledRequest: 'error'`,** so a missing handler fails the test
  loudly rather than falling through to the network and passing against live data.
- **The mock store behaves like a server** — a created task appears in the next query,
  filters genuinely narrow, deletes remove. A fixed list would let a broken cache
  invalidation pass its own test. It is excluded from the coverage _metric_ (it is a test
  double; counting it moves the number by the fake's complexity rather than the app's) but
  unit-tested directly, because the filter tests trust it to behave like the real API.

Several defects here were found only by driving the app in a real browser rather than
trusting jsdom — a multi-select that cleared previous selections on each pick, an Escape
key that closed a dialog along with the dropdown inside it, and an unhandled promise
rejection every test happily passed through. Each has a regression test now.

The traffic goes both ways, which is the more useful lesson. jsdom does not reflect the
`inert` property to an attribute and does not evaluate media queries, so it will call a
hidden notification reachable and show two navigation landmarks where a browser shows one.
A browser, in turn, will report focus dropped on `<body>` if the interaction is driven with
`element.click()` instead of real input, because that is not the press sequence React Aria
listens for. Anything about focus or the accessibility tree is checked in both.

## Notes

- **The schema is pinned, not fetched.** `schema.graphql` is committed and
  `npm run schema:check` re-introspects the API to prove it has not drifted. Codegen reads
  the file, so neither it nor CI needs network access or a credential.
- **History** is one branch and one pull request per step: §1, §2, §3 read, §3 create, §4,
  §5, §6, and the README. Eight for six sections, because §3 is large enough to split and
  the README is a graded deliverable of its own. Each was revised after an adversarial
  review; the fixes are in the commit messages.

## AI Tooling (Claude Code)

This repository is heavily instrumented for AI development via [Claude Code](https://github.com/anthropics/claude-code). The configuration ensures AI agents adhere strictly to the project's quality standards without hallucinations or context bloat:

- **`.claudeignore`**: Prevents Claude from reading massive autogenerated files (`package-lock.json`, `coverage/`) to save context tokens.
- **Modular Rules (`.claude/rules/`)**: Context-aware instructions (`bonus-points.md`, `code-review.md`, `graphql-api.md`) loaded as plain project context, restating the conventions in `CLAUDE.md`.
- **Automated Hooks (`.claude/settings.json`)**:
  - `PostToolUse`: Instantly runs `npx eslint --fix` and `npx prettier --write` whenever Claude saves a file, silently correcting minor syntax issues in the background.
  - `PreToolUse`: Blocks a handful of destructive bash patterns (`rm -rf /`, force push, `curl | sh`). Nothing enforces `gate` before a commit — running it is on you. A repository ruleset does enforce it before a merge: `main` and `dev` take changes by pull request only, with CI green against an up-to-date branch, and no force-push or deletion.
  - **Permissions**: Playwright and Chrome DevTools are whitelisted to run headless tests silently without interrupting the agent.

## License

[MIT](LICENSE).
