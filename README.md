# Task Management Challenge

A task management dashboard built for the RAVN frontend code challenge: browse tasks on a
status board, create them, edit them, delete them, search and filter them, and view the
signed-in user's profile.

Every checkbox in the brief's six sections is implemented, with two exceptions that are
the API's shape rather than choices — both spelled out under
[Things the brief asks for that the API cannot do](#things-the-brief-asks-for-that-the-api-cannot-do).

![The dashboard](docs/screenshots/dashboard.jpg)

## Setup

Requires Node 22 or newer.

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
anywhere in this repository.

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
| ![Settings](docs/screenshots/settings.jpg)           |                                                   |
| The signed-in user                                   |                                                   |

- **Board** — five status columns, task cards with name, tags, due date, points, assignee
  and an options menu. Loading, error and empty states are three distinct things.
- **Create / edit / delete** — a modal for create and edit, a confirmation for delete, and
  a notification for each outcome.
- **Search and filter** — all six filters the brief lists, sent to the API rather than
  applied to a loaded list. Filters live in the URL.
- **Settings** — the signed-in user, from the `profile` query.

## Stack, and why

| Choice                                    | Why                                                                                                                                                                                                                                                                              |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React 19 + TypeScript (strict)**        | `any` and `@ts-ignore` are lint errors, not warnings.                                                                                                                                                                                                                            |
| **Vite 8**                                | Fast dev server; the build is `tsc --noEmit` then bundle, so types gate the build.                                                                                                                                                                                               |
| **Tailwind v4**                           | RAVN's published frontend standard. Tailwind v4 configures through CSS custom properties in `@theme`, so the Figma palette becomes semantic design tokens rather than a JS config object.                                                                                        |
| **TanStack Query v5**                     | Server state has different needs from client state — caching, deduplication, invalidation. RAVN's `state-server-vs-client` rule says to separate them, and this is the library its own examples use.                                                                             |
| **A hand-written `fetch` GraphQL client** | React Query already owns caching. A GraphQL client with its own normalised cache underneath it would put two sources of truth under the same task, and two places to look when the board disagrees with itself. What was actually needed is one typed function.                  |
| **graphql-codegen**                       | Operations are typed from the schema, so reading a field a query did not select is a compile error.                                                                                                                                                                              |
| **React Aria (hooks)**                    | Modals, menus, selects, radio groups and toasts are where accessibility is easy to get subtly wrong — focus containment and restoration, Escape, inerting the page behind, roving tabindex, typeahead. RAVN's `aria-use-react-aria-hooks` rule calls for the hooks specifically. |
| **MSW v2**                                | RAVN's `mock-msw-external-apis` rule. It intercepts at the network layer, so tests exercise the real client code rather than a stubbed module — and the same handlers let the app run without credentials.                                                                       |
| **Vitest + Testing Library**              | Queries by role and label, never by test id.                                                                                                                                                                                                                                     |
| **react-router 8**                        | §1's routing requirement. Pinned rather than caret-ranged: every 7.x release falls inside at least one published advisory range. The route table is a plain array so tests mount the real thing and navigate for real.                                                           |
| **date-fns**                              | Parsing and validating API dates. Formatting is `Intl` with an explicit `timeZone` — see the UTC note below for why a date library reading local fields was the wrong tool for that half.                                                                                        |
| **react-stately**                         | The state half of the React Aria hooks: collections, overlay triggers, radio groups, the toast queue.                                                                                                                                                                            |
| **clsx + tailwind-merge**                 | One `cn` helper, so a component's own class can override a variant's instead of both landing in the output and letting source order decide.                                                                                                                                      |

Those RAVN rules are published at
[`ravnhq/ai-toolkit`](https://github.com/ravnhq/ai-toolkit) — `platform-frontend`,
`tech-react`, `design-frontend`, `tech-vitest`, `lang-typescript`.

### Structure

Organised by feature, not by type, with named exports and no barrel files — all three from
RAVN's `platform-frontend` rules.

```
src/
├── app/         routing, providers, query client
├── features/    board/ · profile/ · navigation/
├── ui/          design-system pieces: button, dialog, menu, select, tag, toast, …
├── graphql/     client + generated types
├── lib/         cn, dates, env, assertNever
├── shared/      storage, debounce
├── mocks/       MSW handlers + an in-memory store
└── test/        the one render helper every test goes through
```

A component lives inside the feature that uses it, and moves to `ui/` only once something
else needs it.

## Decisions worth explaining

**Design tokens are read out of Figma, not eyeballed.** The raw colour ramp lives in
`:root` and only _semantic_ names go into Tailwind's `@theme` — so `bg-neutral-4` is not a
class that exists, and a component physically cannot reach a colour except through a name
that says what it is for. Icons are the design's own SVG exports, kept verbatim in
`src/ui/icons/assets/` for comparison, with the baked `fill` swapped for `currentColor` so
colour comes from the token layer.

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

Drag-and-drop was deliberately skipped: it is a keyboard-accessibility problem more than a
layout one, and changing a task's status through the options menu already exercises the
same `updateTask` mutation.

## Testing

237 tests. `npm run gate` runs typecheck, lint, format check and coverage against an 85%
threshold on every metric; CI runs the same thing, plus a production build, on every pull
request.

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

- **The endpoint moved.** The URL in the original brief
  (`syn-api-prod.herokuapp.com`) no longer resolves; the current one is on Railway.
  `schema.graphql` is committed and `npm run schema:check` re-introspects the API to prove
  it has not drifted. Codegen reads the file, so neither it nor CI needs network access or
  a credential.
- **History** is one branch and one pull request per section of the brief, each with CI
  green before merge.
