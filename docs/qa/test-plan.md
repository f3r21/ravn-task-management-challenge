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
  is weighed as a core problem or a preference. **Pending:** they run on 2026-10-07.

## Who and when

Fernando Ramirez owns the plan. CI runs on every pull request. The E2E spec runs by hand
until the API returns; then its `deployment_status` trigger goes back on
(`.github/workflows/e2e.yml` says how).
