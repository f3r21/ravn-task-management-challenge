import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import js from '@eslint/js'
import compat from 'eslint-plugin-compat'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const require = createRequire(import.meta.url)

// Browserslist's names for the browsers in the floor, mapped to MDN's. Kept
// beside the identical map in `vite.config.ts` rather than shared through a
// module: that file is TypeScript inside a type-checked lint, this one is Node
// ESM, and the import between them costs more than eight lines of data. What must
// not be duplicated is the floor itself, and it is not — both read it from
// `package.json`.
const BROWSERSLIST_TO_BCD = {
  chrome: 'chrome',
  edge: 'edge',
  firefox: 'firefox',
  safari: 'safari',
  ios_saf: 'safari_ios',
}

// Same shape `vite.config.ts` insists on, for the same reason: a usage-share
// query resolves against `caniuse-lite` data that moves on every bump, so the
// lint and the build would drift apart silently. See the long comment there.
const BROWSER_FLOOR_QUERY = /^([a-z_]+) >= (\d+(?:\.\d+)?)$/

/** The oldest version of each browser this app claims to support, keyed by MDN's name. */
function readBrowserFloor() {
  const manifest = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
  const queries = manifest.browserslist

  if (!Array.isArray(queries) || queries.length === 0) {
    throw new Error('package.json has no non-empty `browserslist` array to lint against.')
  }

  const floor = new Map()
  for (const query of queries) {
    const match = BROWSER_FLOOR_QUERY.exec(String(query))
    if (!match) {
      throw new Error(
        `browserslist entry ${JSON.stringify(query)} is not a "<browser> >= <version>" floor.`,
      )
    }
    const bcdName = BROWSERSLIST_TO_BCD[match[1]]
    if (bcdName === undefined) {
      throw new Error(
        `browserslist entry ${JSON.stringify(query)} names a browser with no MDN compat data. ` +
          'Add it to BROWSERSLIST_TO_BCD, or drop the entry — an unmapped browser is one this ' +
          'lint would silently stop checking.',
      )
    }
    floor.set(bcdName, Number.parseFloat(match[2]))
  }
  return floor
}

/**
 * Whether one MDN support record covers a browser at `floorVersion`.
 *
 * Flagged, prefixed and renamed implementations deliberately do not count: they
 * are not the API as written. `version_added: true` does ("supported, version
 * unknown") — treating it as unsupported would restrict a long tail of APIs that
 * have been in every browser since before MDN started counting.
 *
 * A *partial* implementation counts as support, and every statement is considered
 * rather than only the first. The question this rule answers is "does calling this
 * throw", not "is it perfect": `AbortSignal.timeout` is the worked example — MDN
 * carries two Chrome statements, a correct one from 124 and a partial one from 103
 * that it replaced. Reading only the first makes it unsupported at chrome 111 and
 * fires on a call that works there, aborting with the wrong error name at worst.
 */
function isSupportedAtFloor(support, floorVersion) {
  const statements = support === undefined ? [] : Array.isArray(support) ? support : [support]

  return statements.some((statement) => {
    if (statement.flags !== undefined) return false
    if (statement.prefix !== undefined || statement.alternative_name !== undefined) return false

    const added = statement.version_added
    if (added === true) return true
    if (typeof added !== 'string') return false

    // `≤37` means "no later than 37" — the exact version is unknown, so the
    // stated number is the pessimistic reading and the right one to compare.
    const addedVersion = Number.parseFloat(added.replace(/^≤/, ''))
    if (Number.isNaN(addedVersion) || addedVersion > floorVersion) return false

    const removed = statement.version_removed
    if (removed === undefined || removed === false) return true
    const removedVersion = Number.parseFloat(String(removed))
    return !Number.isNaN(removedVersion) && removedVersion > floorVersion
  })
}

/**
 * `no-restricted-properties` entries for every **static** member of a Web API
 * interface that the declared floor does not have.
 *
 * This exists because `eslint-plugin-compat` does not cover them, which was worth
 * checking rather than assuming — the plugin is the obvious tool for this job and
 * it does have teeth (it flags `new URLPattern()` and `navigator.scheduling` at
 * this floor), but its API inventory comes from `ast-metadata-inferer`, and that
 * package's data has no entry for `URL.canParse`, `URL.parse`,
 * `URL.createObjectURL` or `Notification.requestPermission`. `URL.canParse` is the
 * call that caused the outage this check is a response to, so adopting the plugin
 * alone would have been adopting a check that cannot fail on the one case it was
 * added for.
 *
 * Statics are the one category that can be matched from syntax with no guessing:
 * `URL.canParse(x)` names its interface in the source. Instance members cannot —
 * `value.canParse(x)` needs types to know what `value` is, which is why MDN's
 * `Element.checkVisibility` only ever matches source that literally writes
 * `Element.checkVisibility`. So this covers statics exactly and claims nothing
 * about the rest.
 *
 * A handful of statics are in both inventories and will report twice. That costs a
 * duplicate message; de-duplicating would mean depending on the plugin's private
 * data package to subtract from this one.
 */
function unsupportedStaticMembers(floor) {
  const bcd = require('@mdn/browser-compat-data')
  const restricted = []

  for (const [interfaceName, members] of Object.entries(bcd.api)) {
    // Capitalised only. Keys under `bcd.api` that start with a small letter are
    // global instances (`console`, `navigator`, `window`), and restricting a
    // property of one of those by name would fire on every same-named property of
    // anything else.
    if (!/^[A-Z]/.test(interfaceName)) continue

    for (const [memberName, member] of Object.entries(members)) {
      if (!memberName.endsWith('_static')) continue
      const support = member?.__compat?.support
      if (support === undefined) continue

      for (const [bcdName, floorVersion] of floor) {
        if (isSupportedAtFloor(support[bcdName], floorVersion)) continue

        const property = memberName.slice(0, -'_static'.length)
        restricted.push({
          object: interfaceName,
          property,
          message:
            `${interfaceName}.${property} is not supported by ${bcdName} ${floorVersion}, the ` +
            "floor declared in package.json's browserslist. A build target lowers syntax and " +
            'never polyfills an API, so this ships as written and throws. Guard it, use a ' +
            'supported alternative, or move the floor deliberately.',
        })
        break
      }
    }
  }

  // The zero guard, same idea as the bundle budget's in `ci.yml`. This whole list
  // is derived from MDN's `_static` key suffix; if that convention ever changes the
  // set silently empties and the rule goes on passing forever while checking
  // nothing. An empty set is a broken reader, not a clean bill of health.
  if (restricted.length === 0) {
    throw new Error(
      'Found no unsupported static Web API members at the declared browser floor. That is not ' +
        'plausible — @mdn/browser-compat-data has changed shape and this reader needs updating.',
    )
  }

  return restricted
}

/**
 * The generated re-export barrel, banned as an import target.
 *
 * `src/graphql/generated/index.ts` is a one-line `export * from "./gql"` that
 * nothing imports, and it contradicts the no-barrels convention — but deleting it
 * is futile. It is codegen output, the `client` preset offers no way to suppress
 * it, and the next `npm run codegen` writes it straight back, leaving every run
 * after that with a dirty diff. Banning the *import* enforces the same intent and
 * survives regeneration, which deletion does not.
 *
 * `paths` and not `patterns`, which is the whole reason this is a named constant
 * worth a comment: a `patterns` entry is a gitignore-style glob, and in gitignore
 * a bare directory name matches everything beneath it too. Spelled as a pattern,
 * `@/graphql/generated` flagged all 13 imports of `@/graphql/generated/graphql` —
 * the correct path every consumer already uses — and would have forced the ban to
 * be deleted rather than fixed. `paths` matches the specifier exactly.
 *
 * Both spellings are listed because `@/graphql/generated/index` resolves to the
 * same module and would otherwise be an unguarded way back in.
 */
const RESTRICTED_GENERATED_BARREL = ['@/graphql/generated', '@/graphql/generated/index'].map(
  (name) => ({
    name,
    message:
      'Import @/graphql/generated/graphql directly. The generated index.ts is a re-export ' +
      'barrel codegen emits and nothing should depend on.',
  }),
)

const browserFloor = readBrowserFloor()

export default tseslint.config(
  {
    ignores: [
      'dist',
      'coverage',
      // Regenerated by `npm run codegen`; linting it would mean fixing the
      // generator's output by hand on every run.
      'src/graphql/generated',
      // Shipped verbatim by `msw init`.
      'public/mockServiceWorker.js',
      // Playwright's failure artefacts. The spec itself is linted; what a run
      // leaves behind is not source.
      'e2e/test-results',
      // A git worktree checked out inside the repo is a second, complete copy of
      // this source tree. `.git/info/exclude` hides it from git, but ESLint and
      // Prettier do not read that file — only `.gitignore` and their own ignore
      // lists — so without this both would lint another branch's code as if it
      // were this one's. See the matching entries in `.prettierignore` and
      // `vite.config.ts`.
      '.worktrees',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // `configs.flat` is the flat-config namespace; `configs['recommended-latest']`
  // at the top level is still the legacy eslintrc shape and ESLint 10 rejects it.
  reactHooks.configs.flat['recommended-latest'],
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        // The root config files are not part of the app's `tsconfig.json`
        // (see the comment there about Vite/Vitest type duplication), so the
        // project service needs them listed explicitly or typed linting
        // reports them as outside the project.
        projectService: {
          allowDefaultProject: ['eslint.config.js', 'vite.config.ts', 'scripts/*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // The challenge is graded on type discipline. `any` and `@ts-ignore` are
      // the two ways to opt out of it silently, so both are errors rather than
      // warnings — a warning in CI is a warning nobody reads.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      // `type` imports are erased at build time; marking them keeps the emitted
      // module graph honest about what is a real runtime dependency.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // The layering `CLAUDE.md` describes, made checkable.
    //
    // It was prose only, and prose does not fail a build: `features/profile` and
    // the whole of `src/mocks/` both imported `@/features/board/task-types` to
    // learn what a `User` is — a type returned by the `Users`, `Profile` *and*
    // `Tasks` queries and belonging to none of them. Deleting `features/board`
    // would have stopped the MSW handlers compiling. The types moved to
    // `@/graphql/domain`; this rule is what stops the edge coming back.
    //
    // Only the `@/`-aliased form is banned, and that is a real limit rather than a
    // claim that no other spelling exists. A feature's own modules import each
    // other relatively (`./task-types`, `../task-display`), and today no *feature*
    // escapes its own tree relatively — but files in `src/` do climb with `../../`:
    //
    //   grep -rn "from '\.\./\.\./" src    # 2 hits, both ui-kit-smoke.test.tsx
    //
    // Those two reach `package.json` and the kit's manifest, which this rule has no
    // opinion about. So `../../../features/board/task-types` would slip past, and
    // the honest statement is that the alias is the only spelling a cross-feature
    // import currently *uses*, not the only one available. Banning relative escapes
    // as well would mean a pattern per directory depth, which buys little against a
    // spelling nothing in the codebase reaches for.
    //
    // Both `@/features/*` and `@/features/*/**` are listed because these are
    // gitignore-style globs, in which `*` does not cross a `/` — the first alone
    // would match `@/features/board` and miss `@/features/board/task-types`, which
    // is every real violation.
    //
    // The generated barrel is banned alongside it — see
    // `RESTRICTED_GENERATED_BARREL` for why that half is `paths` rather than a
    // pattern, and why the file is not simply deleted.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: RESTRICTED_GENERATED_BARREL,
          patterns: [
            {
              group: ['@/features/*', '@/features/*/**'],
              message:
                'Cross-feature imports invert the layering. Shared API types live in ' +
                '@/graphql/domain; shared components live in @/ui. A feature imports its own ' +
                'modules relatively.',
            },
          ],
        },
      ],
    },
  },
  {
    // `src/app/` composes features without restriction, and that is the whole job
    // of the layer: `routes.tsx` names every page and `app-layout.tsx` assembles
    // the chrome around them. The rule as first proposed in #40 would have failed
    // on the router itself. This grant is deliberately open-ended — a new route
    // imports a new feature, and having to widen a list here every time would be
    // friction with nothing behind it.
    //
    // The barrel ban is carried over rather than dropped: `'no-restricted-imports':
    // 'off'` would relax both halves at once, and nothing about composing features
    // implies needing the generated barrel.
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { paths: RESTRICTED_GENERATED_BARREL }],
    },
  },
  {
    // `src/features/navigation/` renders the same chrome — the header and sidebar
    // are mounted once by `AppLayout`, not by any feature, so it is the shell in
    // everything but its directory. But unlike `src/app/`, its right to reach into
    // other features is **not** open-ended: it rests on two specific arguments
    // about two specific modules, so it is those two modules that are exempted
    // rather than the directory.
    //
    // `useProfile` backs the header avatar and the settings page under one query
    // key, so the two cannot disagree about who is signed in. `useBoardFilters` is
    // load-bearing rather than an oversight: the `name` URL parameter used to have
    // two independent writers — the header building its own `URLSearchParams` and
    // the hook with its own serialiser — so renaming the key on either side broke
    // the header's search box with no type error and no failing test. #34
    // collapsed both onto `FILTER_PARAMS` and made the header write through
    // `setFilter`, so banning that import and re-exporting the hook from a shared
    // module would satisfy this rule and restore the defect.
    //
    // Neither argument generalises to a third edge, and the first spelling of this
    // override — `'no-restricted-imports'` reduced to the barrel over the whole
    // directory — would have let one land silently. The `!` entries below are
    // negations: `no-restricted-imports` patterns are gitignore-style, so a group
    // bans everything it matches except what a later `!` line takes back.
    //
    // `@/features/*` is deliberately absent from this group, and removing it is
    // what made the negations work at all. Gitignore semantics say a file cannot be
    // re-included once its *parent directory* is excluded, and `@/features/*`
    // excludes `@/features/board` as a directory — so with it present both `!` lines
    // were dead and the two arguments above were being reported as violations.
    // Nothing is lost by dropping it: `@/features/board` on its own is a
    // directory-index import, and this project has no barrel files for it to reach.
    // The broader rule above keeps both patterns because it has no negations to
    // defeat.
    files: ['src/features/navigation/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: RESTRICTED_GENERATED_BARREL,
          patterns: [
            {
              group: [
                '@/features/*/**',
                '!@/features/board/use-board-filters',
                '!@/features/profile/use-profile',
              ],
              message:
                'The shell may reach into a feature only where that edge is argued for in ' +
                'eslint.config.js — today `useBoardFilters` and `useProfile`. Add the argument ' +
                'and the exemption together, or route the dependency through @/graphql/domain ' +
                'or @/ui.',
            },
          ],
        },
      ],
    },
  },
  {
    // Test files legitimately await non-promises via matchers and pass loosely
    // typed fixtures around; the type-checked rules that guard production code
    // produce noise here without catching real defects.
    files: ['**/*.test.{ts,tsx}', 'src/test/**', 'src/mocks/**'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  {
    // The only check in `gate` that can see the browser floor.
    //
    // `compat/compat` resolves `package.json`'s `browserslist` — the same list
    // `vite.config.ts` converts into `build.target`, so the lint and the build
    // cannot be checking different browsers — and reports any Web API whose MDN
    // support data starts later than the oldest browser in it.
    //
    // It is here because nothing else in this repository has that view.
    // `typecheck` types against `lib.dom.d.ts`, which describes the *newest*
    // browser rather than the oldest. `coverage` runs in jsdom, which inherits
    // Node's globals — `URL.canParse` is a function there on Node 22, so the
    // suite cannot fail on it however many tests are written. `build` lowers
    // syntax and never polyfills an API. That gap shipped a `TypeError` on every
    // browser this app claims to support while all four stayed green.
    //
    // Scoped to what is actually bundled into `dist/`. `api/` is a Vercel
    // function, `scripts/` and the root config files are Node, and none of them
    // are subject to a browser floor. Tests and `src/test/` are excluded for the
    // same reason and not as a convenience: they run in jsdom on Node and reach no
    // browser, so a report against them answers a question nobody asked. It is not
    // hypothetical either — `decommissioned-avatar.test.ts` *deliberately* shadows
    // `URL.canParse` to simulate a browser that lacks it, and asserts
    // `typeof URL.canParse` afterwards to prove it restored the global. Linting
    // that file would demand deleting the one regression test for the defect this
    // whole check exists to prevent.
    //
    // `src/mocks/` stays in scope: MSW's runtime is deliberately shipped so the app
    // runs unconfigured (see `src/main.tsx`, and the `browser-*.js` exclusion in
    // `ci.yml`'s bundle budget), so it is subject to the floor like any other
    // shipped code.
    //
    // `error`, not the plugin's recommended `warn`: `eslint .` exits 0 on
    // warnings, so a warning here is a check that cannot fail.
    //
    // `no-restricted-properties` is the second half, generated above, and it is
    // there because the plugin alone could not fail on the call that prompted all
    // of this. The two are complementary rather than redundant — see the comment
    // on `unsupportedStaticMembers`.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    plugins: { compat },
    rules: {
      'compat/compat': 'error',
      'no-restricted-properties': ['error', ...unsupportedStaticMembers(browserFloor)],
    },
  },
  {
    // Config files and standalone scripts. These run in Node, not the browser,
    // and type-aware rules have nothing useful to say about them: several ESLint
    // plugins ship no type declarations, so every value read off one is an error
    // type and the unsafe-* rules fire on the act of composing a config. The
    // rules that matter for app code still apply to app code.
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
)
