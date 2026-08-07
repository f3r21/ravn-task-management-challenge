import { spawnSync } from 'node:child_process'
import { accessSync, constants } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// `new-lane.sh` exists because provisioning a worktree by hand went silently
// wrong four times (#52). A provisioner whose own guards regress silently is the
// same failure one level up, so the guards are pinned.
//
// Only the pre-flight guards are covered, and deliberately so: everything after
// them creates a git worktree and runs `npm ci`, which is not something a unit
// suite should do on every run. Those steps were verified by provisioning a real
// throwaway lane and reading the checklist back — see the PR for #52.
//
// Every case below exits before the script touches anything, which is what makes
// them safe to run anywhere, CI included. That safety is provided by the guards
// themselves, so if you delete one these cases stop being read-only: the kit's
// equivalent sabotage let the lane name `a/b` reach `git worktree add` and left a
// real worktree at `wt/a/b` on a branch `int/a/b`. Run the sabotage somewhere you
// are willing to clean up.
//
// `process.cwd()`, not `import.meta.url`: the suite runs in the jsdom
// environment, where `import.meta.url` is an http:// URL and `fileURLToPath`
// rejects it. Vitest sets the worker's cwd to the project root. It lives in
// `scripts/` alongside `hooks.test.mjs` and is `.mjs` for the same reasons —
// Vitest does not collect from dotted directories, `tsconfig.json` includes only
// `src`, and coverage includes `src/**` alone, so this adds nothing to the metric.

const script = join(process.cwd(), 'scripts', 'new-lane.sh')

const run = (args) => spawnSync('bash', [script, ...args], { encoding: 'utf8', cwd: process.cwd() })

describe('new-lane.sh guards', () => {
  it('is executable, so `./scripts/new-lane.sh` works without `bash`', () => {
    expect(() => accessSync(script, constants.X_OK)).not.toThrow()
  })

  it('refuses with usage when given no lane name', () => {
    const r = run([])
    expect(r.status).toBe(1)
    expect(r.stderr).toContain('usage:')
  })

  // The one line a port from the kit gets wrong. That repo integrates on `main`
  // and this one on `dev`, so a copied script would cut every lane from the
  // branch that only receives promotions — and nothing else in the run would say
  // so. Pinned through the usage text rather than by grepping for the constant,
  // because the message a human reads is the thing that has to be right.
  it('names the base branch it cuts lanes from, and it is dev', () => {
    const r = run([])
    expect(r.stderr).toContain('origin/dev')
  })

  // The target path is built as `<worktree-root>/<lane>`, so a name containing a
  // separator would place the worktree somewhere nobody asked for — `../..` most
  // of all. Rejected rather than sanitised: there is no legitimate lane name with
  // a slash in it.
  it.each([['a/b'], ['../escape'], ['.hidden'], ['']])('refuses the lane name %j', (lane) => {
    const r = run([lane])
    expect(r.status).toBe(1)
    expect(r.stderr).toMatch(/single path segment|usage:/)
  })

  // Not a style preference. `readonly x="$(cmd)"` masks cmd's exit status, so a
  // failure there survives `set -e` — the shape shellcheck flags as SC2155 and
  // the reason WORKTREE_ROOT is assigned on its own line.
  it('runs clean under shellcheck when it is installed', () => {
    const probe = spawnSync('shellcheck', ['--version'], { encoding: 'utf8' })
    if (probe.error) return // Not installed here; CI and the gate do not require it.
    const r = spawnSync('shellcheck', [script], { encoding: 'utf8' })
    expect(r.stdout, r.stdout).toBe('')
    expect(r.status).toBe(0)
  })
})
