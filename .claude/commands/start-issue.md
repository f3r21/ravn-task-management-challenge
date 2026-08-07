Start work on a GitHub issue. Takes the issue number as an argument.

> `ravn-ui-kit` keeps its own copy of this file, and the two are deliberately not the same one:
> it rebases onto `main`, its required check is `CI`, and its preview is Storybook on GitHub
> Pages, where this repo uses `dev`, `Typecheck, lint, format, test, build`, and a Vercel preview
> URL. Port a rule across by hand; never copy the file.

Run these in order, in **this worktree only** — never in the primary checkout, which other
sessions have open and which `git worktree list` will name for you:

```bash
git fetch origin --prune
git status --porcelain                     # must be clean before anything below

BASE=$(git rev-parse --verify --quiet origin/dev >/dev/null && echo dev \
       || gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
HERE=$(git branch --show-current)          # empty on a detached HEAD — see below
gh pr list --head "${HERE:?detached HEAD: check out a branch first}" \
           --state open --json number,isDraft     # anything but `[]` → STOP, do not continue

git switch -c <type>/<n>-<slug> --no-track "origin/$BASE"   # new issue…
git switch <type>/<n>-<slug>                                # …or this, if it already exists

git rebase "origin/$BASE"                  # no-op on a branch just cut; catch-up on one that existed
git log --oneline HEAD@{1}..HEAD           # what landed while you were away
git diff --name-only HEAD@{1}..HEAD        # re-read ONLY these files
npm run gate                               # prove the tree is green BEFORE you touch it
```

That last step matters: if the gate is already red, the failure is not yours, and you need to know that before attributing it to your own change.

**Create the branch; nothing else does.** This ritual used to rebase whatever happened to be
checked out, and judgement covered the gap every time. The failure it invites: a lane finishes on a
branch whose PR is open and reviewed, is handed the next issue, and commits it there — the
reviewer's PR silently grows unrelated work, and repeat it twice more and three issues share one
PR. Four rules, in the order the commands above apply them:

- **The base is derived, never assumed:** `origin/dev` if this repo has one, otherwise the repo's
  own default branch. That resolves to `dev` here and to `main` in `ravn-ui-kit`, which has no
  `dev` at all (`gh api repos/f3r21/ravn-ui-kit/branches/dev` → 404). Probing `dev` first is the
  load-bearing half: this repo's _default_ branch is `main` too, so asking `gh repo view` alone
  would cut every lane branch from the promotion branch instead of the integration one.

- **An open PR on the branch you are standing on stops the ritual.** Not a warning — stop, and say
  which PR. Whether the next issue belongs in a PR already under review is the reviewer's call, and
  the lane is the one party that cannot make it. Draft counts: a draft still ends up as one PR
  carrying two issues. Note `git branch --show-current` prints _nothing_ on a detached HEAD, and
  `gh pr list --head ''` then matches every open PR in the repo rather than none — so without the
  `${HERE:?}` guard the check would "refuse" for a reason that has nothing to do with your branch.

- **Re-running for an issue already in progress switches; it never re-cuts.** If the branch exists,
  locally or on `origin`, `git switch` onto it and carry on. `git switch -C … "origin/$BASE"` is
  the version that looks idempotent and is not: it moves the ref back to the base and orphans every
  commit already on the branch. If git refuses the switch because the branch is checked out in
  another worktree, that refusal is the right answer — another lane holds it, and the fix is a
  conversation, not a flag.

- **Name it `<type>/<issue>-<slug>`** — e.g. `docs/70-start-issue-creates-the-branch` — so that
  branch → issue is `^[a-z]+/([0-9]+)-` and not something only the lane that cut it knows.

`--no-track` is not tidiness. Without it, cutting from a remote-tracking ref sets the new branch's
upstream to `origin/$BASE`, so `git rev-list --count @{u}..HEAD` answers `0` on a branch that has
never been pushed anywhere. `lane-status.py` reads exactly that command and distinguishes "never
pushed" from "nothing to push" **only** by whether it answers at all — an upstream it did not earn
turns "branch has no upstream — never pushed" into a silent `0 unpushed`, which is the alarm that
exists to catch work about to die with a worktree. Switching onto a branch that already exists on
`origin` is the opposite case and correctly does track it: it has been pushed.

**The naming rule is a change, not a description of practice.** Of this repo's 19 branches exactly
one carries an issue number, and it is the one cut for the issue that added this paragraph:

```bash
git for-each-ref --format='%(refname:short)' refs/heads | grep -cE '^[a-z]+/[0-9]+-'
```

The `<type>/` prefix survives because every branch here already has one and `int/` in particular
carries meaning (`int/foundation-app-code` is an integration branch, not an issue). The number goes
_after_ the prefix so listings still group by kind. The cost is that the number has to stay
**optional** — integration branches, `main` and `dev` answer to no issue — so `lane-status.py` or
any future selector must read "no match" as "not an issue branch" and never as an error. Branches
already cut keep their names; the mapping starts working from here on, not retroactively.

Then read the issue — **one command**, because two can be half-followed:

```bash
gh issue view <n> --json body,comments \
  --jq '.body, (.comments[] | "\n———— \(.author.login) · \(.createdAt) ————\n\(.body)")'
```

**Neither human-readable view shows you the whole issue.** `gh issue view <n>` prints the body and
no comments; `--comments` prints the comments and suppresses the body. They are mutually exclusive,
so either one alone leaves you reading half of it. Confirm it rather than believing it — on an
issue with comments, the default view contains the body's opening marker and `--comments` contains
it zero times:

```bash
gh issue view <n> | grep -c 'You are starting cold'              # 2 — body present
gh issue view <n> --comments | grep -c 'You are starting cold'   # 0 — body GONE
```

The JSON form above returns both halves in one call. It omits title, labels and `blocked-by`, so
run plain `gh issue view <n>` as well when you want those — just never rely on it alone.

**The body is your briefing; the comments amend it.** This project's convention is to correct an
issue by commenting rather than rewriting it — the rule is that being corrected twice on the same
point is a specification defect, and the fix is posted below. So where a comment contradicts the
body, **the comment is newer and wins**, and the correction you most need is more likely under the
body than in it. The `--jq` render prints each comment's `createdAt`, so the ordering is explicit
rather than inferred from position.

**This ritual, not clearing context, is what fixes staleness.** Clearing a session does not update your worktree; rebasing does. Two lanes run concurrently in this repo, so something almost certainly landed while you were away — the diff above is how you find out which of your assumptions just expired.

**Your own reads go stale the same way, and nothing rebases those.** Two rules, both already paid
for once:

- **A figure you read more than a few tool calls ago is stale — re-run the command, do not recall
  the number.** This lane twice reported a config value "still backwards" out of state that had
  already changed by the time it said so.
- **A claim confirmed by whoever made it is not confirmed.** Confirmation has to come from a
  command whose output would _differ_ if the claim were false, so say what it would have printed
  in the failing case before you run it. If you cannot answer that, the command cannot
  distinguish the case you picked it to test — and running a second one just like it does not
  help, which is exactly how a claim about a commit got "confirmed" twice and was still wrong.

Every figure you go on to write down travels with the command that re-derives it. That is #51, and
it starts applying at the first number you quote, not at the PR body.

Read `CLAUDE.md` before writing code, especially "traps this project has already paid for".

Finally, `/rename` this session to `<lane>/#<issue>` so it can be found and `--resume`d later — particularly for a post-review round, where you want the context you already have rather than a cold start.
