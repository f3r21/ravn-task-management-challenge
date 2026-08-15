# Handoff — CI date bomb blocking every open PR, and a comment audit that came back empty

- **From:** red · session `0a7169de-4c21-471c-9fbc-e205c6654cda`
- **Repo:** `/Users/99/Developer/RAVN/ravn-task-management-challenge`
- **Branch at handoff:** `chore/opt-into-lane-orchestration` @ `f03e9df`, working tree clean
- **Written:** 2026-08-14

## How this started

The user asked, in order:

1. "Do we have any comments in our PRs, or in the gh repo in general?"
2. "Mentor Steven told me to check — really nothing?" (i.e. distrust the first answer, look wider)
3. "Maybe we haven't done a step in the repo — investigate if we haven't sent or published something."

Question 3 is where the real finding is. **Nothing has been fixed or committed.** The whole session
was read-only investigation.

## Finding 1 — the blocker: a date-dependent test has CI red for a three-day window

`PR #165` is `BLOCKED` with a failing `Typecheck, lint, format, test, build`. **The failure is not in
that PR's diff.**

Failing test:

```
/Users/99/Developer/RAVN/ravn-task-management-challenge/src/features/board/update-delete-task.test.tsx:208
  expect(within_.getByText('14 August, 2026')).toBeInTheDocument()
```

Mechanism, fully traced:

- `/Users/99/Developer/RAVN/ravn-task-management-challenge/src/mocks/task-fixtures.ts:30` seeds
  Slack with `dueDate: '2026-08-14T00:00:00.000Z'` (same value again at `:82`).
- `formatDueDate` in
  `/Users/99/Developer/RAVN/ravn-task-management-challenge/src/lib/due-date.ts:96-108` returns the
  absolute `"14 August, 2026"` string **only** when `daysLeft` is not `0`, `1`, or `-1`. Inside that
  band it returns `Today` / `Tomorrow` / `Yesterday`.
- These component tests render against the **real** clock. Nothing pins time here — `setSystemTime`
  appears only in `src/lib/use-current-day.test.ts` (`grep -rn "setSystemTime" src/`).

Derived window, and CI history matches it exactly:

| date               | `daysLeft` | card renders      | gate                          |
| ------------------ | ---------- | ----------------- | ----------------------------- |
| Aug 12             | 2          | `14 August, 2026` | green — all 5 Dependabot runs |
| Aug 13             | 1          | `Tomorrow`        | **failed** — PR #165          |
| **Aug 14 (today)** | 0          | `Today`           | **fails**                     |
| Aug 15             | −1         | `Yesterday`       | **fails**                     |
| Aug 16             | −2         | `14 August, 2026` | self-heals                    |

Re-derive:

```bash
gh run list --repo f3r21/ravn-task-management-challenge --workflow ci.yml --limit 8 \
  --json headBranch,conclusion,createdAt --jq '.[] | "\(.createdAt) | \(.headBranch) | \(.conclusion)"'
```

Every green run is dated Aug 12 or earlier; the only Aug 13 run failed. **Aug 14 is now testable —
a fresh run today should still fail, with the card rendering `Today`.** That is the cheapest
confirmation available and has not been run yet.

### The consequence that is easy to miss

The five Dependabot PRs (#160–#164) report `mergeStateStatus: CLEAN`, but that green is from
**Aug 12**. The repository ruleset sets `strict_required_status_checks_policy: true`, so merging any
of them requires updating the branch and re-running — which fails today. **All six open PRs are
frozen** until Aug 16 or until the test is fixed.

Second instance of the same shape, currently harmless:
`/Users/99/Developer/RAVN/ravn-task-management-challenge/src/features/board/board-column.test.tsx:341`
expects `'20 July, 2026'`. Safe now (long past), was a bomb around Jul 19–21.

### The proposed fix (agreed in principle, NOT implemented)

Pin the clock with `vi.setSystemTime` around the two component tests that render a card against the
real clock. **Rejected alternative:** moving the `2026-08-14` fixture date — that only relocates the
bomb to a different week. No issue has been filed and no code changed.

Note `npx vitest` cannot run in this checkout as-is: `node_modules` is stale/missing
(`Cannot find package '@tailwindcss/vite'`). Needs `npm ci` before local reproduction. CI was used as
the independent instrument instead.

## Finding 2 — the comment audit: genuinely nothing external

Checked exhaustively, with positive controls (per `.claude/rules/figures.md` — a negative needs a
control that could have returned the other answer):

- Comment authors in this repo: `f3r21` 227, `vercel[bot]` 88, `dependabot[bot]` 1. No third party.
- Inline PR review comments repo-wide: **0**. Controlled — PR #44 shows `reviews=7, comments=0`, so
  the endpoint works.
- Review bodies: 26, **all `f3r21`**. (This object class is returned by neither `--json comments` nor
  `pulls/comments` — it was missed on the first pass.)
- Notifications: 50 unread, all `author`/`state_change`. Zero `mention` / `comment` /
  `review_requested`.
- `ravnhq` org sweep: `gh search issues --owner ravnhq --involves f3r21 --include-prs` returns only
  the 9 PRs the user authored. Positive control returned 9.

**The one live lead:** the user has **9 open, entirely unreviewed PRs in
`ravnhq/frontend-nerdery-checkpoints`** — #13, #15, #17 (W1), #54, #55, #56 (W2), #81, #82, #83 (W3).
Control proves mentors are active in that repo: `franlopz`, `fabianespinoza-ravn`, `CAMIANAIS` left
inline comments on PRs #32 and #44 in late July — just never on these nine. If "Steven" meant
anything, this is the most likely referent. **Untouched; no nudge posted.**

**Known blind spot:** `gh api orgs/ravnhq/members` returns `[]` and `/user/orgs` is empty — the token
has no org visibility, so only _public_ `ravnhq` repos were searched. Anything in a private org repo,
Slack, or email is invisible to this investigation. No `steven` account was found, but that search
ran through the same blind endpoint, so it is not evidence.

## Finding 3 — loose ends, all benign (verified, no action needed)

- `feat/ui-kit-task-card` — 6 commits, never pushed, dated 2026-08-04. `git cherry origin/dev` marks
  all six `+`, but this is PR #47's head, closed as `[parked]`; the work landed reworked via #109/#117
  (`to-kit-props.ts` is in `dev` at 100% coverage). **Dead branch, not lost work — safe to delete.**
- `fix/assert-graphql-stays-out-of-src` — 1 unpushed commit, `git cherry` marks it `-` (already in
  `dev` via merged PR #55). **Safe to delete.**
- `dev` → `main` fully promoted: `git rev-list --left-right --count origin/main...origin/dev` → `20 0`.
- Deployment healthy: homepage 200, and `/api/graphql` correctly rejects an unlisted operation with
  `"This endpoint does not serve that operation."` (the #36 allowlist working).
- No collaborators, no pending invites — repo is public, so a reviewer needs none.

## Next steps, in the order I would take them

1. **Confirm today's prediction** — trigger or re-run CI on #165 and check the card now renders
   `Today`. One command, and it is the positive control for the whole diagnosis.
2. **File an issue** for the date-dependent test, per `/start-issue`. Both sites:
   `update-delete-task.test.tsx:208` and `board-column.test.tsx:341`.
3. **Fix with `vi.setSystemTime`**, test-first — sabotage it to prove the new test can fail
   (`.claude/rules/figures.md`, "Run the probe where it should succeed, too").
4. **Unblock the queue** — once green, update-branch and merge #160–#164, then #165.
5. **Ask the user about the 9 checkpoint PRs** — whether to nudge, and whether Steven meant those.
   Do not post to `ravnhq` without asking; that is outward-facing.

## Project rules that bear on this work

- `CLAUDE.md` — "Branch layout": all work branches off `dev`, PRs into `dev`; `Closes #N` is inert
  here, issues close by hand.
- `.claude/rules/figures.md` — every figure carries its command; a piped command discards exit status
  (`$pipestatus[1]` in zsh); a negative needs a positive control. This session followed it and it
  caught two of my own blind negatives (a zsh glob error reported as "no matches", and an
  uncontrolled inline-comment zero).
- Nothing enforces `gate` before commit — run it locally.
