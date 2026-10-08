# Test map

**Green CI proves the app behaves as written against a fake API that acts like a server. It
does not prove the deployment works today, and it cannot: the only test that would is
blocked on RAVN's API.**

Counts are from CI on 2026-10-06, main run 37486098648, unless a row says otherwise.

| Suite                                                                   | What it proves                                                                                                                                                                                                                  | What it does not prove                                                                                                                                     |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vitest and Testing Library over `src/` (39 files, 489 tests)            | Each feature works through what a user touches (roles, labels, text). The mock store narrows, creates and deletes like a server, so a broken cache invalidation fails. Dates hold at UTC+14 and across a daylight-saving change | That RAVN's real API answers the same way. Layout, `inert`, media queries and real focus, which jsdom does not model                                       |
| Proxy tests, `api/graphql.test.ts`                                      | The token is added on the server and never echoed; only the app's own operations pass; a slow or broken upstream gets an answer, not a hang                                                                                     | That the function runs on Vercel. Its first deploy hung on an export shape this test could not see (`docs/testing.md`)                                     |
| `ui-kit-smoke.test.tsx`                                                 | The installed kit exports every component the app imports, at the version the pin names                                                                                                                                         | That the kit's components look right; the kit's own Storybook and axe run cover that                                                                       |
| `board-render-cost.test.tsx`                                            | A keystroke in search re-renders no task cards                                                                                                                                                                                  | Real-world speed on a slow device                                                                                                                          |
| Coverage gate, 85% on four metrics (97.72% statements, 90.95% branches) | Which lines ran                                                                                                                                                                                                                 | That the assertions mean anything; that is what reviewing each test is for                                                                                 |
| Lint against `browserslist`                                             | No browser API above the support floor is used by name                                                                                                                                                                          | An API reached through a value. The one shipped defect, `URL.canParse`, was reached by name before this lint existed                                       |
| `npm run css:canary` (222 kit-only classes found, minimum 25)           | Tailwind scanned the kit, so its classes reach the built CSS                                                                                                                                                                    | That every class a component needs is present                                                                                                              |
| Bundle budget (571,621 bytes first load, budget 620,000)                | First-load JavaScript did not grow past the line                                                                                                                                                                                | Runtime speed                                                                                                                                              |
| `npm audit --omit=dev` (0 high or critical)                             | Nothing that ships carries a known high advisory                                                                                                                                                                                | Anything about devDependencies (42 high and 1 critical, reported, not blocking), or advisories not yet published                                           |
| Playwright, `e2e/deployed-proxy.spec.ts` (5 tests)                      | When it passes: the deployed proxy, routing and token work end to end; create, filter, edit and delete work in Chromium; the page never scrolls sideways at the widths it checks                                                | **Nothing today.** Its last run failed 4 of 5 because the API answered 404 (run 37415458012, 2026-10-06). Also no Firefox or Safari, no accessibility scan |
| Front interviews, `docs/research/usability-pilot.md`                    | Whether two people new to the app, P1 and P2, neither of them a developer, find the persona and the problem statement in their own last hand-off of work, and whether the board looks right to them for it                      | Any pattern: two people, friends of the moderator, not the target users. Ran on 2026-10-07                                                                 |

## F1: one row per acceptance criterion

The criteria are in [product](../product.md#the-core-flow-create-a-task). All four run in CI
against the mock.

| Criterion                                                                                                 | Test                                                                                                                                                                                                                        | What it does not prove                                                  |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1. The form's field is labelled "Effort", with the help line as its description                           | `create-task.test.tsx`: 'labels the effort field "Effort" and explains it in one line'                                                                                                                                      | That the line shows or is readable: jsdom loads no CSS                  |
| 2. The card and the row read "Effort 4"                                                                   | `board-page.test.tsx`: 'shows %s as "%s" on its card and on its list row', for Slack and "Effort 4", over the mock. Also `board-column.test.tsx`: 'reads the effort as "Effort 4" (%s view)', in the grid and the list view | That it fits: measured in Chromium through Playwright at 1440 and 375px |
| 3. Filtering by "Effort 8" keeps only the tasks with effort 8                                             | `search-filter.test.tsx`: "sends a chosen effort to the API and keeps only the tasks with that effort (%s)", run at "Effort 8" and "Effort 0"                                                                               | That RAVN's API filters the same way: the mock does the filtering       |
| 4. Unhappy: no task has effort 8, so the board says nothing matches and the filter still reads "Effort 8" | `search-filter.test.tsx`: "says nothing matches an effort no task has, and still shows the effort picked"                                                                                                                   | The same: the mock decides what matches                                 |

**Scenarios by type.**

- **Positive.** Criteria 1 to 3. The edit dialog has the same label and line
  (`update-delete-task.test.tsx`: 'labels the effort field "Effort" and explains it, as the create
  dialog does'). A picked effort still sends the API value ("offers efforts 0 to 8 and still sends
  the API value of the one picked"). The filter's effort goes into the URL and back ("writes a
  chosen effort into the address with the API value", "reads an effort from the address and shows
  it on the filter"). The list view heads the column "Effort" (`board-column.test.tsx`: 'heads
  the effort column "Effort", the name the field has everywhere else').
- **Negative.** Criterion 4. A wrong effort in the address is dropped, so the whole board shows
  and the filter reads "Any effort" (`search-filter.test.tsx`: 'drops an effort that is not one of
  the five, and shows "Any effort"').
- **Boundary, 0 and 8.** They are the two ends of the option list in the form and the filter
  ("offers efforts 0 to 8 and still sends the API value of the one picked", 'offers "Any effort"
  and then efforts 0 to 8, in order'), and the formatter writes both (`task-display.test.ts`:
  'writes every effort value as "Effort N", 0 and 1 included'). Criterion 3's test filters at 8
  and at 0, and criterion 4 filters at 8. A card and a list row read "Effort 0" over the mock
  (`board-page.test.tsx`: 'shows %s as "%s" on its card and on its list row', for Netflix
  redesign), and the card's formatter turns 8 into "Effort 8" (`to-kit-props.test.ts`: 'passes the
  effort as a number, with a formatter that turns it into "Effort 8"').

## Not tested anywhere

- The app's composed pages under axe (risk R5 in [the register](risk-register.md)).
- `schema.graphql` against the live schema, until the API returns (R3).
- Browsers other than Chromium in a real engine.
- The kit's next release; app#157 lists what it will break.
