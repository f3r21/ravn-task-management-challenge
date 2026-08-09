// Measures this project's comment-to-code ratio and what the comments are attached
// to, so the figures travel with the command that re-derives them
// (`.claude/rules/figures.md`).
//
// It parses rather than greps, and the reason is not fastidiousness. `{/* … */}` is
// a `JsxExpression` whose braces are real syntax and whose continuation lines start
// with ordinary prose, so a reader that classifies a line by how it begins files
// every one of them under *code* — subtracting from the numerator and adding to the
// denominator at once. Against this tree that costs **78 lines**: 75 inside the 15
// JSX blocks, and 3 in a `/* */` block whose middle lines carry no leading `*`. The
// error is one-directional — it never mistakes code for a comment — so it always
// flatters the ratio, and it is invisible without something to compare against.
//
// Those two numbers are a reading at a commit, not a floor, and they are re-derived
// by `--compare`, which runs both readers over the same tree and prints the
// disagreement. That flag is why `classifyByLinePrefix` is in this file at all: a
// claim about two instruments cannot be checked by keeping only one of them.
//
// The ratio itself is deliberately *not* written down in this header. Running the
// script prints it, and a header that restates its own output is just the next stale
// figure.
//
// A grep for the opening brace is not the patch. It happens to find all 15 blocks
// today — `grep -rn '{/\*' src --include='*.tsx' | wc -l` answers 15 — and it
// cannot find the 80 *lines* they span, which is the number the ratio is made of.
// It would also count `'{/*'` inside a string literal, and no tightening of the
// pattern distinguishes those. The AST knows a `JsxExpression` with no expression
// is a comment wearing braces.
//
// Definitions, stated because a ratio is meaningless without them:
//
//   - A line is a *comment line* if it holds comment text and no code.
//   - A line is a *code line* if it holds code, whether or not a trailing comment
//     shares it. `foo() // why` is one line of code that documents itself; scoring
//     it as half of each would flatter the ratio in the other direction.
//   - Blank lines are neither, and are reported but never in the ratio. A blank
//     line inside a comment block is still blank.
//
// So the headline is comment lines / code lines, both disjoint counts of real
// lines. `--blocks` dumps every block behind them; `--compare` prints this reader
// against the line-prefix one; `--scopes` prints the ratio under every file set it
// has been quoted under; `--all` widens the scope (see below).
//
// **The ratio on its own has never been the interesting number, which is why the
// attachment table below exists.** A density figure invites the question "is that
// too much", and that question cannot be answered without knowing whether the prose
// is documenting a public surface or narrating a function body. Here it is
// overwhelmingly the former, and it is concentrated: a small number of long blocks
// on module-level declarations carry most of it.
//
// Scope matches the claim it backs — shipped app source only, the same exclusions
// `count-assertions.mjs` uses. Tests are excluded because their comments describe a
// fixture rather than the product, and `src/graphql/generated/` because it is
// codegen output: a few hundred lines nobody wrote, under a banner, all of it
// denominator. `--all` includes both, for when the question is about the repository
// rather than about what ships.
//
// **Two ratios from different scopes are not comparable, and this is not a caveat —
// it is the larger of the two effects.** Admitting `src/graphql/generated/` alone
// moves the headline by several points, more than JSX-blindness does and in the
// opposite direction, so a scope difference can hide a classification bug or
// manufacture one. Historical figures for this repo in the low seventies are
// generated-inclusive and do not compare with what this prints — `--scopes` prints
// them side by side, and the 74.8% this project quoted as evidence of a stable
// density is the "everything but *.test.tsx" row rather than a reading from another
// time. Reconcile there before concluding the density moved. A ratio quoted without
// its file set is not a figure.
//
// Reports; it does not enforce. There is no correct comment ratio, and a threshold
// here would be a number nobody chose applied to the one part of this codebase that
// is deliberately unusual. Exit status is 0 unless the scan itself failed.
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const EXCLUDED = /(\.test\.tsx?$)|(^src[/\\]test[/\\])|(^src[/\\]graphql[/\\]generated[/\\])/

// `--root <dir>` scans somewhere other than this project's `src/`. It exists so
// `count-comments.test.mjs` can point the real script at a fixture corpus, rather
// than the alternatives — adding hazard files under `src/` (which would ship dead
// code and move every figure this script reports) or re-implementing the walk in
// the test (which would then be testing a copy). Paths are still reported relative
// to the repository root, so ordinary runs read exactly as before.
const rootFlag = process.argv.indexOf('--root')
const SRC = rootFlag === -1 ? join(ROOT, 'src') : resolve(process.argv[rootFlag + 1] ?? '')

const showBlocks = process.argv.includes('--blocks')
const includeAll = process.argv.includes('--all')
const showCompare = process.argv.includes('--compare')
const showScopes = process.argv.includes('--scopes')

/**
 * The tree this reading describes, printed beside the ratio.
 *
 * A figure quoted without its ref is the shape this project keeps getting caught
 * by: correct when taken, then outrun. This ratio moved 81.3% → 81.7% inside one
 * pull request, on a comment fix, and both numbers were pasted into places that
 * named no commit — so a reader meeting either had no way to tell a disagreement
 * from a change.
 *
 * `+dirty` is not decoration. A reading taken over uncommitted edits is not a
 * reading of that commit, and it is the common case: you run this *because* you
 * just changed something.
 */
function describeTree() {
  try {
    const head = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    const dirty = execFileSync('git', ['status', '--porcelain', '--', 'src'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return dirty === '' ? head : `${head}+dirty`
  } catch {
    // Not a git checkout, or no git. The count is still valid; it just cannot say
    // what it counted, and saying so is better than printing a ref that is a guess.
    return 'unknown tree'
  }
}

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
 * Every comment range in one file, as `{ pos, end, kind }`.
 *
 * Three queries, because TypeScript models comments in more ways than is obvious.
 *
 * An ordinary comment is *trivia*: it has no node of its own and is reachable only
 * by asking a token about the text around it. Walking to the leaf tokens and asking
 * each for its **leading** trivia reaches every comment that begins a line.
 *
 * It does not reach a **trailing** `// why`, and an earlier version of this comment
 * claimed it did — on the plausible reasoning that the comment must be leading
 * trivia of the next line's first token. It is not:
 * `getLeadingCommentRanges` returns `null` there, because a leading range has to be
 * preceded by a line break. Only `getTrailingCommentRanges`, asked at the end of the
 * token the comment sits behind, finds it. Both are asked, and positions are
 * deduplicated because the same span can be reachable from either side.
 *
 * That omission cost nothing in the ratio and would have cost the census. By the
 * definitions above, `foo() // why` is one *code* line contributing zero comment
 * lines either way — so the headline could not move — but the block count, the kind
 * and attachment tables and the "also carry code" figure were all silently missing
 * a category the header said they covered.
 *
 * A JSX comment is not trivia. It is a `JsxExpression` node with no `expression`,
 * and the comment inside it is reachable as trivia of the closing brace — but
 * reporting only that inner range leaves the braces scored as code, which is the
 * defect this script exists to fix. So the node's whole span is taken and its
 * subtree is not descended into, which is also what stops the inner range being
 * counted twice.
 *
 * `JsxText` is looked at exactly once, to *exclude* it, and that is the sharp edge
 * of adding the trailing query. `getTrailingCommentRanges` is a raw forward scan
 * over the text: asked at the end of a `<div>`, it happily reads the `// text` in
 * `<div>// text</div>` as a trailing comment and swallows the closing tag with it.
 * The leading query never had this problem, because `JsxText` is itself a token, so
 * the closing element's trivia begins after it. Trailing ranges are therefore
 * rejected where they start inside a `JsxText` span — an exact test rather than
 * "skip trailing inside JSX", which would also lose the legitimate
 * `const x = <div /> // why`.
 *
 * This was caught by `count-comments.test.mjs`'s hazard corpus on the first run
 * after the trailing query was added, which is the entire argument for that file
 * existing: the line count stayed correct — the line has code either way — so only
 * the block census moved, and nothing else here would have noticed.
 */
function commentsIn(source, text) {
  const ranges = []

  const isJsxText = new Uint8Array(text.length)
  ;(function markJsxText(node) {
    if (node.kind === ts.SyntaxKind.JsxText) {
      isJsxText.fill(1, node.getFullStart(), node.getEnd())
      return
    }
    node.getChildren(source).forEach(markJsxText)
  })(source)

  // Positions already recorded, because the two trivia queries below can be asked
  // about the same span from either side and a comment counted twice is a comment
  // that inflates every table it appears in.
  const seen = new Set()

  const addTrivia = (found, insideJsxTextIsFatal = false) => {
    for (const range of found ?? []) {
      if (seen.has(range.pos)) continue
      if (insideJsxTextIsFatal && isJsxText[range.pos]) continue
      seen.add(range.pos)
      const isLine = range.kind === ts.SyntaxKind.SingleLineCommentTrivia
      ranges.push({
        pos: range.pos,
        end: range.end,
        kind: isLine ? 'line' : text.startsWith('/**', range.pos) ? 'jsdoc' : 'block',
      })
    }
  }

  const walk = (node) => {
    if (ts.isJsxExpression(node) && !node.expression) {
      ranges.push({ pos: node.getStart(source), end: node.getEnd(), kind: 'jsx' })
      return
    }
    const children = node.getChildren(source)
    if (children.length === 0) {
      addTrivia(ts.getLeadingCommentRanges(text, node.getFullStart()))
      addTrivia(ts.getTrailingCommentRanges(text, node.getEnd()), true)
    } else {
      children.forEach(walk)
    }
  }

  walk(source)
  return ranges.sort((a, b) => a.pos - b.pos)
}

/**
 * What a comment block is attached to — the question the ratio cannot answer.
 *
 * The subject is the outermost node that starts after the block, which a pre-order
 * walk finds first because it visits parents before children. `export` is read off
 * the node's own modifiers rather than inferred from the name, and a variable's
 * modifiers live on the enclosing statement rather than on its declaration, which
 * is why the walk up is there.
 */
function attachmentOf(source, blockEnd) {
  let subject
  const find = (node) => {
    if (subject || node.getEnd() < blockEnd) return
    if (node.getStart(source) >= blockEnd) {
      subject = node
      return
    }
    ts.forEachChild(node, find)
  }
  ts.forEachChild(source, find)
  if (!subject) return 'file end'

  if (ts.isJsxExpression(subject) || subject.kind === ts.SyntaxKind.OpenBraceToken) return 'jsx'
  if (ts.isPropertySignature(subject) || ts.isMethodSignature(subject)) return 'member'
  if (ts.isPropertyDeclaration(subject) || ts.isMethodDeclaration(subject)) return 'member'

  const statement = ts.isVariableDeclaration(subject) ? subject.parent.parent : subject
  const isDeclaration =
    ts.isFunctionDeclaration(statement) ||
    ts.isClassDeclaration(statement) ||
    ts.isInterfaceDeclaration(statement) ||
    ts.isTypeAliasDeclaration(statement) ||
    ts.isVariableStatement(statement) ||
    ts.isExportDeclaration(statement)
  if (!isDeclaration) return 'statement'
  if (statement.parent && !ts.isSourceFile(statement.parent)) return 'statement'

  const exported = ts
    .getModifiers?.(statement)
    ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  return exported || ts.isExportDeclaration(statement) ? 'exported decl' : 'internal decl'
}

/**
 * The reader this script replaces: a line is a comment if it *starts* like one.
 *
 * Kept in the repository rather than described, because "the parser sees more than a
 * line-prefix scan" is a claim, and a claim about two readers can only be checked by
 * running both. `--compare` diffs this against `classify()` and prints the
 * disagreement — which is the evidence for every design decision above it, and the
 * one figure that would otherwise have to be re-derived by hand each time someone
 * doubted it.
 *
 * It is a fair opponent, not a straw one: this is the rule a reasonable person
 * writes, and it gets the overwhelming majority of lines right. That is exactly why
 * it is dangerous — the residue is systematic rather than random.
 */
function classifyByLinePrefix(path) {
  return readFileSync(path, 'utf8')
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()
      if (trimmed === '') return 'blank'
      return /^(\/\/|\/\*|\*)/.test(trimmed) ? 'comment' : 'code'
    })
}

/**
 * Classifies every line of one file as blank, comment, or code, and returns the
 * file's comment blocks.
 *
 * Lines are walked character by character against the comment ranges rather than
 * matched against a pattern, because the only reliable question is "is this
 * character inside a comment" and no regex answers it — `'// not a comment'` is a
 * string literal, and `const url = 'https://x'` contains `//`.
 */
function classify(path) {
  const text = readFileSync(path, 'utf8')
  const source = ts.createSourceFile(
    path,
    text,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  )
  const ranges = commentsIn(source, text)

  const inComment = new Uint8Array(text.length)
  for (const { pos, end } of ranges) inComment.fill(1, pos, end)

  const lineStarts = source.getLineStarts()
  const lines = lineStarts.map((start, index) => {
    const end = index + 1 < lineStarts.length ? lineStarts[index + 1] : text.length
    let hasComment = false
    let hasCode = false
    for (let i = start; i < end; i += 1) {
      if (/\s/.test(text[i])) continue
      if (inComment[i]) hasComment = true
      else hasCode = true
    }
    return hasCode ? 'code' : hasComment ? 'comment' : 'blank'
  })

  // Adjacent ranges separated by nothing but whitespace are one block: eight
  // consecutive `//` lines are one paragraph a reader meets once, not eight
  // comments. Block counts are what "how many places does this codebase stop to
  // explain itself" actually asks.
  const merged = []
  for (const range of ranges) {
    const previous = merged.at(-1)
    if (
      previous &&
      previous.kind === range.kind &&
      text.slice(previous.end, range.pos).trim() === ''
    ) {
      previous.end = range.end
    } else {
      merged.push({ ...range })
    }
  }

  // Which lines a JSX comment block covers, so `--compare` can say *where* the
  // line-prefix reader goes wrong rather than only how often. "78 lines" is a
  // complaint; "75 of them are the JSX blocks" is a diagnosis.
  const jsxLines = new Set()
  for (const range of ranges.filter((candidate) => candidate.kind === 'jsx')) {
    const from = source.getLineAndCharacterOfPosition(range.pos).line
    const to = source.getLineAndCharacterOfPosition(range.end - 1).line
    for (let line = from; line <= to; line += 1) jsxLines.add(line)
  }

  return {
    path,
    lines,
    jsxLines,
    blocks: merged.map((block) => {
      const { line } = source.getLineAndCharacterOfPosition(block.pos)
      const { line: endLine } = source.getLineAndCharacterOfPosition(block.end - 1)
      return {
        kind: block.kind,
        attachment: block.kind === 'jsx' ? 'jsx element' : attachmentOf(source, block.end),
        location: `${relative(ROOT, path)}:${line + 1}`,
        lines: endLine - line + 1,
        first: text.slice(block.pos, block.end).split('\n')[0].trim(),
      }
    }),
  }
}

const scanned = sourceFiles(SRC)
  .map((path) => relative(ROOT, path))
  .filter((path) => includeAll || !EXCLUDED.test(path))
  .map((path) => join(ROOT, path))

// The zero guard, same reasoning as `count-assertions.mjs`'s. This walker finds
// files by extension and comments by node kind; if either convention shifts under
// it the scan silently empties and the ratio reads as a tidy 0%. No files is a
// broken reader, not a codebase that stopped explaining itself.
if (scanned.length === 0) {
  console.error(
    `Found no source files under ${SRC}. That is not plausible — this scan has broken rather ` +
      'than the comments having gone away.',
  )
  process.exit(1)
}

const files = scanned.map(classify)
const blocks = files.flatMap((file) => file.blocks)

/**
 * Every scope this ratio has ever been quoted under, so two figures can be compared
 * instead of argued about.
 *
 * This exists because a scope difference is *larger* than the classification bug the
 * rest of this script is about, and pushes the other way — so a mismatch here can
 * hide a misreading or invent one. `72.2%`, `74.8%` and `81.7%` were all quoted for
 * this repository as though they were a trend over time. They are these rows.
 */
const SCOPES = [
  ['shipped source only (the default)', EXCLUDED],
  ['+ src/graphql/generated/', /(\.test\.tsx?$)|(^src[/\\]test[/\\])/],
  ['+ src/test/', /(\.test\.tsx?$)|(^src[/\\]graphql[/\\]generated[/\\])/],
  ['everything but *.test.tsx', /\.test\.tsx?$/],
  ['everything under src/', /(?!)/],
]

const tally = (subset) => {
  const counts = { comment: 0, code: 0, blank: 0 }
  for (const file of subset) for (const line of file.lines) counts[line] += 1
  return counts
}

if (showBlocks) {
  for (const block of blocks) {
    console.log(
      `${block.location}  [${block.kind}/${block.attachment}]  ${block.lines}L  ${block.first}`,
    )
  }
  console.log('')
}

const pad = (value, width) => String(value).padStart(width)
const percent = (part, whole) => `${((part / whole) * 100).toFixed(1)}%`

// Grouped by the top-level directory under `src/`, because "where is the density"
// is the question a reader asks next and a per-file list is 58 rows of noise.
const areas = new Map()
for (const file of files) {
  const area = relative(SRC, file.path).split(sep)[0]
  if (!areas.has(area)) areas.set(area, [])
  areas.get(area).push(file)
}

console.log('area           files  comment   code  blank   ratio')
for (const { area, comment, code, blank, count } of [...areas.entries()]
  .map(([area, subset]) => ({ area, ...tally(subset), count: subset.length }))
  .sort((a, b) => b.comment - a.comment)) {
  console.log(
    `${area.padEnd(14)}${pad(count, 5)}${pad(comment, 9)}${pad(code, 7)}${pad(blank, 7)}` +
      `${pad(code === 0 ? '—' : percent(comment, code), 8)}`,
  )
}

const total = tally(files)
console.log(
  `\n${total.comment} comment lines / ${total.code} code lines = ` +
    `${percent(total.comment, total.code)}  (${total.blank} blank, ` +
    `${total.comment + total.code + total.blank} total, ${scanned.length} files` +
    `${includeAll ? '' : ', shipped source only'})  at ${describeTree()}`,
)

const commentLines = blocks.reduce((sum, block) => sum + block.lines, 0)
const group = (key, order) =>
  order
    .map((value) => {
      const subset = blocks.filter((block) => block[key] === value)
      const lines = subset.reduce((sum, block) => sum + block.lines, 0)
      return { value, count: subset.length, lines }
    })
    .filter(({ count }) => count > 0)

// Block spans exceed the comment-line count by however many lines carry code *and*
// a comment: those are one line in each total, and the ratio above scores them as
// code. The gap is the number of self-documenting statements, not an error.
console.log(
  `\n${blocks.length} blocks spanning ${commentLines} lines ` +
    `(${commentLines - total.comment} of those lines also carry code).`,
)
console.log('kind         blocks  lines   share')
for (const { value, count, lines } of group('kind', ['jsdoc', 'block', 'line', 'jsx'])) {
  console.log(
    `${value.padEnd(13)}${pad(count, 6)}${pad(lines, 7)}${pad(percent(lines, commentLines), 8)}`,
  )
}

console.log('attached to  blocks  lines   share')
for (const { value, count, lines } of group('attachment', [
  'exported decl',
  'internal decl',
  'member',
  'statement',
  'jsx element',
  'file end',
])) {
  console.log(
    `${value.padEnd(13)}${pad(count, 6)}${pad(lines, 7)}${pad(percent(lines, commentLines), 8)}`,
  )
}

// How concentrated the prose is. "Is this too many comments" and "are these ten
// blocks too long" are different questions with different answers, and the second
// is the one this codebase actually raises.
const descending = [...blocks].sort((a, b) => b.lines - a.lines)
const share = (n) =>
  `top ${n} blocks: ${descending.slice(0, n).reduce((sum, b) => sum + b.lines, 0)} lines ` +
  `(${percent(
    descending.slice(0, n).reduce((sum, b) => sum + b.lines, 0),
    commentLines,
  )})`
console.log(`\n${share(10)}, ${share(25)}, ${share(50)}`)
console.log(
  `${blocks.filter((block) => block.lines === 1).length} blocks are a single line ` +
    `(${percent(blocks.filter((block) => block.lines === 1).length, blocks.length)} of blocks, ` +
    `${percent(blocks.filter((block) => block.lines === 1).length, commentLines)} of lines).`,
)

if (showScopes) {
  // Deliberately re-reads every file under `src/` rather than the scanned set: the
  // whole point is to show scopes wider than the one this run was given, and
  // `--scopes` alongside the default flags would otherwise silently report the
  // narrow set five times.
  const everything = sourceFiles(SRC).map(classify)
  console.log('\n--- the same tree under every scope this ratio has been quoted under ---')
  console.log('scope                              files  comment   code   ratio')
  for (const [name, excluded] of SCOPES) {
    const subset = everything.filter((file) => !excluded.test(relative(ROOT, file.path)))
    const counts = tally(subset)
    console.log(
      `${name.padEnd(35)}${pad(subset.length, 5)}${pad(counts.comment, 9)}${pad(counts.code, 7)}` +
        `${pad(percent(counts.comment, counts.code), 8)}`,
    )
  }
}

if (showCompare) {
  const prefix = { comment: 0, code: 0 }
  let asCode = 0
  let asComment = 0
  let inJsx = 0
  const elsewhere = []

  for (const file of files) {
    const guessed = classifyByLinePrefix(file.path)
    for (const [index, truth] of file.lines.entries()) {
      const guess = guessed[index]
      if (guess === 'comment' || guess === 'code') prefix[guess] += 1
      if (truth === guess) continue
      if (truth === 'comment' && guess === 'code') {
        asCode += 1
        if (file.jsxLines.has(index)) inJsx += 1
        else elsewhere.push(`${relative(ROOT, file.path)}:${index + 1}`)
      } else if (truth === 'code' && guess === 'comment') {
        asComment += 1
      }
    }
  }

  console.log('\n--- against a reader that classifies a line by how it begins ---')
  console.log(
    `parsed      : ${total.comment} comment / ${total.code} code = ` +
      `${percent(total.comment, total.code)}`,
  )
  console.log(
    `line-prefix : ${prefix.comment} comment / ${prefix.code} code = ` +
      `${percent(prefix.comment, prefix.code)}`,
  )
  console.log(`comment lines it files as code : ${asCode}  (${inJsx} inside a JSX block)`)
  // The interesting number is this one, and it is interesting for being zero. An
  // instrument that is merely noisy disagrees in both directions; one that is biased
  // disagrees in exactly one, and only the second kind moves a ratio reliably.
  console.log(`code lines it files as comment : ${asComment}`)
  if (elsewhere.length > 0) console.log(`outside JSX: ${elsewhere.join(', ')}`)
}
