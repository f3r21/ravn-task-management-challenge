---
name: Lane task
about: A unit of work for a session that starts with no prior context.
title: ''
labels: ''
assignees: ''
---

> **You are starting cold.** This issue is your entire briefing. Assume no prior session context.

<!--
Write for someone with none of your context, because that is who arrives. Everything they need
to act has to be in this body — a link to a closed issue, a Slack thread or a transcript is not
a briefing.
-->

## What is wrong today

<!--
The observable problem, not the proposed fix. What breaks, what is missing, or what is true that
should not be — and how someone would notice.
-->

## Why it matters

<!--
What this costs while it stands. If the answer is "nothing yet", say so and say what would change
that — an issue can be worth filing and not worth doing now.
-->

## Figures

<!--
REQUIRED. Every number quoted anywhere in this issue goes here with the command that re-derives
it. If there are none, replace this whole section with the single line:

    No figures in this issue.

A reader meeting a bare number has to decide whether to trust it. A reader meeting a number and
its command runs the command — a two-second check instead of a judgement call.

Run each command and paste what it printed BEFORE filing. A command that does not reproduce its
figure is worse than no command, because the number then looks checked. Naming a script is not
citing a command: `check-schema.mjs` is a file, `npm run schema:check` is a command.

Bare path:123 citations, issue references, versions and dates are locations and names, not
measurements — they need no command. If a figure genuinely cannot be re-derived, write "no
command; observed once on <where>" instead of leaving it bare.

Delete the example row.
-->

| Figure                       | Command that re-derives it                                        |
| ---------------------------- | ----------------------------------------------------------------- |
| _example — delete this row._ | `npm run gate 2>&1 \| tail -6 ; echo "exit=$pipestatus[1]"` (zsh) |

<!--
The `exit=` is load-bearing. A pipe reports `tail`'s status, so the bare form cannot tell a
passing gate from a failing one, and the coverage table prints the same percentages either way.
On bash the tail of that command is `echo "exit=${PIPESTATUS[0]}"`. See `.claude/rules/figures.md`.
-->

## What to build

<!--
The shape of the change, and the constraints that are not negotiable. Name the files if you know
them. If part of this is deliberately out of scope, say which part and why — a scope note
prevents the reviewer and the implementer from discovering the disagreement at review time.
-->

## Verification

<!--
Ask for the command, not just the number.

Write each step as "run X, which should print Y" rather than "report the before and after".
The second phrasing puts the whole burden of producing a figure on whoever does the work, while
this issue's own numbers stay unsourced — and it leaves the reviewer no way to repeat the check.

If this issue adds or changes a check, the last step is proving it can fail: break what it
protects, watch CI go red, record the failing run URL, restore.
-->

1.
2.
