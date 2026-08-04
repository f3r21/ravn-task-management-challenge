# Migrating onto @ravn/ui-kit — plan and progress

Branch: `feat/consume-ui-kit` (off `dev`). This file is the persistent record of the
migration — read this first if picking the work back up in a new session; it captures
everything a fresh session needs without the exploration that produced it.

## Why "full replacement" isn't literal

`@ravn/ui-kit` (sibling repo at `/Users/99/Developer/RAVN/ravn-ui-kit`, consumed via a
`file:` dependency, **never modified directly** — it has unrelated uncommitted work on
its own `main`) has **no component at all** for: `Menu`, `Select`/`MultiSelect`/
`ListBox`/`Popover`, `Toast`, `EmptyState`, `ErrorBoundary`, or an icon set. Its `Modal`
has no `role` prop, so it can't produce `alertdialog` naming. These are hard facts from
the kit's exported API (`src/index.ts`), not scope choices — the components explicitly
kept below are **staying permanently**, not deferred.

**Migrates to the kit:** `Avatar`, `Button`/`TextButton`, `Skeleton`, `Tag`, the
non-alertdialog half of `Dialog` (→ `Modal`), `TaskCard`/`TaskListView`/`TaskTable`, the
create/assignee/estimate/label modals, the app shell/sidebar/top-nav/search-bar, the
board/list view switcher, tabs/segmented control, the datepicker.

**Stays on the app's own `src/ui/` components, permanently:** `Menu`, `Select`/
`MultiSelect`/`ListBox`/`Popover`, `ToastProvider`, `EmptyState`, `ErrorBoundary`, the
icon set, and `DeleteTaskDialog` specifically (needs `alertdialog`).

## Decisions already made (don't re-litigate these)

- **Tokens**: fully adopted the kit's `theme.css`; the app's own `src/styles/tokens.css`
  is deleted. One token layer, not a merge.
- **CSS import**: the kit's `package.json` maps `exports["./theme.css"]` to a
  nonexistent `dist/theme.css` (real file is `dist/ui-kit.css`) — can't be fixed
  upstream. `src/main.tsx` imports `../node_modules/@ravn/ui-kit/dist/ui-kit.css`
  directly (confirmed: the bare `@ravn/ui-kit/dist/ui-kit.css` specifier is blocked by
  Node's own exports-map enforcement — don't try it again, it won't resolve).
- **`ravn-ui-kit`'s `dist/`**: gitignored upstream, not committed. Running
  `npm run build` there is fine (regenerates only gitignored output) — already done
  once; re-run it if `dist/` looks stale, still without touching anything else there.
- **Hard-limited kit components**: use the kit's version where its limit already
  matches real app usage (e.g. `ViewSwitcher`'s 2-way lock — the app only has
  board/list); keep the app's own component where the kit's limit would drop real
  functionality (e.g. multi-assignee in create-task, if that turns out to be real usage
  — verify against `task-form-state.ts` in Phase 3, not yet checked).

## Token name mapping (for anything Phase 1+ discovers still using an old name)

| App's old name (retired) | Kit's name                                                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `surface`                | `surface-shell`                                                                                                                                 |
| `surface-raised`         | `surface-panel`                                                                                                                                 |
| `surface-overlay`        | `surface-overlay` (unchanged)                                                                                                                   |
| `text-primary`           | `main`                                                                                                                                          |
| `text-secondary`         | `muted`                                                                                                                                         |
| `brand`                  | `interactive`                                                                                                                                   |
| `danger`                 | `danger` (unchanged name, **value changes** — kit distinguishes brand-red from a separate, more saturated error-red; app used one red for both) |
| `accent-green`           | `secondary-4`                                                                                                                                   |
| `accent-amber`           | `tertiary-4`                                                                                                                                    |
| `accent-blue`            | `blue`                                                                                                                                          |
| `rounded-pill`           | `rounded-4`                                                                                                                                     |
| `rounded-card`           | `rounded-sm`                                                                                                                                    |
| `rounded-bar`            | `rounded-md`                                                                                                                                    |
| `rounded-sidebar`        | `rounded-lg`                                                                                                                                    |

## Progress

- [x] **Phase 0 — Unblock consumption.** Commit `e5bfc59` on `feat/consume-ui-kit`.
      `@ravn/ui-kit` added as a `file:` dependency (confirmed symlinked, confirmed
      `react-aria`/`react-stately` deduped to shared top-level copies, no nested
      duplicates). CSS import resolved. `tokens.css` deleted, 25 files remapped per the
      table above, base styles (dark `color-scheme`, body defaults, global focus ring)
      moved to a new `src/styles/base.css` built on the kit's token names. `npm run gate`
      passes (typecheck/lint/format/coverage all green, coverage 97.38%) — it exits 1 only
      because of 2 pre-existing test failures confirmed via `git stash` to already be
      broken on `dev` before this migration touched anything (`client.test.ts`'s
      "reports a response body that is not JSON", `board-page.test.tsx`'s mock-banner
      text assertion). Not caused by this work; worth a separate look, not a blocker here.

- [ ] **Phase 1 — Dialog/Modal (split treatment).** `TaskFormDialog` (create/edit) →
      kit's `Modal`; verify focus containment/restore in a real browser, not just jsdom —
      kit's `Modal` composes `useDialog`/`useOverlay`/`FocusScope` directly, not the app's
      `Overlay`-context + `useModalOverlay` split, so equivalence isn't guaranteed just
      because both use React Aria. `DeleteTaskDialog` **stays on the app's own `Dialog`**
      (kit's `Modal` can't do `alertdialog`) — this is permanent, not a TODO.

- [ ] **Phase 2 — `TaskCard`/`TaskListView`/`TaskTable`.** Write one adapter module
      (suggested: `src/features/board/task-card/to-kit-props.ts`) mapping the app's `Task`
      domain type to the kit's flattened props: keep the app's own `Task.id` for keys/
      routing (kit has no `id` field), flatten assignee to name/avatar strings, **compute
      `dueDateUrgency` yourself** (kit doesn't derive it from a date — reuse
      `DueDateBadge`'s existing logic) and pre-format `dueDateText` via the same
      `Intl`/UTC approach `CLAUDE.md` documents (do not reintroduce local-timezone
      formatting), map tag colors onto the kit's fixed 5-value `variant` enum
      (`primary`/`secondary`/`tertiary`/`neutral`/`blue`) once and reuse everywhere, omit
      or empty-array `metaBadges` (no comment/attachment/subtask data exists).

- [ ] **Phase 3 — `AddTaskModal`/`AssigneeModal`/`EstimateModal`/`LabelModal`.** First
      confirm against `task-form-state.ts`'s `TaskFormFields`: does create actually need
      multi-assignee/multi-label? If yes, `AddTaskModal` can't be used for create either
      (single-assignee/label only) and `TaskFormDialog` keeps its own form for create too,
      not just edit. Confirm `EstimateModal`'s hardcoded `[1,2,3,5,8]` scale actually
      matches the app's `pointEstimate` range before adopting it. `AssigneeModal`/
      `LabelModal` are likely straightforward — small mapping functions onto
      `{id, name, role?, avatarSrc?}` / `{id, text, variant?}`, not new domain types.

- [ ] **Phase 4 — Shell, navigation, layout.** Kit's `AppShell` (composes
      `ApplicationSidebar` + `TopNav`) replaces `AppLayout` + `AppSidebar` + `AppHeader`;
      `ViewSwitcher` replaces `BoardToolbar`'s radio-group; `SearchBar`/`TopNav` replace
      the header's search input. Verify `NavLink`/react-router active-state still works
      through `SidebarItem`'s `isActive` prop — lower risk than Phase 1/2, both sides use
      react-router here, not React Aria.

- [ ] **Phase 5 — Remaining low-risk primitives.** `Avatar`, `Tag`, `Skeleton` — direct
      swaps, no dedicated tests pin their exact output currently, verify visually against
      the kit's Storybook.

- [ ] **Test rewrite pass.** Update assertions in the affected test files to match new
      components' actual DOM/ARIA output where components were swapped. Leave assertions
      over the permanently-kept components untouched (`update-delete-task.test.tsx`'s
      menu/alertdialog/toast coverage — nothing about those changes).

## Verification checklist (every phase)

- `npm run gate` green (the 2 pre-existing failures noted above are the only expected
  exceptions — any _new_ failure is real and must be fixed before moving on).
- Real-browser check (not just jsdom) for anything touching focus, `inert`, or media
  queries — `CLAUDE.md` documents jsdom and the browser disagreeing on all three.
- Final pass: confirm nothing in the "stays permanently" list was touched, and no
  domain type (`Task`, `User`) was reshaped to fit the kit — only adapters were added.
