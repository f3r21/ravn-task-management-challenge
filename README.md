# Task Management Challenge

A task management dashboard built for the RAVN frontend code challenge: browse tasks on a
status board, create them, edit them, delete them, search and filter them, and view the
signed-in user's profile.

**[Live app](https://ravn-task-management-challenge.vercel.app)** — deployed on Vercel and
running against the real API. How it does that without publishing RAVN's token is under
[Deployment](docs/deployment.md).

Every checkbox in the brief's six sections is implemented but one: §6 asks the settings page
to show a `Position`, and `User` has no such field. That gap, and two places where the brief's
wording and the schema's simply differ without costing anything, are spelled out under
[Things the brief asks for that the API cannot do](#things-the-brief-asks-for-that-the-api-cannot-do).

![The dashboard](docs/screenshots/dashboard.jpg)

## What it does

|                                                      |                                                   |
| ---------------------------------------------------- | ------------------------------------------------- |
| ![Creating a task](docs/screenshots/create-task.jpg) | ![No results](docs/screenshots/empty-results.jpg) |
| Creating a task                                      | Filters that match nothing                        |
| ![Settings](docs/screenshots/settings.jpg)           | ![List layout](docs/screenshots/list-view.jpg)    |
| The signed-in user — email redacted, see below       | The list layout                                   |

The email field in that screenshot reads `[email redacted]`. The API's seeded profile is a real
person at RAVN, and this repository is public, so the address is masked in the image rather than
published in it. Nothing else in any screenshot is altered — they are captures of the deployed
build against the live API.

- **Board** — five status columns, task cards with name, tags, due date, points, assignee
  and an options menu. Loading, error and empty states are three distinct things.
- **Create / edit / delete** — a modal for create and edit, a confirmation for delete, and
  a notification for each outcome.
- **Search and filter** — all six filters the brief lists, sent to the API rather than
  applied to a loaded list. Filters live in the URL.
- **My task** (`/settings`) — the signed-in user, from the `profile` query. The label is
  the design's; the route is the one §6 asks for.
- **Calendar, Team, Messages** — sample pages. §2 asks the sidebar for a list of menu items
  "most of them" leading to a placeholder, which needs more destinations than the brief's
  six sections build. They are real routes inside the app shell rather than the not-found
  page: a working menu item that lands on "this page does not exist" reads as a broken link.

## Setup

Requires Node on the 22 line, floored at 22.13.0 — `engines` in `package.json` is `^22.13.0`
and `.nvmrc` pins `22`. CI installs straight from `.nvmrc`, so those two files are the
authority rather than this sentence.

```bash
npm install
npm run dev          # http://localhost:5173
```

Browsers: **Chrome 111, Edge 111, Firefox 128, Safari 16.4, iOS Safari 16.4**, declared in
`package.json`'s `browserslist` — `node -p "require('./package.json').browserslist.join(', ')"`.
That one list is converted into the Vite build target and into a lint over `src/`, so the floor
the build compiles for and the floor the code is checked against cannot disagree. Firefox is 128
rather than Vite's default 114 because that is what Tailwind v4 requires — the lower number was a
claim the stylesheet could not honour.

**It runs with no configuration.** Until the API is configured — which is the state a fresh
clone is in, and the one a half-filled `.env` is still in — the app serves its own mocked data
and says so on screen, so you can clone this and see a working board immediately.

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

| Command                | What it does                                                    |
| ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Dev server                                                      |
| `npm run build`        | Typecheck, then production build                                |
| `npm test`             | Test suite                                                      |
| `npm run test:e2e`     | One Playwright spec against a deployment — needs `E2E_BASE_URL` |
| `npm run coverage`     | Tests with the 85% coverage gate                                |
| `npm run gate`         | Typecheck, lint, format check, coverage — what CI runs          |
| `npm run codegen`      | Regenerate GraphQL types from `schema.graphql`                  |
| `npm run schema:check` | Re-introspect the API and fail if `schema.graphql` has drifted  |
| `npm run css:canary`   | Fail if kit-only Tailwind classes did not reach the built CSS   |

## Stack, and why

| Choice                                                     | Why                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[`@ravn/ui-kit`](https://github.com/f3r21/ravn-ui-kit)** | The Figma file for this challenge is a component library, so it was built as one — a separate package with its own Storybook, tests and CI, consumed here. See [The design system is a separate package](docs/design-system.md).                                                 |
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

## Bonus items

Of the brief's five, these are built:

- **Task count per column** — the design draws it (`In Progress (03)`), zero-padded.
- **Due-date colour by urgency** — all three tiers the brief lists: green while the deadline
  is more than a day out, amber when it is today or tomorrow, red once it is past. Colour is
  never the only signal — the badge spells the date out in every tier, and the overdue one
  adds "(overdue)" for anyone who does not receive colour at all.
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

## Things the brief asks for that the API cannot do

- **§6 asks the settings page to show `Position`.** `User` has no such field. It exposes
  `id`, `fullName`, `email`, `avatar`, `type`, `createdAt` and `updatedAt` —
  `awk '/^type User /,/^}/' schema.graphql` prints exactly those seven, and
  `npm run schema:check` re-introspects the live endpoint to prove that file has not drifted
  from it. The other five requested fields are all shown. Inventing a sixth seemed worse
  than saying this.

  Worth separating from the other `Position`: **§4's editable position is a different
  field and it does exist.** `Task.position` is a `Float!` and `UpdateTaskInput` accepts it
  as a nullable `Float`, so the edit modal sets it. Only `User.position` is missing.

That is the only checkbox the API's shape prevents. Two further differences are listed here
because they are the same kind of surprise, but neither costs anything:

- **§5 calls the points filter `EstimatedPoints`.** The field is `pointEstimate`. The
  schema wins, and the filter itself works exactly as asked — only the name differs.

- **`CreateTaskInput` has no `position`, and the brief never asks for one on create.** The
  server assigns it, so the field appears in the edit modal only — which is where §4 does
  ask for it. A control on create would collect a value with nowhere to send it.

## Decisions worth explaining

**Design tokens are read out of Figma, not eyeballed.** They live in the kit
(`@ravn/ui-kit/theme.css`), which this app imports as its single token layer — the app
defines none of its own. Colours reach a component only through a semantic name that says
what the colour is _for_ (`text-main`, `bg-surface-panel`, `border-subtle`), so a component
cannot quietly reach past the system for a raw hex. Icons are the design's own SVG exports
with the baked `fill` swapped for `currentColor`, so colour still comes from the token layer.

**The brand's own call-to-action fails WCAG AA, and it ships that way.** `text-main` (#FFFFFF)
on `bg-primary-4` (#DA584B) measures 3.83:1 against 1.4.3's 4.5:1, and the selected state
2.83:1. They are accepted rather than fixed because there is nowhere to move: no label colour
in the palette clears it — the darkest, `neutral-5` (#222528), reaches only 4.02:1 — and
`primary-4` is already the red ramp's darkest step. The only remedy is a darker red, which is
a brand change and not this challenge's to make. Sixteen nodes across fourteen stories are
allowlisted, each with its reason, in the kit's
[`.storybook/a11y-allowlist.ts`](https://github.com/f3r21/ravn-ui-kit/blob/v0.4.0/.storybook/a11y-allowlist.ts)
— pinned to the tag this app installs, so it stays checkable. The kit's CI enforces that file:
a new violation fails the build unless it is added deliberately.
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

## Deeper reading

Three areas have more detail than a first read needs. Each is its own file:

- **[The design system](docs/design-system.md)** — why the components are a separate package
  (`@ravn/ui-kit`), what it ships, and how the boundary is enforced.
- **[Deployment](docs/deployment.md)** — Vercel, and why a static SPA needs one serverless
  function to keep RAVN's token out of the bundle.
- **[Testing](docs/testing.md)** — what `npm run gate` checks, what the suite covers, and the
  conventions behind it.

## Notes

- **The schema is pinned, not fetched.** `schema.graphql` is committed and
  `npm run schema:check` re-introspects the API to prove it has not drifted. Codegen reads
  the file, so neither it nor CI needs network access or a credential.
- **History** is one branch and one pull request per unit of work, throughout. The brief
  itself shipped as eight stacked branches — §1, §2, §3 read, §3 create, §4, §5, §6, and
  the README — eight for six sections, because §3 is large enough to split and the README
  is a graded deliverable of its own. Each was revised after an adversarial review; the
  fixes are in the commit messages. Everything since has arrived the same way and the
  count keeps climbing, so `gh pr list --state all` is the answer rather than a number
  written here: work now branches off `dev` and merges back by pull request with CI green,
  which a repository ruleset enforces rather than trusting to habit.

## License

[MIT](LICENSE).
