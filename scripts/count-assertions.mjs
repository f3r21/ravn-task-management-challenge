// Lists every type assertion in `src/`, so the figure `CLAUDE.md` quotes travels
// with the command that re-derives it (`.claude/rules/figures.md`).
//
// It parses rather than greps, and that is the whole point. This project's comment
// density is deliberately high, so ` as ` is overwhelmingly prose: a plain
// `grep -rn " as " src` answers 84. Tightening the pattern does not rescue it —
// `grep -rnE ' as (readonly |[A-Z]|[a-z]+\[\])'` answers 18, because it still
// matches `import type * as UiKit`, still matches a comment that quotes
// `String(key) as T`, and still cannot see the *two* assertions that share
// `use-board-filters.ts:65`, since grep counts lines and not expressions. The AST
// knows the difference between an `AsExpression` and the letters "as".
//
// `as const` is excluded: it is a literal-narrowing directive, not a claim about a
// value's type that the compiler is being asked to take on trust.
//
// Scope matches the claim it backs — shipped app source only. Tests and
// `src/test/` legitimately assert to build fixtures and to feed deliberately
// invalid values to `assertNever`, and `src/graphql/generated/` is codegen output
// nobody hand-writes.
//
// Reports; it does not enforce. Nothing in `gate` runs it, and promoting it to a
// gated check is a decision with every open PR as its blast radius — see the
// ruleset notes in `CLAUDE.md`. Exit status is 0 unless the scan itself failed.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(ROOT, 'src')
const EXCLUDED = /(\.test\.tsx?$)|(^src[/\\]test[/\\])|(^src[/\\]graphql[/\\]generated[/\\])/

/** Every `.ts`/`.tsx` file under `dir`, recursively. */
function sourceFiles(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) sourceFiles(path, found)
    else if (/\.tsx?$/.test(path)) found.push(path)
  }
  return found
}

/**
 * Every `x as T` and every non-null `x!` in one file, skipping `as const`.
 *
 * Both are counted because they are the same claim — "trust me about this type" —
 * and `CLAUDE.md` asserts a number for each. The non-null half cannot be grepped
 * at all: `!` is negation, `!=`, and JSX punctuation far more often than it is an
 * assertion.
 */
function assertionsIn(path) {
  const source = ts.createSourceFile(
    path,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  )
  const found = []

  const record = (node, kind) => {
    const { line } = source.getLineAndCharacterOfPosition(node.getStart(source))
    found.push({
      kind,
      location: `${relative(ROOT, path)}:${line + 1}`,
      text: node.getText(source).replace(/\s+/g, ' '),
    })
  }

  const visit = (node) => {
    if (ts.isAsExpression(node)) {
      const isAsConst =
        ts.isTypeReferenceNode(node.type) && node.type.typeName.getText(source) === 'const'
      if (!isAsConst) record(node, 'as')
    } else if (ts.isNonNullExpression(node)) {
      record(node, 'non-null')
    }
    ts.forEachChild(node, visit)
  }

  visit(source)
  return found
}

const scanned = sourceFiles(SRC).filter((path) => !EXCLUDED.test(relative(ROOT, path)))

// The zero guard, same reasoning as `eslint.config.js`'s and the bundle budget's
// in `ci.yml`. This walker finds files by extension and assertions by node kind;
// if either convention shifts under it the scan silently empties and the figure
// it backs reads as "clean" forever. No files is a broken reader, not a clean
// bill of health. Zero *assertions* is a legitimate answer and is not guarded.
if (scanned.length === 0) {
  console.error(
    `Found no source files under ${SRC}. That is not plausible — this scan has broken rather ` +
      'than the code having got tidier.',
  )
  process.exit(1)
}

const assertions = scanned.flatMap(assertionsIn)
for (const { kind, location, text } of assertions) {
  console.log(`${location}  [${kind}]  ${text}`)
}

const asCount = assertions.filter(({ kind }) => kind === 'as').length
const nonNullCount = assertions.length - asCount
console.log(
  `\n${asCount} \`as\` assertion(s) and ${nonNullCount} non-null \`!\` assertion(s) across ` +
    `${scanned.length} shipped source files (excludes tests, src/test/, ` +
    'src/graphql/generated/, and `as const`).',
)
