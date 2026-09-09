---
name: testing
description: The provider harness, coverage config that replaces rather than merges, the single e2e spec, and the jsdom traps.
paths:
  - '**/*.test.ts'
  - '**/*.test.tsx'
  - 'vitest.setup.ts'
  - 'vite.config.ts'
  - 'e2e/**'
---

# Test harness

Every test renders through `src/test/test-utils.tsx` (`renderWithProviders` / `renderApp`), each
call building a fresh `QueryClient` so one test's fetched board cannot satisfy the next test's
query and hide a missing handler. `vitest.setup.ts` runs MSW with `onUnhandledRequest: 'error'`,
so a missing handler is a loud failure rather than a silent fall through to the real network, and
resets `taskStore` after each test, because the store is stateful on purpose.

Coverage config in `vite.config.ts`: `exclude` **replaces** the defaults rather than merging, so
the `...coverageConfigDefaults.exclude` spread is what keeps colocated `*.test.tsx` files from
counting as source and inflating every metric. `mocks/` and `generated/` are excluded from the
metric, but `task-store.test.ts` still pins the fake's filter semantics directly, because the
filter tests trust it to narrow correctly.

Running less than everything:

```bash
npx vitest run src/lib/due-date.test.ts    # one file
npx vitest run -t 'unassign'               # tests whose name matches
npx vitest src/features/board              # watch a directory
npx vitest run --coverage src/lib          # thresholds still apply, so this fails
```

# The e2e spec

`e2e/` is Playwright's, `src/` is Vitest's, and the boundary is enforced in three places because
nothing else keeps two test runners out of each other's files:

- **`vite.config.ts` excludes `e2e/**`.** Vitest's default `include` matches `*.spec.ts` at any
  depth, so without it `npm test` collects the Playwright file and fails the whole run with
  "Playwright Test did not expect test() to be called here", a message listing four causes, none
  of them "a second runner picked this up".
- **`e2e/tsconfig.json` is a third project**, alongside the root one and `api/`, for the same
  reason `api/` has its own: this code runs in Node and must not see the DOM lib. `typecheck`
  builds all three.
- **`e2e/playwright.config.ts` lives beside the spec**, not at the root, so that tsconfig covers
  it and typescript-eslint's project service finds it by walking up.

One spec, `deployed-proxy.spec.ts`: create, filter, edit, delete, in a browser, against a
deployment. It is the only test that reaches `api/graphql.ts` as it actually runs, since nothing
imports that file. It writes to RAVN's live board through the proxy and deletes what it created,
including from `test.afterEach` when the assertions never got that far. A leftover
`e2e smoke <token>` card means a run died mid-flight.

`E2E_BASE_URL` is required with no default and no localhost fallback, because a fallback would
turn the one test that reaches the proxy into a slow copy of the unit suite. Pointing it at
`npm run dev` is legitimate for exactly one purpose, proving the selectors still match after a UI
change, and it will still fail its last assertion.

**Adding a second spec is almost always the wrong move.** Everything else is already covered in
jsdom, faster and more precisely, and each extra flow is more live mutation.

# Traps this project has already paid for

**jsdom and the browser disagree, in both directions.** jsdom does not reflect the `inert`
property to an attribute and does not evaluate media queries, so it reports a hidden notification
as reachable and shows two navigation landmarks where a browser shows one. A browser, conversely,
reports focus dropped on `<body>` if you drive React Aria with `element.click()` instead of real
input, because that is not the press sequence it listens for. **Anything about focus or the
accessibility tree gets checked in both.**

**Use `isInaccessible` for "can assistive tech reach this".** A hand-rolled `closest('[inert]')`
does not work here, and the page behind a modal ends up `aria-hidden` rather than inert anyway.

**The `TZ` pin is a fixed offset.** `Pacific/Kiritimati` is UTC+14 with no daylight saving, so it
catches local-versus-UTC confusion loudly and cannot catch anything needing a gap hour. A
formatter that shifted by an hour in DST-gap zones shipped straight past it. Tests that care
switch zone with `vi.stubEnv('TZ', ...)`.

**No test ids.** Query by role, label and text, the things a user perceives. A test reaching for
a test id is testing the DOM, not the behaviour.
