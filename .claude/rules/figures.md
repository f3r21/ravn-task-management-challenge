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
- 284 tests, 97.63% statements — `npm run gate 2>&1 | tail -6 ; echo "exit=$pipestatus[1]"`
- 46 non-icon components — `grep -c '^export declare' dist/index.d.ts`
```

That `exit=` is not decoration, and the exemplar carried the bug it now demonstrates against —
see "A command that cannot fail" below. On bash, the same line is
`echo "exit=${PIPESTATUS[0]}"`; lanes here run zsh, so the zsh spelling is the one written
above. Ship both when you write the command down for someone else, because the bash form
prints an empty string under zsh and an empty string looks like provenance.

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

## A command that cannot fail is not evidence

**A pipe returns the last command's status, not the interesting one.** This rule's own exemplar
was `npm run gate 2>&1 | tail -6` for months, and that command reports `tail`'s success. It
cannot tell a passing gate from a failing one:

```bash
( exit 1 ) | tail -1 ; echo $?              # 0  — tail succeeded
( exit 1 ) | tail -1 ; echo $pipestatus[1]  # 1  — the gate did not
```

**Which failure you get decides whether you can see it, and the dangerous one is the common
one.** Both were sabotaged here rather than reasoned about:

| Sabotage                                  | What `\| tail -6` shows                                                                      | Visible?                                |
| ----------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------- |
| Threshold raised to 99%                   | the table, then `ERROR: Coverage for branches (93.65%) does not meet global threshold (99%)` | yes — the error lands inside the window |
| One assertion broken in `task-display.ts` | the coverage table, clean, nothing else                                                      | **no**                                  |

A _threshold_ breach happens to print its complaint in the last six lines. A **failing test**
does not: vitest reports it far above, then coverage prints normally, and the tail is a tidy
green-looking table. So the reassuring case is the one the old command could catch, and the
ordinary case — a test that broke — is the one it could not.

Observed, not theorised, on the day this was written down: three consecutive coverage runs on
`ravn-ui-kit`'s `main` before a release tag printed byte-identical percentages, and **the first
exited 1** — five tests had hit the 5000ms timeout under load. Exactly the invisible row. Every
`| tail` reading in this project would have called that run green and tagged from it.

**The general case is the part worth carrying, because it is not about pipes.** A command whose
failure mode is a _clean empty result_ rather than an error is not evidence, and three separate
wrong answers in one day had exactly that shape:

- `gh pr view <n> --json comments` silently omits PR **reviews** — a different object, at
  `gh api repos/{owner}/{repo}/pulls/{n}/reviews`. An empty list read as "nobody reviewed it".
- A grep for `the old roles` against shipped text reading ``the old `button` role`` returned
  nothing, and nothing read as "the edit never landed".
- The gate table above.

None of the three looked broken, which is the whole problem: an error is self-announcing and an
empty result is not.

**And it runs in both directions — a clean _positive_ is no better.** `v0.5.0` of
`@ravn/ui-kit` was tagged from a tree whose committed `dist/` was stale against its own source:
two of the three fixes it was cut for were absent from the built output, while the third was
present. Every spot-check passed. The `.d.ts` is generated separately from the JS bundle, so the
types advertised the new `fallbackLabel` prop that the shipped code did not implement — a
confirming answer from a source that could not have disconfirmed. That seam is exactly what
`src/test/ui-kit-smoke.test.tsx` exists to catch, and it was skipped before tagging.

**Before trusting either a negative or a confirmation, ask what the command prints when the
claim is false.** If the answer is "the same thing", it is not evidence — prefer a spelling that
can fail, and if only a silent one exists, say so beside the figure.

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
