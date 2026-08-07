Finish an issue and hand it off. Takes the issue number as an argument.

> `ravn-ui-kit` keeps its own copy of this file, and the two are deliberately not the same one:
> its required check is `CI`, it gates on `npm run build:storybook` with a committed `dist/`, its
> preview is Storybook on GitHub Pages, and it releases by tag — none of which is true here.
> Port a rule across by hand; never copy the file.

0. **Re-read the issue's comments before anything else.**

   ```bash
   gh issue view <n> --json comments \
     --jq '.comments[] | "\n———— \(.author.login) · \(.createdAt) ————\n\(.body)"'
   ```

   You last read these when you claimed the issue, and this project amends issues by commenting.
   An amendment posted while you worked lands here — before the gate, before the commits, before
   a PR exists to argue with — rather than after review has started. That is what turns "this
   has to reach the lane immediately" into "this has to reach the lane by its next checkpoint",
   which is a far easier problem and removes most of the reason to interrupt a working lane.

1. `npm run gate` — green, zero failures.
2. Commit with conventional commits, one concern each, `Closes #<n>` in the final one.

   **That keyword will not close anything by itself here.** GitHub only auto-closes a linked
   issue when the pull request merges into the repository's _default_ branch — which is `main`,
   while every lane PR targets `dev`. The keyword still earns its place: it records the link on
   both the issue and the PR. But it closes nothing, so the issue is closed by hand — **step 8**,
   after the merge. Until someone does that, an open issue is not evidence of unfinished work.

3. Push the lane's branch — the one under review — then open or refresh its pull request into
   `dev`. (`dev` itself is the integration branch and the ruleset rejects a direct push to it.)

   **Before waiting on any condition, name who can satisfy it, and confirm it is not you.** If the
   answer is "the party waiting on me", that is a deadlock rather than a dependency — push, and
   say what is unresolved.

   The gatekeeper is not always a person. app-1 rebased #46 onto `dev` — correct, the PR read
   `BEHIND` — which left the branch ahead of its remote and made `--force-with-lease` the right
   push. A `permissions.deny` entry reading `Bash(git push --force*)` matched it, because the glob
   does not stop at the word, and `deny` blocks outright: no prompt, nothing the lane could
   approve, no way for it to edit the rule. The lane did everything right and stopped, holding the
   fix in an unpushed commit. **A gate whose release condition the blocked party cannot reach is
   the same bug whether the gatekeeper is a reviewer or a config file** — and the config-file kind
   is worse, because it produces no artifact and looks exactly like a lane that is working.

   - **Changes the reviewer is blocking on go to the branch under review. Net-new work goes to a
     follow-up issue.** That one line settles most of the argument about what belongs in this PR.
   - **A PR you want merged is not a draft.** Mark it ready when you hand off, or say in the
     handoff who is expected to lift it.

4. **If this PR adds or changes a check, prove it has teeth — by sabotage, on a real runner.**
   Break the thing the check protects, watch `Typecheck, lint, format, test, build` go red, record
   the **failing run URL** in the PR body, then restore. A check nobody has watched fail is
   unverified, however green it is.

   `CLAUDE.md`'s "When proving a test has teeth" covers the local version of this and its two
   traps, which still apply. This step is the CI one, and it is separate because local green is
   precisely what has lied before.

   **A red check is not automatically your defect** — the same point inverted. That rule says a
   _green_ check can be meaningless; this one says a _red_ one can be too. **Read which step
   failed before you read your diff:**

   ```bash
   gh run view <id> --json jobs \
     -q '.jobs[] | "\(.name): \(.conclusion)", (.steps[] | "  \(.number). \(.name) → \(.conclusion)")'
   ```

   If **no named workflow step executed**, it is infrastructure. Re-run once with
   `gh run rerun <id> --failed` and investigate only if it fails the same way twice. A failure
   _inside_ a step you can name is yours until proven otherwise.

   Infrastructure has two shapes, and the second does not look like a finding:

   - `Set up job → failure`, with nothing after it — GitHub could not resolve the actions
     (`Failed to resolve action download info: Service Unavailable`).
   - The **job line and no steps at all**, usually `cancelled`. A runner that was never acquired
     logs nothing, so the command prints one line and stops. **That silence is the diagnosis, not
     a broken command.**

   Both happened here on 2026-08-06 during a seven-hour Actions outage: run `31117113338` is the
   first shape, run `31120106399` the second. Take the URL _before_ re-running — `gh run view`
   reports only the latest attempt, so a successful re-run makes the failure look like it never
   happened. `gh run view <id> --attempt 1` is how you get it back.

   Then say in the PR body what that check **structurally cannot see** — the environment it runs
   in, the fixtures it reads, the buckets it sorts into. `npm run gate` went green over
   `URL.canParse`, which is absent from every browser in the build's target floor, because jsdom
   inherits Node's globals and so defines it in every test: not one test in the suite could have
   caught it (#58). The format hooks passed the same way, by running, exiting 0, and formatting
   nothing (#45).

   **When two layers enforce the same rule, check them against each other with a case each is
   meant to judge differently.** A hook's careful regex is worth nothing if a permission glob
   above it is coarser — that is the step 3 stall seen from the other side. List the commands one
   allows and the other denies; if that list is not empty and not deliberate, one of them is
   wrong. Which layers this repo has, and how they disagreed, is in `CLAUDE.md` under "Claude Code
   setup in this repo".

5. Post the handoff comment on the issue. **Use this shape exactly** — the next session reads the "Now true that wasn't" line and little else survives the boundary:

```markdown
### HANDOFF

- **Pushed as:** <branch @ sha, PR #n — the reviewer records the merge, you cannot>
- **Touched:** <files, one line>
- **Decided:** <decision → reason, one line each. Omit if none.>
- **Now true that wasn't:** <new export / new script / changed contract. The other lane reads this.>
- **Deliberately not done:** <scope cut → follow-up issue # if opened>
- **Next session should know:** <one sentence, or "nothing beyond the diff">
```

**"Now true that wasn't" means the four things that cross a lane boundary invisibly:** a **type**,
a **lint rule**, a **component contract**, or a **timing guarantee**. The lanes are cut by file, so
a shared file is not what bites — what bites is a document that became a string, so an allowlist
reading it stopped matching the ASTs it used to print; or a lint glob that started matching an
import another issue was still adding. A removed `await` is the timing kind: it changes when a
refetch settles relative to every assertion downstream. Naming which of the four you changed is the
whole value of the line.

That comment is also the only liveness signal a lane emits today, which is why it is posted even
when the answer is "nothing beyond the diff". Replacing that with something not dependent on
remembering is #54.

6. If this PR changed **how anyone else builds, tests or merges** — CI, the gate, the `@ravn/ui-kit` dependency contract, branch protection, or either of the issue commands (`/start-issue`, `/finish-issue`) — update `CLAUDE.md` **in the same PR**. Otherwise that knowledge lives only in an issue the other lanes will never read.
7. From the deploy onward, check the **Vercel preview URL**, not just localhost. Several defects in this repo's history were invisible against the mock.

**Scope any subagent you dispatch to the codebase.** Capability questions about the harness are
answered against its documentation, never by probing the runtime, and investigation never extends
to the harness's own tracking, permission or session machinery. Two subagents read "investigate
what the harness offers" as licence to do exactly that. If one returns a finding obtained that way,
**discard the finding**, not just the method — its provenance is no longer something you can
establish.

Then stop. Do not merge; the reviewer does that.

8. **After the merge, close the issue by hand.** This is the one step that happens on the far side
   of the stop above, and it belongs to whoever merged the PR.

   ```bash
   gh issue close <n> -R f3r21/ravn-task-management-challenge \
     --comment "Closed by <merge-commit-sha>, PR #<pr>."
   ```

   **Why this is not redundant with `Closes #<n>` in step 2.** The keyword fires only on a merge
   into the repository's _default_ branch. This repository's default is `main` and every lane PR
   targets `dev`, so the keyword has never closed anything here and never will while that is true.
   It is a link, not a mechanism.

   `ravn-ui-kit` is the control that proves the cause rather than merely asserting it: its PRs
   target `main`, so the identical keyword closes its issues automatically. **Do not port this step
   there** — it would double-close, and teach a rule that is false in that repository.

   ```bash
   gh repo view f3r21/ravn-task-management-challenge --json defaultBranchRef -q .defaultBranchRef.name   # main
   gh pr list -R f3r21/ravn-task-management-challenge --state merged --limit 20 \
     --json baseRefName -q '[.[] | select(.baseRefName == "dev")] | length'                              # 17 of 20
   ```

   **The comment is the point, not politeness.** An issue closed with no evidence cannot be told
   apart from one closed by mistake, and this project has already had a complete issue sit open
   because nobody could tell. On 2026-08-06 six issues stayed open after their PRs merged and were
   swept closed by hand within twelve seconds of each other — the batch is what identifies it as a
   person noticing, rather than six merges working.

   Changing the default branch to `dev` would also make the keyword fire, and is the wrong fix:
   `main` is what a reviewer of this submission clones, and GitHub shows the default branch first.
