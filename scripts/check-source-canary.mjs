/**
 * Fails when Tailwind's `@source` scan of `@ravn/ui-kit`'s `dist/` has stopped
 * generating the kit's utility classes.
 *
 * The app compiles every utility class it ships, including the ones baked into
 * the kit's compiled components as class-name string literals. Tailwind
 * excludes `node_modules` from automatic scanning, so `src/styles/base.css`
 * names that directory with `@source`. If that line breaks — a moved path, a
 * renamed package, a change in how `@source` resolves — those utilities stop
 * being generated and kit components render unstyled **with no build error and
 * no test failure**. Nothing else here can see it: `gate` runs in jsdom, which
 * never evaluates a stylesheet, and `ui-kit-smoke.test.tsx` pins the module
 * graph rather than the CSS. So this runs after `npm run build`.
 *
 * ## Why there is no list of sentinel classes
 *
 * The obvious version of this check greps the built CSS for a couple of
 * hand-picked classes. That version was tried, and it could not fail.
 *
 * Tailwind scans the whole project, not just `src/` — every non-ignored file,
 * including Markdown. So the moment a class name is written down anywhere in the
 * repository, Tailwind generates it from *that* occurrence, whether or not the
 * `@source` scan works. Documenting the canary is what made the canary pass:
 * naming two classes in `CLAUDE.md` as the ones to grep for was sufficient to
 * keep both in the output with `@source` deleted outright. A hardcoded list here
 * would do the same thing, because this file is scanned too.
 *
 * Measured, on this repository: with `@source` removed the stylesheet drops from
 * ~40 kB to ~22 kB — so the scan is doing real work — yet both classes the old
 * hand-run canary grepped for were still present, generated from the sentences
 * that documented them. Removing those sentences is part of the same change.
 *
 * So the candidates are computed instead, and never written down:
 *
 *   1. take the class selectors Tailwind actually emitted into the built CSS;
 *   2. keep those that appear somewhere in the kit's `dist/`;
 *   3. drop any that appear in a tracked file of this repository.
 *
 * What survives has no route into the CSS other than the `@source` scan of the
 * kit, so breaking that scan collapses the count rather than nudging it.
 * Measured here: **190 healthy, 8 with `@source` deleted.** The residue is not
 * zero because step 2 is a substring test against the kit's whole bundle, so a
 * few very short class names match text that is not a class at all. That is
 * fine — the two populations are an order of magnitude apart, which is all the
 * threshold below needs.
 *
 * **Do not "improve" this by naming an example class in a comment.** Any class
 * named in a tracked file leaves the candidate set permanently.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const KIT_DIST = 'node_modules/@ravn/ui-kit/dist'
const BUILT_CSS_DIR = 'dist/assets'

/**
 * How many kit-only classes must survive. Measured: 190 on a healthy build, 8
 * with `@source` deleted. This sits between the two with room on both sides —
 * high enough that the coincidental-match residue cannot satisfy it, low enough
 * that ordinary drift in the kit never trips it. Re-measure both numbers before
 * moving it; raising it to accommodate a drop is how a check stops testing.
 */
const MINIMUM = 25

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

const readAll = (paths) =>
  paths
    .map((p) => {
      try {
        return readFileSync(p, 'utf8')
      } catch {
        return '' // unreadable or binary — cannot contain a class name we care about
      }
    })
    .join('\n')

let cssFiles
try {
  cssFiles = readdirSync(BUILT_CSS_DIR).filter((f) => f.endsWith('.css'))
} catch {
  cssFiles = []
}
if (cssFiles.length === 0) {
  console.error(
    `::error::No CSS found in ${BUILT_CSS_DIR}. This check reads a production build — run \`npm run build\` first.`,
  )
  process.exit(1)
}
const builtCss = readAll(cssFiles.map((f) => join(BUILT_CSS_DIR, f)))

let kitSource
try {
  kitSource = readAll(walk(KIT_DIST))
} catch (error) {
  console.error(
    `::error::Could not read ${KIT_DIST} — is @ravn/ui-kit installed? (${error.message})`,
  )
  process.exit(1)
}

// The tracked files are what Tailwind scans besides the kit. Deriving the list
// from git rather than a hardcoded set of directories means a new top-level file
// cannot quietly become an unaccounted-for source of class names.
const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
const trackedSource = readAll(trackedFiles)

// Class selectors as emitted: a dot, then word characters or escaped punctuation.
// Unescaped back to the utility name, which is the form the kit's source uses.
const emitted = new Set(
  [...builtCss.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)].map((m) => m[1].replace(/\\(.)/g, '$1')),
)

const kitOnly = [...emitted].filter(
  (cls) => kitSource.includes(cls) && !trackedSource.includes(cls),
)

if (kitOnly.length < MINIMUM) {
  console.error(
    `::error::Only ${kitOnly.length} kit-only utility classes reached the built CSS (expected at least ${MINIMUM}). ` +
      `These are classes that appear in ${KIT_DIST} and in no tracked file, so the @source scan is ` +
      `their only route into the stylesheet. A count this low means Tailwind is not scanning the kit: ` +
      `check the \`@source "../../${KIT_DIST}"\` line in src/styles/base.css, and that the package is ` +
      `installed at that path. Kit components will render unstyled in production until it is fixed.`,
  )
  process.exit(1)
}

console.log(
  `@source canary: ${kitOnly.length} kit-only utility classes reached ${cssFiles.join(', ')} ` +
    `(minimum ${MINIMUM}).`,
)
