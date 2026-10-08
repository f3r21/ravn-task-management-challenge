# Test plan

**Release status on 2026-10-06: the CI exit criteria are met; the E2E criterion is not, and
cannot be until RAVN's API returns.** So this build can merge, and cannot ship to
production (see [product](../product.md#go-or-no-go)).

## Scope

- **In:** the board, filters, My task and Settings screens; create, edit and delete; the
  GraphQL client; the proxy function `api/graphql.ts`; the deployment's routing and layout.
- **Out:** the kit's components, which the kit tests on its own; RAVN's API itself;
  browsers below the declared floor, which only the lint checks; load and performance
  beyond the bundle budget.

## Environments and data

| Level            | Runs where                                                               | Data                                                                               |
| ---------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Vitest, jsdom    | CI, every pull request                                                   | MSW over an in-memory store that behaves like a server (`src/mocks/task-store.ts`) |
| Proxy unit tests | CI, inside the same Vitest run                                           | A stubbed upstream                                                                 |
| Playwright E2E   | By hand (`workflow_dispatch`) against a URL                              | RAVN's live board; the run creates one task with a unique name and deletes it      |
| Front interviews | The production deployment, in each participant's own browser, 2026-10-07 | The seeded mock; each participant starts in a fresh tab                            |

## Entry criteria

A change is ready to test when:

- it is on a branch with a pull request into `dev`;
- `npm ci` succeeds on the Node version in `.nvmrc`;
- for E2E only: the deployment answers 200, is built for the proxied state
  (`VITE_API_URL=/api/graphql`), and RAVN's API answers. **Not met today:** the API answers 404.

## Exit criteria

A change may merge when all of these hold. Each one is a CI step, so a red step is the
answer.

| Criterion                                                                                     | Measured by                                            | 2026-10-06 (main run 37486098648)          |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------ |
| Typecheck, lint, format check pass                                                            | `npm run gate`                                         | Pass                                       |
| Every test passes, and coverage is at least 85% on statements, branches, functions and lines  | `npm run gate` (Vitest thresholds in `vite.config.ts`) | 489 of 489; 97.72%, 90.95%, 97.59%, 97.62% |
| The production build succeeds, and at least 25 kit-only classes reach the built CSS           | `npm run build`, `npm run css:canary`                  | Pass, 222 classes                          |
| No script over 250,000 bytes (the mock worker aside), and first-load JS at most 620,000 bytes | "Bundle size budget" step in `ci.yml`                  | Pass, 571,621 bytes first load             |
| No high or critical advisory in production dependencies                                       | `npm audit --omit=dev --audit-level=high`              | 0 found                                    |

A release to production also needs:

- the E2E spec passing against the production deployment, with `retries: 0`. **Not met:**
  the last run, 2026-10-06, failed 4 of 5 (run 37415458012);
- the interviews with P1 and P2 leaving no core problem unfixed, where each piece of feedback
  is weighed as a core problem or a preference. **Not met:** they ran on 2026-10-07. F1 fixes
  one core problem; custom labels, weighed core in one session, is not built.

## Who and when

Fernando Ramirez owns the plan. CI runs on every pull request. The E2E spec runs by hand
until the API returns; then its `deployment_status` trigger goes back on
(`.github/workflows/e2e.yml` says how).

## F1: the effort field

The plan for app#202. Everything above still applies.

- **Scope.** In: the word Effort and the help line in the form and the filter; "Effort N" on the
  options, the card and the list row; the help line as the accessible description; filtering by
  effort, including a filter that matches nothing. Out: the API value `pointEstimate` and its
  five values, which do not change; the kit; the blind check, which
  [product](../product.md#f1s-go-or-no-go) owns.
- **Assumptions.** The kit at `v0.9.0` links a `Select`'s `description` through
  `aria-describedby`, and `TaskCard` and `TaskTable` use the `formatPoints` they are given. The
  mock filters by `pointEstimate` the way the API does.
- **Dependencies.** The kit pin at `v0.9.0`. The seed data, where Samsung is the one task with
  effort 8.
- **Entry.** The branch is cut from `feat/202-effort`, and `npm run gate` is green before the
  change.
- **Exit.** The four acceptance-criterion tests in the
  [test map](test-map.md#f1-one-row-per-acceptance-criterion) pass; `npm run gate` and
  `npm run build` are green; three green local runs of the gate are logged in the pull request
  into `dev`.
- **Environments.** Vitest in jsdom over the MSW mock, in CI and locally. `npm run dev` in
  Chromium, by hand, for contrast, target size and layout. Production, for the blind check.
- **Queries.** Tests find controls by role and label, never by a test id. The repo rule wins over
  the QA course advice to add `data-testid`.
- **Claim.** A test reads each of the four places F1 changes: the form and the filter by role,
  label and accessible description, and the card and the row by their text.
- **Limitation.** jsdom loads no CSS, so no test sees whether the help line shows, its contrast or
  its layout. Those were measured once in a browser ([design](../design.md#f1-the-effort-field)),
  and nothing checks them again.
