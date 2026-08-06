/**
 * Fails when Tailwind's `@source` scan of `@ravn/ui-kit`'s `dist/` has stopped
 * working.
 *
 * The app compiles every utility class it ships, including the ones baked into
 * the kit's `dist/index.js` as string literals. Tailwind excludes
 * `node_modules` from automatic scanning, so `src/styles/base.css` names that
 * directory with `@source`. If that line breaks — a moved path, a renamed
 * package, a Tailwind change in how `@source` resolves — the kit's utilities
 * stop being generated and its components render unstyled **with no build error
 * and no test failure**. Nothing else in this repository can see that: `gate`
 * runs in jsdom, which never sees a stylesheet, and `ui-kit-smoke.test.tsx`
 * pins the module graph rather than the CSS.
 *
 * So this runs after `npm run build`, over the emitted CSS.
 *
 * ## Why it checks three things per sentinel, not one
 *
 * A bare "is this class in the CSS" grep rots in two directions, and both end
 * with a green check that is measuring nothing:
 *
 *  - **The app starts using the class itself.** Then it is generated from
 *    `src/` whether or not `@source` works, and the check passes for a reason
 *    unrelated to what it tests.
 *  - **The kit stops using the class.** Then it is legitimately absent, and the
 *    check fails claiming `@source` is broken when it is not — the false alarm
 *    is worse than no check, because the next person learns to ignore it.
 *
 * Each sentinel is therefore verified to be (1) still produced by the kit,
 * (2) still unreachable from the app's own source, and only then (3) present in
 * the built CSS. The three failures have different messages because they have
 * different fixes.
 *
 * ## The escaping trap
 *
 * Tailwind escapes every non-word character when it emits a class *selector*,
 * so the utility `max-w-[120px]` appears in the CSS as `.max-w-\[120px\]`.
 * Searching for the literal spelling matches nothing on a completely healthy
 * build — indistinguishable from the failure this exists to detect. That false
 * alarm has been hit twice by hand. The selector is derived here rather than
 * written out, so it cannot be got wrong again.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const KIT_DIST = 'node_modules/@ravn/ui-kit/dist'
const APP_SRC = 'src'
const BUILT_CSS_DIR = 'dist/assets'

/**
 * Utility classes that only the kit can produce. Each must stay absent from
 * `src/` to be worth anything — the check enforces that rather than trusting
 * it. Replacing one is expected maintenance, not a workaround: pick another
 * class that appears in the kit's `dist/` and nowhere in `src/`.
 */
const SENTINELS = ['max-w-[120px]', 'tabular-nums']

/** Tailwind escapes any character outside [A-Za-z0-9_-] in an emitted selector. */
const toSelector = (cls) => '.' + cls.replace(/[^A-Za-z0-9_-]/g, (c) => `\\${c}`)

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

const readAll = (paths) => paths.map((p) => readFileSync(p, 'utf8')).join('\n')

let failed = false

const fail = (message) => {
  console.error(`::error::${message}`)
  failed = true
}

// Read the three corpora up front so a missing one is reported as itself rather
// than as a sentinel that happens to be absent from it.
let kitSource
try {
  kitSource = readAll(walk(KIT_DIST))
} catch (error) {
  console.error(
    `::error::Could not read ${KIT_DIST} — is @ravn/ui-kit installed? (${error.message})`,
  )
  process.exit(1)
}

const appSource = readAll(walk(APP_SRC))

let cssFiles
try {
  cssFiles = readdirSync(BUILT_CSS_DIR).filter((f) => f.endsWith('.css'))
} catch {
  cssFiles = []
}
if (cssFiles.length === 0) {
  console.error(
    `::error::No CSS in ${BUILT_CSS_DIR}. This check runs against a production build — run \`npm run build\` first.`,
  )
  process.exit(1)
}
const builtCss = readAll(cssFiles.map((f) => join(BUILT_CSS_DIR, f)))

for (const cls of SENTINELS) {
  const selector = toSelector(cls)

  if (!kitSource.includes(cls)) {
    fail(
      `Sentinel "${cls}" no longer appears in ${KIT_DIST}, so it cannot prove anything about the ` +
        `@source scan. This is not a Tailwind failure — the kit stopped using the class. Pick a ` +
        `replacement that appears in the kit's dist and nowhere in ${APP_SRC}/, and update ` +
        `SENTINELS in scripts/check-source-canary.mjs.`,
    )
    continue
  }

  if (appSource.includes(cls)) {
    fail(
      `Sentinel "${cls}" is now used in ${APP_SRC}/ as well, so Tailwind would generate it from ` +
        `the app's own sources whether or not the @source scan works. This check would pass for ` +
        `the wrong reason. Replace it in SENTINELS in scripts/check-source-canary.mjs with a ` +
        `class only the kit uses.`,
    )
    continue
  }

  if (!builtCss.includes(selector)) {
    fail(
      `"${cls}" is used by @ravn/ui-kit and by nothing in ${APP_SRC}/, but its selector ` +
        `(${selector}) is missing from the built CSS. Tailwind's @source scan of the kit is not ` +
        `working, so kit-only utilities are not being generated and kit components will render ` +
        `unstyled in production. Check the \`@source "../../${KIT_DIST}"\` line in ` +
        `src/styles/base.css, and that the package is installed at that path.`,
    )
    continue
  }

  console.log(`ok  ${cls}  ->  ${selector}  (kit-only, present in built CSS)`)
}

if (failed) {
  process.exit(1)
}

console.log(
  `@source canary: ${SENTINELS.length} kit-only utilities reached the built CSS in ${cssFiles.join(', ')}.`,
)
