Start work on a GitHub issue. Takes the issue number as an argument.

> `ravn-ui-kit` keeps its own copy of this file, and the two are deliberately not the same one:
> it rebases onto `main`, its required check is `CI`, and its preview is Storybook on GitHub
> Pages, where this repo uses `dev`, `Typecheck, lint, format, test, build`, and a Vercel preview
> URL. Port a rule across by hand; never copy the file.

Run these in order, in **this worktree only** — never in the primary checkout, which other
sessions have open and which `git worktree list` will name for you:

```bash
git fetch origin --prune
git status --porcelain                     # must be clean before rebasing
git rebase origin/dev                      # or the integration branch you are on
git log --oneline HEAD@{1}..HEAD           # what landed while you were away
git diff --name-only HEAD@{1}..HEAD        # re-read ONLY these files
npm run gate                               # prove the tree is green BEFORE you touch it
```

That last step matters: if the gate is already red, the failure is not yours, and you need to know that before attributing it to your own change.

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
