# Usability pilot

A first, small usability round on the deployed board, run after the app was built. It tests
the assumptions in the proto-persona (`docs/product.md`). It does not prove that the app is
usable for its real users. Read the results as a pilot.

## Why a pilot, and what it cannot show

- **No research came before the build.** The persona was rebuilt afterwards from the user-facing
  reasons already written in this repository. Nielsen Norman Group calls that a proto-persona:
  "created with no new research", and useful "if the team considers them to be hypotheses that
  can be validated" (<https://www.nngroup.com/articles/persona-types/>). This round is that
  validation, at its smallest.
- **Three people, not five.** NN/g finds about 85% of the problems with five users
  (<https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/>). Three is a pilot
  that fits one afternoon.
- **The participants are not the target users.** People recruited from around the cohort are
  not a team that runs its work on this board, and "you won't observe authentic behavior" with
  colleagues (<https://www.nngroup.com/articles/employees-user-test/>). So recruit people who have
  never seen this app, and at least one who is not a developer.

## Setup

- **Where.** The deployed board, <https://ravn-task-management-challenge.vercel.app>, in a
  desktop browser with a window at least 1280 px wide.
- **How long.** About 15 minutes per person: 2 to set up, 10 for the tasks, 3 for the questions.
- **Recording.** Screen and voice, only with consent, using Loom or QuickTime. No personal data
  goes into the notes. Participants are P1, P2 and P3.
- **The board runs on seeded mock data.** RAVN's challenge API went offline in October 2026, so
  the deployment serves the same seeded tasks a fresh clone does (`docs/deployment.md`). A
  participant's changes last until the page reloads, which is also the reset between sessions.
  The banner above the board says so; tell participants to ignore it, since it is not part of
  any task.

## Script

Read this aloud and do not improvise it, so that every participant hears the same words:

> Thanks for helping. I'm testing the app, not you, so nothing you do here is a mistake. Please
> think aloud the whole time: what you're looking at, what you expect, what surprises you. I
> won't help while you work, because I want to see where the app leaves you on your own. When
> you think a task is done, say "done". Is it OK if I record the screen and our voices?

While they work, say nothing except "keep going", or "what are you thinking?" after 10 seconds of
silence. "Shut up and let the users do the talking"
(<https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/>).

## Tasks

Each task is a goal, never the steps, and uses none of the app's labels. Each one tests a named
assumption in the proto-persona.

| #   | Read aloud                                                                                                                         | Done when                                                                                                   | Assumption it tests                                                                                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| T1  | "You just agreed to review a teammate's work by Friday. Put that on the team's board, so it's clear who has it and when it's due." | A task with a name, an assignee and a due date shows on the board                                           | Adding a task is the core job: the brief's "browse and add tasks to users"                               |
| T2  | "Your lead only cares about the React work. Show just that, then send them something that opens on exactly the same view."         | The board is filtered by the React tag, and the participant copies the URL or says they would send the link | A filtered view should be shareable (`README.md`, "Decisions worth explaining": filters live in the URL) |
| T3  | "The review is finished. Update the board so everyone can see that."                                                               | The task moves to the right status                                                                          | Keeping the board true is part of the job                                                                |
| T4  | "Remove the task you created; it was only a test."                                                                                 | The task is gone after the confirmation                                                                     | A destructive action asks first (`README.md`, "What it does": a confirmation dialog handles delete)      |

## What to record, per task

- **Success.** Yes, partial or no. Partial means done with help or with a detour of more than
  one minute.
- **Time.** In seconds, from the end of the reading to "done".
- **Errors.** Each wrong turn, with a short note of what the participant expected to happen.
- **Quote.** The one sentence that best explains what happened.
- **Ease.** Right after each task, ask: "From 1 (very hard) to 7 (very easy), how easy was that?"

## Severity

Give each finding a severity from 0 to 4. Base it on how often it happened, how much it cost the
participant, and whether it would keep happening
(<https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/>).

| 0             | 1        | 2     | 3     | 4                               |
| ------------- | -------- | ----- | ----- | ------------------------------- |
| not a problem | cosmetic | minor | major | catastrophe, fix before release |

## Cleanup

Reload the page after each session. The seeded board comes back as it was, so the next
participant starts from the same state.

## Results

Fill this in after the sessions. Write down what happened, not what it means: interpretation
goes in "Findings".

### Per task

| Task                     | P1  | P2  | P3  |
| ------------------------ | --- | --- | --- |
| T1 success / time / ease |     |     |     |
| T2 success / time / ease |     |     |     |
| T3 success / time / ease |     |     |     |
| T4 success / time / ease |     |     |     |

### Findings

| #   | What happened | Seen in | Severity | Evidence (recording, mm:ss) | Assumption confirmed or refuted |
| --- | ------------- | ------- | -------- | --------------------------- | ------------------------------- |
| F1  |               |         |          |                             |                                 |

### What changes because of this

- In `docs/product.md`: what the proto-persona keeps, changes or drops.
- In `docs/qa/risk-register.md`: any new risk.
- In the roadmap's Next: what to build or fix first.
