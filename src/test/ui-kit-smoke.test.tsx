import { render, screen } from '@testing-library/react'
import {
  Avatar,
  Button,
  DUE_DATE_URGENCY_COLOR,
  Datepicker,
  Menu,
  Modal,
  MultiSelect,
  Select,
  Skeleton,
  Tag,
  TaskListView,
  TextButton,
} from '@ravn/ui-kit'
import { Item } from 'react-stately'
import { describe, expect, it } from 'vitest'
import appManifest from '../../package.json'
// The only path in this repo that reaches into `node_modules` on purpose, and it has
// to: the kit's `exports` map does not list `./package.json`, so the specifier
// `@ravn/ui-kit/package.json` fails to resolve at all. A relative path is a file read,
// not a package resolution, so it is not subject to that map. Reading it is fine;
// editing anything under there is not — see `.claude/rules/ui-kit.md`.
import kitManifest from '../../node_modules/@ravn/ui-kit/package.json'

/*
 * The one failure in this project that neither repository's CI can see on its own,
 * because it lives *between* them.
 *
 * `@ravn/ui-kit` arrives as a git dependency pinned to a tag, and a git install runs no
 * build: `npm ci` copies the `dist/` the kit committed. So three things can go wrong
 * across the seam and still leave every existing check green — the kit can tag a
 * version whose `dist/` was never rebuilt from its source, this app can pin a tag that
 * does not contain an export it imports, and a resolution can land that no test ever
 * exercises. Everything else here fails loudly: `gate` catches type and lint breakage,
 * git surfaces conflicts, branch protection blocks a red merge. This one ships green
 * and breaks on Vercel, in front of whoever is grading it.
 *
 * The app's other tests import kit components, but every one of them renders app code
 * and asserts app behaviour; none of them assert that the *dependency resolved to
 * something usable*, so a broken install reads as a pile of unrelated app failures. The
 * kit's own CI only ever tests its source tree, never the packed artifact a consumer
 * installs.
 *
 * These run inside `npm run gate`, and CI runs `gate` after a real `npm ci` — so the
 * moment the dependency resolves to a broken or incomplete package, the app's required
 * status check fails instead of the deploy.
 *
 * Deliberately small, and deliberately not a test of the kit: the kit tests itself.
 * This is a test that the wiring holds. When a kit component fails an assertion
 * elsewhere in this suite, the fix still goes in the kit — see `.claude/rules/ui-kit.md`.
 */

describe('@ravn/ui-kit, as installed', () => {
  it('exports every component the app imports from it', () => {
    // Imported from the package's public barrel above, never a deep
    // `@ravn/ui-kit/dist/...` path: a deep import resolves past the `exports` map and
    // would keep working after the package stopped exporting these names, which is
    // exactly the drift this file exists to catch.
    //
    // The components the app imports today, minus the icons — which are a single
    // uniform family, so naming one of them proves the same thing as naming fourteen.
    // A missing entry only under-tests; it cannot produce a false pass.
    //
    // Re-derive the full list, icons and types included:
    //
    //   grep -rho "import \(type \)\?{[^}]*} from '@ravn/ui-kit'" src | grep -v test
    expect(typeof Menu).toBe('function')
    expect(typeof Modal).toBe('function')
    expect(typeof MultiSelect).toBe('function')
    expect(typeof Select).toBe('function')
    // Added by the board migration (app#31).
    expect(typeof Avatar).toBe('function')
    expect(typeof Button).toBe('function')
    expect(typeof Datepicker).toBe('function')
    expect(typeof Skeleton).toBe('function')
    expect(typeof Tag).toBe('function')
    expect(typeof TaskListView).toBe('function')
    expect(typeof TextButton).toBe('function')
  })

  it('exports the urgency palette the board hands straight to a Tag', () => {
    // A value rather than a component, so it needs its own shape of check: a `typeof`
    // test passes on a map that is present but missing a member. The app deleted its own
    // copy of this table in favour of the kit's, and the board reads all three members,
    // so a release that dropped one would leave a due-date tag unstyled with nothing
    // else here failing.
    expect(Object.keys(DUE_DATE_URGENCY_COLOR).sort()).toEqual(['normal', 'overdue', 'soon'])
  })

  it('renders one of them with its accessible name intact', () => {
    render(
      <Menu label="Task options" triggerContent={<span aria-hidden="true">…</span>}>
        <Item key="edit">Edit</Item>
      </Menu>,
    )

    // Role and accessible name rather than markup: a package that loads but ships a
    // stale or wrong `dist/` can still export a function that renders *something*.
    // What it cannot fake is the component's contract with assistive technology.
    expect(screen.getByRole('button', { name: 'Task options' })).toBeInTheDocument()
  })

  it('installed the version the pin names', () => {
    // `github:f3r21/ravn-ui-kit#v0.4.0` — a tag, never a branch, so the pin carries a
    // version number to compare against. A branch pin would leave nothing to assert.
    const taggedVersion = appManifest.dependencies['@ravn/ui-kit'].split('#').at(-1)

    // Two silent states, one assertion. A `node_modules` left warm across a pin bump
    // serves the old build to every other test in this suite while the diff says the
    // new one; and a tag whose manifest disagrees with its own name is a kit release
    // nobody can identify from the consumer side. `npm ci` checks that the lockfile
    // satisfies `package.json`, but nothing anywhere checks that a tag called `v0.4.0`
    // contains version `0.4.0`.
    expect(`v${kitManifest.version}`).toBe(taggedVersion)
  })
})
