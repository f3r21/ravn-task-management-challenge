---
name: figures
description: Every number in an issue, commit message, PR body or CLAUDE.md carries the command that re-derives it.
---

# Figures Carry Their Command

## The rule

**Every figure you write down travels with the command that produces it.** Issues, commit
messages, PR bodies, `CLAUDE.md` — anywhere a number is asserted, the next reader gets the means
to check it in one paste.

```markdown
- 284 tests, 97.63% statements — `npm run gate 2>&1 | tail -6`
- 46 non-icon components — `grep -c '^export declare' dist/index.d.ts`
```

## Why

A lane meeting a bare number has to decide whether to trust it. A lane meeting a number **and its
command** runs the command. That converts a judgement call into a two-second check, and it is the
difference between a claim and a measurement.

This is not hypothetical bookkeeping. In one session thirteen orchestrator errors reached the
lanes and **six were unverified figures** — a size given as "100–140 kB" that was ~20 kB, "36
components" that were 46, "247 tests" that were 284, and two figures that appear nowhere in
tracked source at all. Every one was caught, and every one cost a round trip. One review pass on
a single PR opens by correcting six byte figures at once, each wrong by exactly the same 758
bytes, because a token had been inlined into the bundle being measured.

## What counts

- **A command must reproduce the figure as written.** A command that returns something else is
  **worse than no command**, because the number now looks checked. Run it before you paste it.
- **Naming a script is not citing a command.** `check-schema.mjs` is a file; `npm run schema:check`
  is a command. Give the invocation.
- **Prose is not a command.** "measured against a production build" tells the next reader nothing
  they can run.
- **A figure quoted from another document is still your figure.** Re-derive it from the enforced
  source rather than from the prose that summarised it. A single paragraph in this project took
  four revisions, each fixing the last and introducing a fresh arithmetic error, because every
  revision was derived from the previous prose instead of from the file CI actually reads.

## Exemptions, deliberately narrow

Bare `path:123` citations, issue and PR references, version numbers and dates are locations and
names, not measurements. They need no command.

Everything else does. If a figure genuinely cannot be re-derived by a command — it came from a
one-off observation, a screenshot, an external dashboard — say that in place of the command
rather than leaving the number bare. "No command; observed once on the Vercel preview" is honest
and tells the reader exactly how much weight it carries.

## Where this is enforced

`.github/ISSUE_TEMPLATE/lane-task.md` has a **Figures** section that is filled in or explicitly
marked empty. Nothing automated checks this — a number and its command cannot be matched by a
linter — so it is a review obligation, and the cheapest place to catch it is while writing.

**Verification sections ask for the command, not just the number.** Writing "report the before
and after" puts the obligation to produce a figure on the implementer while the issue's own
figures stay unsourced. Write "run `X`, which should print `Y`" instead, so the asymmetry
disappears and the step is reproducible by whoever reviews it.
