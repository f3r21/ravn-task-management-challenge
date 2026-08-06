Start work on a GitHub issue. Takes the issue number as an argument.

Run these in order, in **this worktree only** — never in the primary checkout at
`/Users/99/Developer/RAVN/ravn-task-management-challenge`, which is shared:

```bash
git fetch origin --prune
git status --porcelain                     # must be clean before rebasing
git rebase origin/dev                      # or the integration branch you are on
git log --oneline HEAD@{1}..HEAD           # what landed while you were away
git diff --name-only HEAD@{1}..HEAD        # re-read ONLY these files
npm run gate                               # prove the tree is green BEFORE you touch it
```

That last step matters: if the gate is already red, the failure is not yours, and you need to know that before attributing it to your own change.

Then `gh issue view <n>` and read the whole body. The issue is your complete briefing — it is written for someone with no prior context, which is what you are.

**This ritual, not clearing context, is what fixes staleness.** Clearing a session does not update your worktree; rebasing does. Two lanes run concurrently in this repo, so something almost certainly landed while you were away — the diff above is how you find out which of your assumptions just expired.

Read `CLAUDE.md` before writing code, especially "traps this project has already paid for".

Finally, `/rename` this session to `<lane>/#<issue>` so it can be found and `--resume`d later — particularly for a post-review round, where you want the context you already have rather than a cold start.
