---
name: sabotage
description: Proving a test has teeth; commit before you sabotage, restore by filename, and never use git stash in a worktree.
paths:
  - 'scripts/**'
  - '.claude/commands/**'
---

# When proving a test has teeth

Break the code, watch the test fail, restore. Three rules learned the hard way.

**Commit the fix first, then sabotage.** `git checkout <file>` to undo a sabotage takes any
uncommitted fix with it. Committing first removes that hazard.

"First" is not the whole of it: **the restore discards whatever is uncommitted in that file at
the moment you run it, including anything you added after the sabotage.** A lane lost a line it
had written five minutes into a sabotage, because the line lived in the file it then restored. So
before restoring, everything in that file you intend to keep must already be committed, not just
the fix you started with. If you find yourself improving the code mid-sabotage, which is common
because you are staring at it, commit that before you restore, or you are choosing between the
improvement and the proof.

**Restore with `git checkout -- <the file you sabotaged>`**, naming the file rather than `.`.
Once the fix is committed this is precise, local, and touches nothing another lane can see.

**Do not reach for `git stash` here.** `refs/stash` lives in the common git dir, so the stash
stack is shared by every worktree, and this repo runs several lanes in parallel worktrees. The
ref itself is the proof, next to one that is per-worktree:

```bash
git rev-parse --git-path refs/stash   # .../ravn-task-management-challenge/.git/refs/stash
git rev-parse --git-path HEAD         # .../.git/worktrees/<lane>/HEAD
```

Two lanes following this procedure at once push onto one stack, and a bare `git stash pop` in one
worktree restores the other's work into it. A sabotage is the worst possible thing to restore by
accident: it is designed to break something and it arrives looking like your own uncommitted edit.

**For uncommitted single-file work, copy the file rather than stashing it.**
`cp <file> /tmp/<file>.bak` and copy it back. That has no shared namespace and no ordering, so
the hazard is removed rather than managed. Keep `git stash` for the genuinely multi-file case.

When you must use the stack, **resolve entries by matching the branch name in `git stash list`,
never by index**, and that applies to `drop` as much as `pop`. `pop` is the loud failure, `drop`
is the silent one, and the incident behind this rule was a lane dropping its own stashes. Its
three were `stash@{0}` to `{2}` and another lane's was `stash@{3}`, so index-based drops happened
to be safe; the other interleaving destroys the foreign entry with nothing reporting it. Match on
the branch git records, not on a convention you adopted: git puts it in the subject either way,
`WIP on <branch>:` for a bare stash and `On <branch>:` with `-m`.

**Target the right function.** A sabotage applied to `handleCreate` will not fail a test about
`handleEdit`, and the passing test looks like a toothless one.

All three are about the local loop. The CI counterpart is the sabotage-on-a-real-runner step of
`/finish-issue`, which is where that procedure lives.
