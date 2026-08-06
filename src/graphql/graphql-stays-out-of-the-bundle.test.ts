/**
 * The property #35 exists for, asserted directly.
 *
 * `documentMode: 'string'` made the generated documents their own operation
 * text, which is what let `graphql` leave `dependencies` — the package's barrel
 * is tree-shake-hostile, and Rolldown pulled its language layer into the entry
 * chunk for the sake of one `print()` call.
 *
 * Nothing stated that as a rule, though. Re-adding
 *
 *     import { parse, print } from 'graphql'
 *     body: JSON.stringify({ query: print(parse(String(document))), variables })
 *
 * to `client.ts` leaves the entire gate green: types pass, lint passes, and the
 * test pinning the wire format still passes, because `print()` renormalises
 * whitespace but produces the same operation. The only thing that catches it is
 * the first-load byte budget in `ci.yml`, by about 5.6 kB against 36.7 kB of
 * headroom — so any unrelated saving, or one decision to raise the budget,
 * silently removes the guard.
 *
 * A byte count is the wrong instrument for an architectural rule anyway: it
 * says "this got bigger", not "this must not ship". So say the rule.
 *
 * `graphql` being a devDependency does not enforce this by itself — a `src/`
 * import still resolves during a dev install and still bundles. `scripts/` is
 * deliberately outside the rule: `check-schema.mjs` runs on a developer's
 * machine against the live API and never reaches a browser, which is exactly
 * why the package is still a devDependency rather than gone.
 */

/** Matches the package and any subpath of it, but not `graphql-request`. */
const GRAPHQL_IMPORT = /(?:from\s*|require\(\s*|import\(\s*)['"]graphql(?:\/[^'"]*)?['"]/g

/**
 * Read through Vite rather than `node:fs`: this project's root tsconfig is the
 * DOM one and does not carry node types, and `import.meta.glob` is resolved by
 * the same bundler that decides what actually ships — so the file list this
 * walks is the file list Rolldown sees.
 */
const sources = import.meta.glob('/src/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

describe('graphql stays out of what ships', () => {
  it('is imported by no file under src/', () => {
    const offenders = Object.entries(sources)
      // This file names the import in its own comment, and matching itself
      // would make the rule unfixable rather than merely enforced.
      .filter(([path]) => !path.endsWith('graphql-stays-out-of-the-bundle.test.ts'))
      .flatMap(([path, text]) =>
        (text.match(GRAPHQL_IMPORT) ?? []).map((match) => `${path} — ${match}`),
      )

    expect(offenders).toEqual([])
  })

  it('would notice an import if one were added', () => {
    // The rule is a regex over source text, so what is worth pinning is that
    // the regex still matches the shapes it claims to. A rule that quietly
    // stopped matching would look exactly like a rule being obeyed.
    for (const line of [
      "import { print } from 'graphql'",
      'import { parse } from "graphql"',
      "export { print } from 'graphql'",
      "const { print } = require('graphql')",
      "await import('graphql')",
      "import { printer } from 'graphql/language/printer'",
    ]) {
      expect(line.match(GRAPHQL_IMPORT), line).not.toBeNull()
    }

    for (const line of [
      "import { request } from './graphql/client'",
      "import { Task } from '@/graphql/generated/graphql'",
      "import { gql } from 'graphql-request'",
      "import { useQuery } from '@tanstack/react-query'",
    ]) {
      expect(line.match(GRAPHQL_IMPORT), line).toBeNull()
    }
  })
})
