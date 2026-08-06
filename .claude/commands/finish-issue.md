Finish an issue and hand it off. Takes the issue number as an argument.

> `ravn-ui-kit` keeps its own copy of this file, and the two are deliberately not the same one:
> its required check is `CI`, it gates on `npm run build:storybook` with a committed `dist/`, its
> preview is Storybook on GitHub Pages, and it releases by tag — none of which is true here.
> Port a rule across by hand; never copy the file.

1. `npm run gate` — green, zero failures.
2. Commit with conventional commits, one concern each, `Closes #<n>` in the final one.

   **That keyword will not close anything by itself here.** GitHub only auto-closes a linked
   issue when the pull request merges into the repository's _default_ branch — which is `main`,
   while every lane PR targets `dev`. The keyword still earns its place: it records the link on
   both the issue and the PR. But **the reviewer closes app issues by hand on merge**, and until
   they do, an open issue is not evidence of unfinished work.

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
