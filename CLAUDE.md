# Working in this repository

Orientation for whoever picks this up next. Everything here is something the code does not
say for itself — the _why_ lives in comments and commit messages, and this file covers the
few things that live in neither.

## The contract

```bash
npm run gate     # typecheck → lint → format:check → coverage. This is the bar.
npm run build    # typecheck, then a production bundle. CI runs this too.
```

CI runs `gate` plus `build` on every pull request, not only those targeting `main` — a
stacked PR needs checks most, because its base has not landed yet.

`npm run schema:check` re-introspects the live API and fails if `schema.graphql` has
drifted. It is deliberately outside `gate`: it needs network access, and a red build
because someone else's server is having a bad afternoon is not a signal about this code.
It **checks**; updating the file is by hand, then `npm run codegen`.

## Conventions

- **No test ids.** Query by role, label and text — the things a user perceives. A test that
  reaches for a test id is testing the DOM, not the behaviour.
- **Comments explain why.** The density here is deliberate and high. That makes a stale
  comment worse than no comment, because a reader trusts it. If you change behaviour, grep
  for comments describing the old one — several rounds of that have already been needed.
- **No barrel files, named exports only.** A component lives inside the feature that uses
  it and moves to `ui/` when something else needs it.
- **Colour only through semantic tokens.** The raw ramp lives in `:root` and is not exposed
  to Tailwind, so `bg-neutral-4` is not a class that exists. Add a `@theme` name instead.
- **Server state is React Query's; client state is React's.** There is no GraphQL cache
  underneath it, on purpose — one source of truth per task.

## Traps this project has already paid for

Each of these was a real defect, most of them shipped and were caught later.

**jsdom and the browser disagree, in both directions.** jsdom does not reflect the `inert`
property to an attribute and does not evaluate media queries, so it will report a hidden
notification as reachable and show two navigation landmarks where a browser shows one. A
browser, conversely, reports focus dropped on `<body>` if you drive React Aria with
`element.click()` instead of real input — that is not the press sequence it listens for.
**Anything about focus or the accessibility tree gets checked in both.**

**Use `isInaccessible` for "can assistive tech reach this".** Hand-rolled `closest('[inert]')`
does not work here (see above), and the page behind a modal ends up `aria-hidden` rather
than inert anyway.

**React Aria's overlay hooks must be called inside `<Overlay>`.** `useModalOverlay` and
`useDialog` ask for focus containment through a context that `Overlay` provides to its
_children_. Call them in the component that renders `<Overlay>` and the request is dropped
silently — focus walks out of the modal and Escape stops working. `Dialog` is split into two
components for exactly this reason; do not flatten it.

**A React Aria toast is itself `role="alertdialog"`.** An unqualified
`getByRole('alertdialog')` matches both a toast and the delete confirmation. Name the dialog.

**Notifications need two things to survive a modal**, and either alone is useless: the
top-layer marker `useToastRegion` applies, _and_ being portalled to `document.body`. The
hiding pass walks out from the body and rejects whole subtrees, so an exempt node nested
inside a hidden ancestor is never reached.

**The `TZ` pin is a fixed offset.** `Pacific/Kiritimati` is UTC+14 with no daylight saving,
so it catches local-vs-UTC confusion loudly and cannot catch anything needing a gap hour. A
formatter that shifted by an hour in DST-gap zones shipped straight past it. Tests that care
switch zone with `vi.stubEnv('TZ', …)`.

**Live regions announce _changes_.** One that mounts with its text already inside announces
nothing. Three components made this mistake; all three now use a region that outlives the
states and swaps its text. If you add a loading or empty state, do the same.

**The mock is not a contract.** `FilterTaskInput` carries no descriptions, so every filter
rule in `src/mocks/task-store.ts` is that fake's own reading of the field names. `dueDate` in
particular is more permissive than an exact `DateTime` comparison. Tests over it pin the
fake; they do not prove the real API agrees.

## When proving a test has teeth

Break the code, watch the test fail, restore. Two rules learned the hard way:

- **Commit the fix first**, then sabotage. `git checkout <file>` to undo a sabotage takes any
  uncommitted fix with it. Use `git stash` to restore.
- **Target the right function.** A sabotage applied to `handleCreate` will not fail a test
  about `handleEdit`, and the passing test looks like a toothless one.

## Branch layout

Eight branches in a stack, one per step of the brief: `feat/01-project-setup` →
`feat/02-dashboard-ui` → `feat/03-connect-api` → `feat/04-create-task` →
`feat/05-update-delete` → `feat/06-search-filter` → `feat/07-profile` →
`feat/08-readme-polish`.

Each PR targets the branch below it. A fix belongs on the branch that **introduced** the code,
and its test on the earliest branch where the test can be written — those are not always the
same branch. After changing a branch, rebase its descendants and re-run `gate` at each tip;
`gate` must be green at all eight, not only the top.

Note that a comment can be _true_ on one branch and false on a later one — several
"stale comment" fixes had to be applied further up the stack than the file's owner, because
that is where the second caller or the changed behaviour arrives. Check with `git log -S`
before assuming.

## Not built

Drag-and-drop (bonus #1). The design is not blocked on anything: every hook needed is already
installed. See the README's bonus section for why it was left out.
