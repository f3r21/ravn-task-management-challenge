import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { configDefaults, coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
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
          // `@ravn/ui-kit` resolves into `node_modules` via a `file:` dependency
          // but changes as often as the app does, so bundling it as "vendor"
          // would defeat the caching this is for. It stays in the app chunk.
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
    // Raised from Rollup's 500 kB default to just above where the entry chunk
    // actually lands, so the warning means "something grew" instead of firing on
    // every single build and being ignored. Lower it when the number drops.
    //
    // Deliberately does NOT cover `mocks/browser` (~426 kB of MSW runtime) — see
    // the comment in `src/main.tsx` for why that chunk is shipped on purpose. It
    // is excluded from the CI size budget by name for the same reason.
    chunkSizeWarningLimit: 450,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // `@ravn/ui-kit` is a `file:` dependency pointing at a sibling checkout with its
    // own `node_modules` — Node resolves `react`/`react-dom` from *that* copy before
    // walking up to this project's, so any hook a kit component calls throws
    // "Invalid hook call" (two React instances, two dispatchers). `dedupe` forces
    // both import graphs onto this project's single copy of each.
    //
    // `react-aria`/`react-stately` need an entry here too, now that `@ravn/ui-kit`'s
    // build imports them as bare specifiers instead of bundling their source (see
    // `UI_KIT_MIGRATION_PLAN.md`'s Phase 1 retry writeup). The kit's own
    // `package.json` lists both as peerDependencies *and* devDependencies — the
    // devDependency copy is not a mistake to chase upstream, it's what the kit's own
    // Storybook/vitest run against — so `node_modules/@ravn/ui-kit/node_modules/react-aria`
    // genuinely exists and is a second, physically distinct installed copy at the
    // same version as this project's own. Same shape of problem as `react`/`react-dom`
    // above, one layer removed: a duplicate *installed* copy rather than duplicated
    // bundled source. Without this entry, React Aria's `FocusScope` context
    // (module-scoped) exists twice, and a `FocusScope` rendered by one of this app's
    // own components (e.g. `Select`'s popover) can never be recognised as nested
    // inside a `FocusScope` the kit's `Modal` renders.
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
    exclude: [...configDefaults.exclude, '.worktrees/**'],
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
