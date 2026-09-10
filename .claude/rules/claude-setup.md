---
name: claude-setup
description: What the hooks, the deny list and the lane provisioner actually enforce here, and which layers only look like they do.
paths:
  - '.claude/**'
  - 'scripts/hooks.test.mjs'
  - '.github/**'
---

# Claude Code setup in this repo

`.claude/hooks/` the build depends on: `scripts/hooks.test.mjs` runs inside `npm run gate`, so
deleting either script fails the build. `format-file.sh` (`PostToolUse`) runs ESLint and Prettier
over the file just edited. `block-dangerous.sh` (`PreToolUse`) refuses a recursive forced `rm`
aimed at `/` or `$HOME`, a plain force push, and a download piped into a shell.

**Both read their payload as JSON on stdin, and that is the whole point of the test.** The pair
that first shipped did not: the formatters interpolated a `$FILE_PATH` that Claude Code never
sets, and the safety hook read `$1` when a `PreToolUse` hook is passed no positional arguments.
Installed, running, exiting 0, and completely inert, which is a state nothing in `gate` could
distinguish from a working hook. A denial is also a `permissionDecision` object on stdout, never
a non-zero exit: any exit code other than 2 is a non-blocking error, so the old `exit 1` would
have printed its refusal and then run the command.

## Three layers refuse a force push and they are not the same rule

`block-dangerous.sh` excludes `--force-with-lease` and `--force-if-includes` on purpose and says
why. `permissions.deny` in `.claude/settings.local.json` is a glob list. The repository ruleset
rejects the push server-side on `main` and `dev`.

The middle layer is per-machine and **gitignored**, so it drifts out of agreement with the hook
and nothing in the repository can see that it has. A `Bash(git push --force*)` glob there matched
`--force-with-lease`, because the glob does not stop at the word, and `deny` offers no prompt, so
a lane that had rebased correctly could not push at all and simply stopped. The coarser layer
wins silently and its blast radius is every session on the machine rather than this repository.

**The glob layer is weaker than it reads, and only one of the two layers can be fixed from here.**
Claude Code matches Bash rules per subcommand, splitting on `&&`, `||`, `;`, `|`, `|&`, `&` and
newlines, so a deny rule that itself contains a separator can never match one. That is why
`Bash(curl * | sh*)` and its siblings in `settings.local.json` are very likely inert, and why the
hook is what actually stops a piped download. The same reading cuts the other way for the
force-push globs: they hardcode the literal two-token prefix `git push`, so `-C <path>` between
those two words defeats every one at once, and `Bash(git *)` then positively allows the result.
The hook missed it too until #63, as it missed `git push --force;` and the parenthesised twin.
That side is now closed and pinned in `scripts/hooks.test.mjs`. The glob side is not and
structurally cannot be, since `settings.local.json` is gitignored, so no change to it lands in a
PR. **Treat `block-dangerous.sh` as the layer that has to be right.**

## The deny list is friction, not a boundary

`permissions.deny` in `settings.json` keeps `package-lock.json`, `coverage/`, `dist/` and
`node_modules/` out of context. `.claudeignore`, which used to claim that job, is not a Claude
Code feature and never excluded anything.

**A `Read()` rule matches the command, not the file.** Measured here, on paths these rules name:

| probe                                                  | result  |
| ------------------------------------------------------ | ------- |
| `grep -c ... node_modules/@ravn/ui-kit/dist/theme.css` | refused |
| `grep -c ... ./package-lock.json`                      | refused |
| `ls -la coverage/<file>`                               | refused |
| `cat ./dist/<file>`                                    | refused |
| `node -e` reading `./package-lock.json`                | allowed |
| `node -e` reading a file under `node_modules/`         | allowed |
| the **Write** tool, to a path under `coverage/`        | allowed |
| the **Write** tool, to a path under `dist/`            | allowed |

Every row is a probe someone ran. `cat` is in that table because an earlier draft asserted it
without probing it. The two `Write` rows are two different deny rules, so "does not reach
`Write`" rests on two measurements rather than one. `Edit` and `Glob` are untested and this file
claims nothing either way.

So it stops a shell reader whose command shape it recognises. It does **not** stop a program that
opens the path itself, and it does not reach `Write`. **Two recipes in these rules deliberately go
around it and are not violations:** `node -e 'require("./package-lock.json")'` to read the
`resolved` field, and `node_modules/@ravn/ui-kit/dist/index.d.ts` as the local reference for what
a kit component does. Both are load-bearing, and the deny list's value is stopping a whole
dependency tree arriving in context by accident.

## The rituals hold rules that exist nowhere else

`.claude/commands/`: `/gate` and `/schema-check` are thin wrappers over npm scripts.
`/rebase-stack` describes a stacked layout that no longer exists. **`/start-issue` and
`/finish-issue` are neither.** They are where this project's process rules live and for most of
them the only copy in the repository: deadlocked gates, stale readings, checks never observed
failing, red checks that are somebody else's outage, the four couplings that cross a lane
boundary invisibly, and the scope of a dispatched subagent. A rule surviving only in a transcript
is a rule already lost.

**`/start-issue` cuts the branch and refuses when it cannot do so safely.** It derives the base
(`origin/dev` if the repo has one, else the default) then **stops** if the branch you stand on
has an open PR, rather than extending work a reviewer is already looking at. Branches are
`<type>/<issue>-<slug>` and are cut `--no-track`, so an unpushed branch reads as unpushed rather
than inheriting an upstream it never earned.

**Issues are amended by commenting, so reading an issue means reading its comments.** Neither
human-readable `gh` view shows both: `gh issue view <n>` prints the body without comments and
`--comments` prints the comments and suppresses the body. The rituals carry the
`--json body,comments` form that returns both in one call, and it is one command precisely
because two can be half-followed. Where a comment contradicts the body, the comment is newer and
wins.

## The ruleset, and what it costs

A repository ruleset covers `refs/heads/main` and `refs/heads/dev`: changes arrive by pull
request, the `Typecheck, lint, format, test, build` check must be green, no force-push, no
deletion. `bypass_actors` is empty on purpose, so the owner account is subject to it too. Before
this, CI was decorative and a dependency PR merged straight into `main` unreviewed.

- **It is a ruleset, not classic branch protection.** `gh api .../branches/main/protection`
  answers `404 Branch not protected` and that is not the answer to the question. Read it back
  with `gh api repos/f3r21/ravn-task-management-challenge/rulesets`.
- **That check is the only required one.** Dependency review and the e2e workflow report without
  blocking, deliberately: promoting a check to required is a ruleset edit with the whole
  repository as its blast radius, and a required check that cannot report deadlocks every merge.
- **Approvals are deliberately not required.** There is one account and GitHub forbids approving
  your own PR, so requiring even one deadlocks the repository. Review is a
  `gh pr review --comment` from a separate session, and the PR template's
  `Second-session review:` line is the only record that it happened.
- **The check must be green against current `dev`.** Two lanes land concurrently, so without this
  a run goes green describing a merge base that no longer exists. The cost is real and intended:
  every merge into `dev` staleness-marks the other lane's open PR. A PR at
  `mergeStateStatus: BEHIND` is this rule, not a broken build.

Merged branches delete themselves, so a branch still on the remote means unmerged work.

## The lane provisioner

`scripts/new-lane.sh <lane-name> [branch]` exists because doing it by hand went silently wrong
four times: `.claude/skills/` is gitignored so a lane starts with none,
`.claude/settings.local.json` and `.env` are gitignored so a lane starts without either, and an
MCP server can resolve to the wrong scope. Every one of those looks like a working lane.

The path derives from `git rev-parse --git-common-dir`, never from the working directory:
`../wt/<lane>` is the obvious spelling and is wrong from inside a worktree, where `..` is already
the worktree root, so it lands at `wt/wt/<lane>`. `settings.local.json` is **copied, never
regenerated**, because it holds approvals a human accumulated and a fresh guess silently drops
them. The run ends with `npm run gate` and a checklist read back off the provisioned worktree,
because a lane that starts on a red tree attributes the failure to its own first change. Lanes
are cut from `origin/dev` here and `origin/main` in the kit, which is the one line a copy between
the two repos gets wrong.

**Nothing enforces `gate` before a commit.** Running it is on you. It is enforced before a merge,
but finding out in CI costs a push and a five-minute round trip to learn what four minutes
locally would have told you.
