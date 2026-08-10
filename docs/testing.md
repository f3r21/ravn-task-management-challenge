# Testing

`npm run gate` is the bar: typecheck, lint, format check and coverage against an 85%
threshold on every metric. CI runs the same thing, then a production build, the Tailwind
`@source` canary (`npm run css:canary`), a bundle-size budget and
`npm audit --audit-level=high`, on every pull request.

No count is quoted here on purpose — this line has said 287, 316, 321, 358 and 370 at various
points, each true when written and stale within a day. `npm test` prints the live figure. What
the suite covers is the part that does not go stale: every feature through the surface a user
touches — the board's loading, error and empty states as three distinct things; create, edit
and delete including cache invalidation and the failure notification on each; every filter and
its round trip through the URL; the profile page; date formatting across time zones; the
mock/direct/proxied backend matrix in `src/lib/env.ts`; and the `@ravn/ui-kit` seam that
neither repository's CI can see on its own.

One of them is not a feature test at all. `board-render-cost.test.tsx` mounts a full board
through the real route table and asserts that a keystroke in the search box re-renders **no**
cards — so the board's memoisation is held by the suite rather than by a profiler someone
remembers to open. It counts card avatars separately from the header's on purpose: a single
combined total would also be satisfied by the header alone, and would go green on a board that
had stopped rendering cards entirely. It also pins the count at mount before measuring the
keystroke, which is the other half of the same guard — if the instrument ever stops seeing the
cards, that assertion fails rather than the measurement quietly reporting zero of nothing.

Dependencies get a second look on the way in. A separate `Dependency review` workflow fails
a pull request that introduces a package carrying a high-severity advisory in GitHub's
database — a different feed from npm's, read against the diff rather than the installed
tree, so it names the dependency this change added. That matters here because Dependabot
opens _grouped_ bumps, and a group is exactly where one bad package rides in behind fourteen
harmless ones. The two checks share a severity threshold on purpose: two gates disagreeing
about what counts as a problem is how a pipeline stops being read.

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

**One end-to-end spec, against a deployment.** `e2e/deployed-proxy.spec.ts` creates a task,
filters the board to it, edits it and deletes it, in a real browser, against a real Vercel
URL. It is the only test in the repository that touches `api/graphql.ts` as it actually
runs: nothing imports that file — the app posts to a URL — so no amount of unit testing
reaches it. It has already failed in a way only this could catch, exported as a default
handler that Vercel read as `(req, res) => void`, discarding the `Response` and hanging
every request while the types, the unit test and the local build all stayed green.

`E2E_BASE_URL` is required and has no default, localhost least of all: a fallback to
`npm run dev` would make this a slow, flaky duplicate of the suite above, passing while
proving nothing about a deployment. The last assertion checks that the run actually went
through `/api/graphql`, which is what makes a local run fail on purpose — pointing it at a
dev server is useful only for proving the selectors still match after a UI change.

It is one spec, not a suite, and that is a decision rather than a stopping point. Every
additional flow would re-test components jsdom already covers, at a hundred times the cost,
and would write to a board RAVN can see — so the spec removes what it created even when it
fails partway through.

`.github/workflows/e2e.yml` runs it on every successful deployment, and can be dispatched by
hand against any URL. The automatic half only fires once the workflow file is on `main`,
because that is GitHub's rule for `deployment_status` events; the manual half is what makes
it usable before then.

The traffic goes both ways, which is the more useful lesson. jsdom does not reflect the
`inert` property to an attribute and does not evaluate media queries, so it will call a
hidden notification reachable and show two navigation landmarks where a browser shows one.
A browser, in turn, will report focus dropped on `<body>` if the interaction is driven with
`element.click()` instead of real input, because that is not the press sequence React Aria
listens for. Anything about focus or the accessibility tree is checked in both.

Neither of those can see an _old_ browser, and a defect went out through the gap: a
`URL.canParse` call — Chrome 120, above the floor — passed the whole suite, because jsdom
runs on Node where that method exists, and passed the end-to-end spec, because that drives
current Chromium. It threw on every browser this app claims to support, and the error
boundary turned the board into the error screen. `npm run lint` now reads the declared
`browserslist` and fails on API usage the floor does not have, which is the one check in
`gate` that neither runtime could stand in for. It works from syntax, so what it cannot see
is anything reached through a value rather than through a name.
