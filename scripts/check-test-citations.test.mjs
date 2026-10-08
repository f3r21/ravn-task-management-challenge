import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'

// Two halves. The first drives `check-test-citations.mjs` over throwaway trees, one
// per case, so each rule of what counts as a citation is pinned on its own. The
// last `describe` runs it over this repository's real docs and tests, and that is
// the half that makes `npm run gate` fail when a doc cites a test that is gone.
// Its failure message is the script's own output, one `doc:line` per citation.
//
// Each case runs the real script as a process rather than importing a function,
// because the exit code and the `doc:line` it prints are what the gate depends on.
// `process.cwd()` and `.mjs` for the reasons `hooks.test.mjs` gives: Vitest sets the
// worker's cwd to the project root, `tsconfig.json` includes only `src`, and
// coverage counts `src/**` alone, so this adds nothing to the metric.

const script = join(process.cwd(), 'scripts', 'check-test-citations.mjs')
const roots = []
afterAll(() => roots.forEach((root) => rmSync(root, { recursive: true, force: true })))

/**
 * Runs the real script over a throwaway tree. A doc a case does not give is
 * written with one citation that holds, because a doc citing nothing is itself a
 * failure. Pass `null` to leave a doc out.
 */
function run(files) {
  const root = mkdtempSync(join(tmpdir(), 'check-test-citations-'))
  roots.push(root)
  const tree = {
    'docs/product.md': FILLER_DOC,
    'docs/qa/test-map.md': FILLER_DOC,
    'src/filler/filler.test.ts': "it('is cited', () => {})\n",
    ...files,
  }
  for (const [path, content] of Object.entries(tree)) {
    if (content === null) continue
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), content)
  }
  return spawnSync('node', [script, '--root', root], { encoding: 'utf8' })
}

const table = (...rows) =>
  ['| Criterion | Test |', '| --- | --- |', ...rows.map((row) => `| ${row.join(' | ')} |`)].join(
    '\n',
  )

const FILLER_DOC = table(['filler', "`filler.test.ts`: 'is cited'"])

describe('check-test-citations.mjs', () => {
  it('names the doc line of a cited title its file does not have', () => {
    const r = run({
      'docs/qa/test-map.md': `# Map\n\n${table(['1', "`create-task.test.tsx`: 'labels the effort field'"])}\n`,
      'src/features/create-task.test.tsx': "it('labels the title field', () => {})\n",
    })
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(/^docs\/qa\/test-map\.md:5: .*'labels the effort field'/m)
  })

  it('passes, and says how many it checked, when the cited file has the title', () => {
    const r = run({
      'docs/qa/test-map.md': table(['1', "`create-task.test.tsx`: 'labels the effort field'"]),
      'src/features/create-task.test.tsx': "it('labels the effort field', () => {})\n",
    })
    expect(r.status, r.stderr).toBe(0)
    expect(r.stdout).toMatch(/^docs\/qa\/test-map\.md: test citations checked: 1, all found$/m)
  })

  it('reads a title in double quotes', () => {
    const r = run({
      'docs/qa/test-map.md': table(['1', '`create-task.test.tsx`: "keeps the user\'s draft"']),
      'src/features/create-task.test.tsx': 'it("keeps the user\'s draft", () => {})\n',
    })
    expect(r.status, r.stderr).toBe(0)
    expect(r.stdout).toMatch(/^docs\/qa\/test-map\.md: test citations checked: 1,/m)
  })

  it('matches an it.each title by its %s placeholders', () => {
    const r = run({
      'docs/qa/test-map.md': table([
        '2',
        `\`board-page.test.tsx\`: 'shows %s as "%s" on its card', for Slack and "Effort 4"`,
      ]),
      'src/features/board-page.test.tsx': `it.each([['Slack', 'Effort 4']])('shows %s as "%s" on its card', () => {})\n`,
    })
    expect(r.status, r.stderr).toBe(0)
    expect(r.stdout).toMatch(/^docs\/qa\/test-map\.md: test citations checked: 1,/m)
  })

  it('reads a test title the source writes in backticks', () => {
    const r = run({
      'docs/qa/test-map.md': table(['1', "`create-task.test.tsx`: 'labels the effort field'"]),
      'src/features/create-task.test.tsx': 'it(`labels the effort field`, () => {})\n',
    })
    expect(r.status, r.stderr).toBe(0)
  })

  it('finds a Playwright test cited by its path under e2e/', () => {
    const r = run({
      'docs/product.md': table(['E2E', '`e2e/deployed-proxy.spec.ts`: "creates a task"']),
      'e2e/deployed-proxy.spec.ts': "test('creates a task', async () => {})\n",
    })
    expect(r.status, r.stderr).toBe(0)
    expect(r.stdout).toMatch(/^docs\/product\.md: test citations checked: 1,/m)
  })

  it('does not count the title when it is only text in the file, not a test', () => {
    const r = run({
      'docs/product.md': table(['E2E', '`e2e/deployed-proxy.spec.ts`: "creates a task"']),
      'e2e/deployed-proxy.spec.ts': [
        '// creates a task',
        "const label = 'creates a task'",
        "test.skip('creates a task', async () => {})",
        "test.describe('creates a task', () => {",
        "  test('creates and deletes a task', async () => {",
        "    await test.step('creates a task', async () => {})",
        '  })',
        '})',
        '',
      ].join('\n'),
    })
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(/^docs\/product\.md:3: .*'creates a task'/m)
  })

  it('reads every title in a run after one file, and stops at the prose', () => {
    const r = run({
      'docs/product.md': table([
        'open',
        '`create-task.test.tsx`: "opens a named dialog", \'puts focus in "Title"\', for "Effort 4"',
      ]),
      'src/features/create-task.test.tsx': "it('opens a named dialog', () => {})\n",
    })
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(/^docs\/product\.md:3: .*'puts focus in "Title"'/m)
    expect(r.stderr).not.toMatch(/opens a named dialog|Effort 4/)
  })

  it('reads a title that prose wraps across lines as the title with one space', () => {
    const r = run({
      'docs/qa/test-map.md': [
        '- **Positive.** The edit dialog has the same label',
        '  (`update-delete-task.test.tsx`: \'labels the effort field "Effort" and explains it, as the create',
        "  dialog does'). The formatter writes both (`task-display.test.ts`:",
        "  'writes every effort value')",
        '',
      ].join('\n'),
      'src/features/update-delete-task.test.tsx': `it('labels the effort field "Effort" and explains it, as the create dialog does', () => {})\n`,
      'src/lib/task-display.test.ts': "it('writes every effort value', () => {})\n",
    })
    expect(r.status, r.stderr).toBe(0)
    expect(r.stdout).toMatch(/^docs\/qa\/test-map\.md: test citations checked: 2,/m)
  })

  it('gives a table cell that starts with a title the file cited above it in its column', () => {
    const r = run({
      'docs/product.md': table(
        ['open', '`create-task.test.tsx`: "opens a named dialog"'],
        ['"Effort 8" is picked', '"refuses an empty title"'],
        ['valid', '"adds the task", \'says "Task created"\''],
      ),
      'src/features/create-task.test.tsx': [
        "it('opens a named dialog', () => {})",
        "it('refuses an empty title', () => {})",
        "it('adds the task', () => {})",
        '',
      ].join('\n'),
    })
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(
      /^docs\/product\.md:5: src\/features\/create-task\.test\.tsx .*'says "Task created"'/m,
    )
    expect(r.stderr.trim().split('\n')).toHaveLength(1)
  })

  it('names the doc line of a cited file that is not under src/ or e2e/', () => {
    const r = run({
      'docs/qa/test-map.md': table(['proxy', "`graphql.test.ts`: 'adds the token'"]),
      'api/graphql.test.ts': "it('adds the token', () => {})\n",
    })
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(
      /^docs\/qa\/test-map\.md:3: no graphql\.test\.ts under src\/ or e2e\/$/m,
    )
  })

  it('names both files when the cited name could be either of two', () => {
    const r = run({
      'docs/qa/test-map.md': table(['client', "`client.test.ts`: 'sends the query'"]),
      'src/api/client.test.ts': "it('sends the query', () => {})\n",
      'src/mocks/client.test.ts': "it('answers the query', () => {})\n",
    })
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(
      /^docs\/qa\/test-map\.md:3: client\.test\.ts could be src\/api\/client\.test\.ts or src\/mocks\/client\.test\.ts/m,
    )
  })

  it('fails by name when one of the two docs is missing', () => {
    const r = run({
      'docs/qa/test-map.md': null,
      'docs/product.md': table(['open', "`create-task.test.tsx`: 'opens a named dialog'"]),
      'src/features/create-task.test.tsx': "it('opens a named dialog', () => {})\n",
    })
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(/^docs\/qa\/test-map\.md: missing, so nothing in it was checked$/m)
  })

  it('fails by name when one doc cites nothing it can read, though the other does', () => {
    // The review's case: one doc's citation format changes, so it yields zero, and
    // a total across both docs still reads as a pass on the other doc's count.
    const r = run({
      'docs/product.md': table(['open', "`create-task.test.tsx`: 'opens a named dialog'"]),
      'docs/qa/test-map.md': table(['1', "`create-task.test.tsx` - 'labels the effort field'"]),
      'src/features/create-task.test.tsx': [
        "it('opens a named dialog', () => {})",
        "it('labels the effort field', () => {})",
        '',
      ].join('\n'),
    })
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(/^docs\/qa\/test-map\.md: found no test citations/m)
    expect(r.stderr).not.toMatch(/docs\/product\.md/)
  })

  it('fails rather than pass on zero when neither doc cites a test it can read', () => {
    const r = run({
      'docs/product.md': table(['open', 'create-task.test.tsx: "opens a named dialog"']),
      'docs/qa/test-map.md': table(['1', 'create-task.test.tsx, "labels the effort field"']),
      'src/features/create-task.test.tsx': "it('labels the effort field', () => {})\n",
    })
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(/^docs\/product\.md: found no test citations/m)
    expect(r.stderr).toMatch(/^docs\/qa\/test-map\.md: found no test citations/m)
  })
})

describe('the docs in this repository', () => {
  it('cite only tests that exist', () => {
    const r = spawnSync('node', [script], { encoding: 'utf8' })
    expect(r.status, r.stderr).toBe(0)
  })
})
