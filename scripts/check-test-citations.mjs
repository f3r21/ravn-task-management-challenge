// Fails when a doc cites a test by title and that file has no test with that title.
//
// `docs/qa/test-map.md` and the "Checked by" column of `docs/product.md` say which
// test proves each claim, by file and title. Nothing checked those citations, and
// a test renamed during the F1 build left a doc cell naming a test that no longer
// existed. It was found and fixed by hand, and then an auditor re-checked the cited
// titles by hand, in two rounds. A stale citation is worse than none, because it
// still reads as evidence.
//
// `npm run gate` runs this through `scripts/check-test-citations.test.mjs`, the way
// it runs `scripts/hooks.test.mjs`. By hand: `node scripts/check-test-citations.mjs`.
// It prints how many citations it checked, so a pass says what it covered.
//
// **What it reads as a citation.** A backticked test file, a colon, and a run of
// quoted titles:
//
//   `create-task.test.tsx`: "opens a named dialog from the + button", 'labels …'
//
// Either quote, because a title holding `"` is cited in `'`, as the source writes
// it. A closing quote is one not followed by a letter or digit, so the apostrophe
// in "the user's draft" stays inside. The run ends at the first thing that is not
// `, <quote>`, so in `'shows %s as "%s" …', for Slack and "Effort 4"` the trailing
// "Effort 4" is prose about the case, not a second title. An `it.each` title keeps
// its `%s` on both sides, so it is compared as written. Prose wraps titles across
// lines, and a wrapped title is read with one space where the line broke.
//
// **A table cell may leave the file out.** `docs/product.md` names the file once
// and lets the cells below it in the "Checked by" column start straight with a
// title. Such a cell belongs to the file last cited above it in the same column of
// the same table. Only a column that has cited a file inherits one, so a UI string
// quoted at the start of a "When" cell is not mistaken for a title.
//
// **What it structurally cannot see.**
//
// - A title quoted in prose with no file next to it. There is no file to look in,
//   and reading every quoted phrase as a title would take UI strings such as
//   "Any effort" for tests. A citation it should check has to name its file.
// - A title built with `${}` substitution. It has no fixed text to compare.
// - Whether the cited test asserts what the doc says it does. This checks that
//   the citation points at something; reading the test is still review's job.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// `--root <dir>` reads the docs and tests of another tree. It exists so the tests
// can build a throwaway one, the way `count-comments.mjs` takes `--root`.
const rootFlag = process.argv.indexOf('--root')
const ROOT =
  rootFlag === -1
    ? fileURLToPath(new URL('..', import.meta.url))
    : resolve(process.argv[rootFlag + 1] ?? '')

const DOCS = ['docs/product.md', 'docs/qa/test-map.md']

const CITED_FILE = /`([^`\s]+\.(?:test|spec)\.[cm]?[jt]sx?)`:\s+/g
const TITLE = /(['"])(.*?)\1(?!\w)/sy
const NEXT_TITLE = /,\s+(?=['"])/y

/** The run of quoted titles starting exactly at `from`, or none. */
function titlesAt(text, from) {
  const titles = []
  let at = from
  for (;;) {
    TITLE.lastIndex = at
    const title = TITLE.exec(text)
    if (!title) return titles
    titles.push(title[2].replace(/\s+/g, ' '))
    NEXT_TITLE.lastIndex = TITLE.lastIndex
    if (!NEXT_TITLE.test(text)) return titles
    at = NEXT_TITLE.lastIndex
  }
}

/** Citations that name their file, anywhere in the doc. */
function namedCitationsIn(text) {
  const citations = []
  for (const match of text.matchAll(CITED_FILE)) {
    const line = text.slice(0, match.index).split('\n').length
    for (const title of titlesAt(text, match.index + match[0].length)) {
      citations.push({ line, file: match[1], title })
    }
  }
  return citations
}

/** Table cells that start with a title, given the file cited above them in their column. */
function inheritedCitationsIn(text) {
  const citations = []
  let fileAbove = []
  text.split('\n').forEach((row, index) => {
    if (!row.trimStart().startsWith('|')) {
      fileAbove = []
      return
    }
    row
      .trim()
      .slice(1, -1)
      .split('|')
      .forEach((cell, column) => {
        const content = cell.trim()
        if (/^['"]/.test(content) && fileAbove[column]) {
          for (const title of titlesAt(content, 0)) {
            citations.push({ line: index + 1, file: fileAbove[column], title })
          }
        }
        const named = namedCitationsIn(content)
        if (named.length > 0) fileAbove[column] = named[named.length - 1].file
      })
  })
  return citations
}

const citationsIn = (text) =>
  [...namedCitationsIn(text), ...inheritedCitationsIn(text)].sort((a, b) => a.line - b.line)

function testFilesUnder(dir) {
  let entries
  try {
    entries = readdirSync(join(ROOT, dir), { withFileTypes: true, recursive: true })
  } catch {
    return []
  }
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => relative(ROOT, join(entry.parentPath, entry.name)))
}

// `it` and `test`, bare or through `.each(...)`, and nothing else. `test.step`,
// `test.describe`, a comment or a label constant can hold the same words, which is
// why this parses rather than greps: a grep finds the words and calls it a test.
// `it.skip` and `it.todo` do not count either. A doc saying a skipped test checks
// something is the same stale claim as one naming a test that is gone.
const isTestFunction = (node) =>
  ts.isIdentifier(node) && (node.text === 'it' || node.text === 'test')

// `it(...)`, or `it.each(table)(...)`, whose callee is itself the call `it.each(table)`.
const isTestCall = ({ expression: callee }) =>
  isTestFunction(callee) ||
  (ts.isCallExpression(callee) &&
    ts.isPropertyAccessExpression(callee.expression) &&
    callee.expression.name.text === 'each' &&
    isTestFunction(callee.expression.expression))

function testTitlesIn(path) {
  const source = ts.createSourceFile(
    path,
    readFileSync(join(ROOT, path), 'utf8'),
    ts.ScriptTarget.Latest,
  )
  const titles = new Set()
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      isTestCall(node) &&
      node.arguments[0] &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      titles.add(node.arguments[0].text)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return titles
}

const testFiles = [...testFilesUnder('src'), ...testFilesUnder('e2e')].sort()
const problems = []
let checked = 0

for (const doc of DOCS) {
  // A doc that moved would otherwise leave this checking one doc and passing.
  if (!existsSync(join(ROOT, doc))) {
    problems.push(`${doc}: missing, so nothing in it was checked`)
    continue
  }
  for (const { line, file, title } of citationsIn(readFileSync(join(ROOT, doc), 'utf8'))) {
    checked++
    const paths = testFiles.filter(
      (candidate) => candidate === file || candidate.endsWith(`/${file}`),
    )
    const [path] = paths
    if (!path) {
      problems.push(`${doc}:${line}: no ${file} under src/ or e2e/`)
    } else if (paths.length > 1) {
      // A reader cannot tell which file is meant either, so this is a doc defect,
      // not something to settle by trying both.
      problems.push(`${doc}:${line}: ${file} could be ${paths.join(' or ')}; cite more of its path`)
    } else if (!testTitlesIn(path).has(title)) {
      problems.push(`${doc}:${line}: ${path} has no test titled '${title}'`)
    }
  }
}

// Zero is what a change to the citation format looks like from here: every
// citation stops matching and nothing is left to fail. So zero fails.
if (checked === 0 && problems.length === 0) {
  problems.push(`found no test citations in ${DOCS.join(' or ')}; has the citation format changed?`)
}

for (const problem of problems) console.error(problem)
if (problems.length > 0) process.exit(1)
console.log(`test citations checked: ${checked}, all found`)
