import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// `count-comments.mjs` answers "what is a comment", and every wrong answer to that
// question looks exactly like a right one — the output is a plausible number either
// way. So the cases below are the two halves that can disagree: text that *looks*
// like a comment and is not, and comments the obvious reader misses.
//
// This corpus is not hypothetical. It was written by a reviewing session against
// `d87f00b` and run once by hand; pinning it is the difference between "someone
// checked this" and "this is checked". Its sibling `count-assertions.mjs` ships no
// test and the parity argument for that is fair — but this script's whole thesis is
// that a claim about an instrument can only be settled by running it, so shipping
// it with its own corpus unrun would contradict the thing it argues.
//
// Fixtures go in a temp directory reached through `--root`, never under `src/`:
// hazard files there would ship dead code and move every figure this script
// reports, including the ones its own header quotes. Each case builds its own
// directory, so no case can pass or fail because of what another one wrote.
//
// `process.cwd()` and `.mjs` for the same reasons `new-lane.test.mjs` gives —
// Vitest sets the worker's cwd to the project root, `tsconfig.json` includes only
// `src`, and coverage counts `src/**` alone, so this adds nothing to the metric.

const script = join(process.cwd(), 'scripts', 'count-comments.mjs')

/**
 * Runs the real script over a throwaway corpus.
 *
 * Fixture names deliberately avoid `.test.tsx`: that suffix is on the script's own
 * exclusion list, so a fixture named that way is skipped, every assertion reads
 * zero, and the case goes green against nothing.
 */
function run(files, ...args) {
  const dir = mkdtempSync(join(tmpdir(), 'count-comments-'))
  for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content)
  return spawnSync('node', [script, '--root', dir, ...args], { encoding: 'utf8' })
}

// Every line is code. Each contains something a reader looking for `//`, `/*` or
// `{/*` would take for a comment, and none of them is one.
const HAZARDS = `export const a = 'http://example.com/x'
export const b = '/* not a comment */'
export const c = \`template /* not */ // not\`
export const d = /\\/\\* not \\*\\//
export const E = () => <div>{'{/* not a comment */}'}</div>
export const F = () => <div>// this is JsxText the browser renders</div>
`

// Seven comment lines and eight code lines: two `//` lines that merge into one
// block, a `/* */` whose middle line carries no leading `*`, a two-line JSX
// comment, and a trailing comment only `getTrailingCommentRanges` can see.
const POSITIVE = `// one
// two
export const a = 1
/* three
   four — no leading star, which a line-prefix reader files as code
*/
export const b = 2
export const C = () => (
  <div>
    {/* five
        six */}
    <span>x</span>
  </div>
)
export const d = 3 // seven, trailing
`

describe('count-comments.mjs', () => {
  it('counts none of the six comment-lookalikes as comments', () => {
    const r = run({ 'hazards.tsx': HAZARDS })
    expect(r.status, r.stderr).toBe(0)
    // The `6` is the control that makes the `0` mean something: all six lines were
    // read, so the zero is a judgement about them rather than a scan that missed
    // the file.
    expect(r.stdout).toMatch(/0 comment lines \/ 6 code lines/)
  })

  it('treats `// text` between two tags as rendered text, not as a comment', () => {
    // Separated out because it is the one case that fails in the *other* direction
    // from everything else here, and the one a scanner-based reader gets wrong:
    // inside JSX children, `//` is content the browser paints.
    const r = run({ 'jsxtext.tsx': 'export const F = () => <div>// text</div>\n' }, '--blocks')
    expect(r.stdout).toMatch(/0 comment lines \/ 1 code lines/)
    expect(r.stdout).not.toMatch(/jsxtext\.tsx:\d+/)
  })

  it('finds every comment in the positive corpus, with the right kinds and spans', () => {
    const r = run({ 'positive.tsx': POSITIVE }, '--blocks')
    expect(r.status, r.stderr).toBe(0)
    expect(r.stdout).toMatch(/7 comment lines \/ 8 code lines/)
    // `2L` on the JSX block is the figure a grep for `{/*` cannot produce, and `3L`
    // on the block comment is the one a line-prefix reader splits into three.
    expect(r.stdout).toMatch(/positive\.tsx:1 {2}\[line\/exported decl\] {2}2L/)
    expect(r.stdout).toMatch(/positive\.tsx:4 {2}\[block\/exported decl\] {2}3L/)
    expect(r.stdout).toMatch(/positive\.tsx:10 {2}\[jsx\/jsx element\] {2}2L/)
    // The trailing comment. Until `getTrailingCommentRanges` was added to
    // `commentsIn` this was recorded as no block and no comment line at all, while
    // the docstring claimed the leading-trivia walk already reached it.
    expect(r.stdout).toMatch(/positive\.tsx:15 {2}\[line\/statement\] {2}1L/)
  })

  it('reports the line-prefix reader disagreeing in exactly one direction', () => {
    const r = run({ 'positive.tsx': POSITIVE }, '--compare')
    // The JSX block's two lines plus the block comment's star-less middle line.
    // The `0` is the claim the header makes about the bias being systematic rather
    // than noisy, and it is the half that would break first if the walk started
    // over-reaching.
    expect(r.stdout).toMatch(/comment lines it files as code : 3 {2}\(2 inside a JSX block\)/)
    expect(r.stdout).toMatch(/code lines it files as comment : 0/)
  })

  it('refuses an empty scan rather than reporting a tidy zero', () => {
    const r = run({})
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(/no source files/)
  })
})
