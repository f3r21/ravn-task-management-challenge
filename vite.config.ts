import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { configDefaults, coverageConfigDefaults, defineConfig } from 'vitest/config'

/**
 * The browser floor, converted from `package.json`'s `browserslist` into the
 * esbuild target names `build.target` wants.
 *
 * **Why the floor is written down at all.** It used to be whatever Vite gave us
 * for not setting `target` — `baseline-widely-available`, which resolves to
 * chrome111/edge111/firefox114/safari16.4/ios16.4 in Vite 8.2. Nobody chose those
 * numbers and nothing could read them: they are computed inside Vite, so no linter,
 * no test and no reviewer had any view of them. `URL.canParse` (Chrome 120, Firefox
 * 115, Safari 17) shipped straight through that gap — a target lowers *syntax* and
 * never polyfills an *API*, jsdom runs on Node where the method exists, and the
 * preview and e2e both run current Chromium, so every check passed while the built
 * output threw on every browser in the floor. Writing the floor down is what gives
 * a linter something to read; `eslint.config.js` is what reads it.
 *
 * **Why these numbers.** chrome111/safari16.4 are Vite's default *and* Tailwind v4's
 * documented requirement, and the CSS Tailwind emits is not lowered to anything
 * older — so they are a real floor whatever this file says. Firefox is the one that
 * moved: Vite's default says 114, Tailwind v4 requires **128**, and the lower number
 * was a claim the stylesheet could not honour. Raising it fixes a floor that was
 * already false rather than dropping support for anything that worked — the build
 * output is byte-identical either way.
 *
 * **Why the floor was not simply raised past the bug.** Moving to chrome120/safari17
 * would make `URL.canParse` legal and this class of defect disappear by decree.
 * Nothing in this app needs Chrome 120; the guard in
 * `src/lib/decommissioned-avatar.ts` costs three lines. Giving up every browser
 * released between March and December 2023 to save three lines is not a trade, so
 * the floor stays where the toolchain actually puts it.
 *
 * **Why `package.json` is the source and this file derives.** esbuild does not read
 * browserslist and browserslist-aware tools do not read `build.target`, so the two
 * have to be stated in different vocabularies — and two hand-written copies of one
 * number drift, which is how a lint that passes against a floor the build does not
 * use gets written. One is data, the other is derived from it.
 */
const BROWSERSLIST_TO_ESBUILD_TARGET = new Map([
  ['chrome', 'chrome'],
  ['edge', 'edge'],
  ['firefox', 'firefox'],
  ['safari', 'safari'],
  // esbuild calls it `ios`; browserslist and caniuse call it `ios_saf`.
  ['ios_saf', 'ios'],
])

/**
 * Only `<browser> >= <version>` is accepted, and that is the point rather than
 * laziness. browserslist is a query language: `defaults` and `> 0.5%` resolve
 * against usage statistics that move under you on every `caniuse-lite` bump, so a
 * floor written that way is a different floor next month and the lint quietly stops
 * matching the build. Anything this cannot read is a hard failure below, not a
 * fallback — a config that silently guesses a target is the exact failure this
 * whole change exists to remove.
 */
const BROWSER_FLOOR_QUERY = /^([a-z_]+) >= (\d+(?:\.\d+)?)$/

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function readDeclaredBrowserFloor(): string[] {
  const manifestPath = fileURLToPath(new URL('./package.json', import.meta.url))
  const manifest: unknown = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const queries =
    typeof manifest === 'object' && manifest !== null && 'browserslist' in manifest
      ? manifest.browserslist
      : undefined

  if (!isStringArray(queries) || queries.length === 0) {
    throw new Error(
      'package.json has no non-empty `browserslist` array. It is the single source of the ' +
        'browser floor: this build target and `eslint-plugin-compat` both read it.',
    )
  }

  return queries.map((query) => {
    const match = BROWSER_FLOOR_QUERY.exec(query)
    if (!match) {
      throw new Error(
        `browserslist entry ${JSON.stringify(query)} is not a "<browser> >= <version>" floor, ` +
          'so it cannot be converted to an esbuild build target. Write an explicit minimum ' +
          'version rather than a usage-share query.',
      )
    }

    const [, browser, version] = match
    const target = BROWSERSLIST_TO_ESBUILD_TARGET.get(browser)
    if (target === undefined) {
      throw new Error(
        `browserslist entry ${JSON.stringify(query)} names a browser with no esbuild target. ` +
          `Add it to BROWSERSLIST_TO_ESBUILD_TARGET, or drop the entry — silently ignoring it ` +
          'would mean the build targets a wider set of browsers than the lint checks.',
      )
    }

    return `${target}${version}`
  })
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Derived, never typed out twice — see the comment on the helper above.
    target: readDeclaredBrowserFloor(),
    // `rolldownOptions`, not `rollupOptions` — Vite 8 bundles with Rolldown, whose
    // chunking API is `advancedChunks.groups` (name + test regex) rather than
    // Rollup's `manualChunks` id-to-name map. The old shape type-errors here.
    rolldownOptions: {
      output: {
        // `codeSplitting`, not `advancedChunks` — the latter is the same shape but
        // deprecated, and warns on every build.
        codeSplitting: {
          // Split the framework layer out of the app chunk. These move on a
          // dependency bump; app code moves on every commit — with both in one
          // file, a one-line change invalidates the whole thing for every
          // returning visitor.
          //
          // Named groups rather than a blanket `/node_modules/` rule on purpose:
          // `@ravn/ui-kit` is installed into `node_modules` like anything else,
          // but a blanket rule would file it under "vendor" and that defeats the
          // caching this is for. Its pin moves whenever this app needs a kit
          // change, and this app is the kit's only consumer, so in practice it
          // moves at app cadence rather than at framework cadence. It stays in
          // the app chunk.
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            {
              name: 'react-aria',
              test: /node_modules[\\/](react-aria|react-stately|@react-aria|@react-stately|@react-types|@internationalized)[\\/]/,
            },
            { name: 'query', test: /node_modules[\\/]@tanstack[\\/]/ },
          ],
        },
      },
    },
    // Kept equal to the per-file budget in `.github/workflows/ci.yml`, so a chunk
    // heavy enough to fail CI says so here first — learning it after a push costs
    // a round trip to be told what the local build already knew. Move both
    // together, downwards, as the numbers drop.
    //
    // This does NOT stay clear of `mocks/browser` and no longer pretends to: that
    // chunk is ~593 kB of MSW runtime and warns on every build. It is shipped on
    // purpose (see the comment in `src/main.tsx`), Vite has no per-chunk
    // exclusion for this warning, and a limit raised above it would stop saying
    // anything about the chunks that matter. CI's budget skips it by name
    // instead, which is where the enforcing check lives.
    chunkSizeWarningLimit: 250,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // Guards the *other* way `@ravn/ui-kit` gets consumed. As committed the
    // dependency is a git tag — `grep ui-kit package.json` for which one, never a
    // version written here, which is not a style rule: this comment claimed
    // `v0.4.0` was the installed tag long after it was not, and every release since
    // is one `git ls-remote --tags https://github.com/f3r21/ravn-ui-kit` would have
    // shown. Against a tag, however it is spelled, this list is a no-op:
    // npm packs only what the kit's `files: ["dist"]` names and installs only its
    // `dependencies`, never its devDependencies, so `node_modules/@ravn/ui-kit`
    // has no `node_modules` of its own. Every bare specifier the kit's build emits
    // resolves up to this project's single install — verified, not assumed: there
    // is exactly one copy of each of the four below on disk.
    //
    // (The kit's *published* `package.json` does list `react-aria` and
    // `react-stately` under devDependencies as well as peerDependencies, and a git
    // install ships that manifest whole rather than a trimmed one. It changes
    // nothing here: npm does not install a dependency's devDependencies.)
    //
    // Working on the kit means switching to `file:../ravn-ui-kit`, and the sibling
    // checkout *does* have its own `node_modules`, populated from exactly those
    // devDependencies. Then:
    //
    // - Node resolves `react`/`react-dom` from that copy before walking up to this
    //   project's, so any hook a kit component calls throws "Invalid hook call" —
    //   two React instances, two dispatchers.
    // - `react-aria`/`react-stately` need entries for the same reason, one layer
    //   removed. The kit's build imports them as bare specifiers rather than
    //   bundling their source, and the devDependency copy is not a mistake to chase
    //   upstream — it is what the kit's own Storybook and vitest run against. So a
    //   second, physically distinct install exists at the same version, React Aria's
    //   module-scoped `FocusScope` context exists twice, and a `FocusScope` rendered
    //   by one of this app's own components (e.g. `Select`'s popover) can never be
    //   recognised as nested inside one the kit's `Modal` renders.
    //
    // Kept rather than deleted because that switch is a one-line `package.json` edit
    // a kit author makes routinely, and the failure it prevents reads as a bug in the
    // component rather than in how it was installed.
    dedupe: ['react', 'react-dom', 'react-aria', 'react-stately'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    // Vitest's default excludes cover `node_modules`/`dist` but not a git worktree
    // checked out inside the repo. One lived at `.worktrees/` and was collected on
    // every run — and because the `@` alias below resolves to *this* `src/`, those
    // tests loaded the worktree's modules and the root's into one graph: two
    // `TaskCard`s, two `src/ui` trees, ~20 failures that belonged to neither
    // checkout. `.git/info/exclude` hides the directory from git but not from a
    // test runner, so it has to be named here.
    //
    // `e2e/**` is here for a different reason. Vitest's default `include`
    // matches `*.spec.ts` at any depth, so it collects the Playwright spec and
    // fails the whole run at import with Playwright's own "Playwright Test did
    // not expect test() to be called here" — a message that lists four causes,
    // none of them "a second test runner picked up my file". Playwright reads
    // `e2e/playwright.config.ts` and owns that directory; Vitest owns `src/`.
    exclude: [...configDefaults.exclude, '.worktrees/**', 'e2e/**'],
    env: {
      // The suite runs 14 hours ahead of UTC on purpose. Due dates arrive from the
      // API as midnight-UTC instants and are read as calendar dates, so any code
      // that reaches for a local calendar field shifts them by a day — and in a UTC
      // test run that bug is invisible. Kiritimati is the largest offset there is,
      // so the shift is as loud as it can be.
      //
      // Necessary, not sufficient: this is a *fixed* offset with no daylight
      // saving, so it has no gap hour and cannot catch a bug that needs one. A
      // formatter that shifted by an hour in DST-gap zones shipped past this pin.
      // Those cases switch zone deliberately — see `src/lib/due-date.test.ts`.
      TZ: 'Pacific/Kiritimati',

      // The suite always runs on the mock backend, and that has to be pinned here
      // rather than assumed. Vitest loads `.env` through Vite like any other
      // build, and `.env` is gitignored and per-developer — so on a machine with
      // real credentials filled in, `readApiConfig` returned a live config and two
      // tests broke in ways that looked unrelated: the mock banner stopped
      // rendering (`board-page.test.tsx`), and `client.test.ts`'s transport-level
      // `http.post(MOCK_API_URL, …)` override stopped matching, because the client
      // was posting somewhere else and the operation-name GraphQL handler answered
      // instead. Both were dismissed as "pre-existing failures" for several
      // sessions. CI never saw them because CI has no `.env`.
      //
      // Empty, not absent: `readApiConfig` treats whitespace-only as missing on
      // purpose, and an empty string is what a half-filled `.env` actually looks
      // like — so this pins the exact state the tests claim to run in.
      VITE_API_URL: '',
      VITE_API_TOKEN: '',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      // Without this a failing run prints no report at all, which makes
      // "which file dropped?" needlessly hard to answer in CI.
      reportOnFailure: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        // `exclude` REPLACES the defaults rather than merging with them. Drop
        // this spread and colocated `*.test.tsx` files start counting as
        // source, inflating every metric toward ~99% and turning the gate
        // below into a rubber stamp.
        ...coverageConfigDefaults.exclude,
        // Coverage reports every file matched by `include`, even ones no test
        // imports. These have no branches worth asserting and would only drag
        // the global bucket down.
        'src/main.tsx',
        'src/vite-env.d.ts',
        // Bootstrap only: composes providers around a router. The route table
        // it renders lives in `app/routes.tsx`, which *is* covered — tests
        // mount it through a memory router and navigate for real.
        'src/app/app.tsx',
        // The default excludes only match a root-level `test-utils`, not a
        // nested one, so this has to be listed explicitly.
        'src/test/**',
        // Generated by graphql-codegen from `schema.graphql`. Asserting on
        // generated output tests the generator, not this project.
        'src/graphql/generated/**',
        // The MSW test double. Coverage is meant to say how well the *app* is
        // tested; counting the fake API moves that number according to the
        // fake's own complexity, which is not a signal about the app at all.
        //
        // Excluded from the metric, not from testing: `task-store.test.ts`
        // pins its filter semantics directly, because the filter tests in
        // `search-filter.test.tsx` trust the store to narrow correctly — and a
        // wrong fake would let those tests pass against the wrong answer.
        'src/mocks/**',
      ],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
})
