# Usability interviews

Written on 2026-10-06, before the sessions. Two remote interviews on the deployed board, on
2026-10-07, after the app was built: P1, who is not a developer, and P2, a developer. They test
the assumptions in the proto-persona (`docs/product.md`). They do not prove that the app is
usable for its real users.

They replace the three-person pilot planned earlier. The same morning holds four interviews,
two per project and one product each; P3 and P4 try a different project and do not appear here.

## Why two interviews, and what they cannot show

- **No research came before the build.** The persona was rebuilt afterwards from the user-facing
  reasons already written in this repository. Nielsen Norman Group calls that a proto-persona:
  "created with no new research", and useful "if the team considers them to be hypotheses that
  can be validated" (<https://www.nngroup.com/articles/persona-types/>). These interviews are
  that validation, at its smallest.
- **Two people, not five.** NN/g finds about 85% of the problems with five users
  (<https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/>). Two sessions, one
  per profile, are a first look, not a measure: each result is a single observation.
- **The participants are not the target users.** Neither runs a team's work on this board, and
  NN/g warns that with colleagues "you won't observe authentic behavior"
  (<https://www.nngroup.com/articles/employees-user-test/>). So both are new to the app, are asked
  not to look it up before the call, and one is not a developer.

## Setup

- **Where.** Remote, over Google Meet, which the moderator runs in Chrome. The participant opens
  <https://ravn-task-management-challenge.vercel.app> in a new tab of their own desktop browser,
  makes the window as large as they can, and shares their screen.
- **How long.** About 15 minutes of board tasks in each session. P1's session runs about 20
  minutes, with a one-minute page tour before the tasks and reaction words after them. P2's runs
  about 30, because P2 then tries the component kit; that part is not covered here.
- **Recording.** The moderator chose OBS Studio, which records their entire screen locally, with
  both voices. Zoom's local recording is the fallback, which would move the call to Zoom. Wispr
  Flow Notetaker writes the transcript. Recordings, transcripts and session notes stay outside
  this repository ([what stays out](#what-stays-out-of-this-repository)).
- **Privacy.** No consent step: the participants are friends of the moderator, and the project
  is internal. Participants are named only as P1 and P2: no name, email or employer goes into
  any file or note, and names, emails, notifications and open tabs are cut from any clip. Full
  recordings and transcripts are deleted by 2026-10-23. Where quotes, clips and results go is in
  [what stays out](#what-stays-out-of-this-repository).
- **The board runs on seeded mock data.** RAVN's challenge API went offline in October 2026, so
  the deployment serves the same seeded tasks a fresh clone does (`docs/deployment.md`). A
  participant's changes live in their own tab until it reloads. A fresh tab is the reset between
  sessions, so P1 and P2 start from the same board. A reload during the tasks would delete their
  task, so the moderator never asks for one. The banner above the board is introduced once as a
  note about test data; it is not part of any task.

## Script

Start OBS, then Wispr. Then read this aloud and do not improvise it, so that both participants
hear the same words. P2's session also covers the kit, so P2 hears "the products" where P1
hears "the app":

> Thanks for helping. I'm testing the app, not you, so nothing you do here is a mistake. Please
> think aloud the whole time: what you're looking at, what you expect, what surprises you. I
> won't help while you work, because I want to see where the app leaves you on your own. If you
> ask me something, I may not answer right away. When you think a task is done, say "done".

While they work, the moderator says only these, and nothing else: "What are you thinking?" after
10 seconds of silence; "Keep going."; "What do you think?" or "What would you do if I weren't
here?" when asked a question; "Thanks, let's move on to the next one." at a task's cap; and the
fixed line before T3. "Shut up and let the users do the talking"
(<https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/>).

## Tasks

Each card is pasted in the chat, and the participant reads it aloud. Each task is a goal, never
the steps, and uses none of the app's labels. Each one tests a named assumption in the
proto-persona. A task has a 4-minute cap; at the cap it scores fail.

| #   | Card                                                                                                                                          | Success when                                                                                                                                    | Assumption it tests                                                                                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| T1  | "You just agreed to review a teammate's work by Friday, October 9. Put that on the team's board, so it's clear who has it and when it's due." | One new task shows with a name, an assignee and the due date Friday, October 9, 2026 (the card reads "9 October, 2026"). Today's date is a fail | Adding a task is the core job: the brief's "browse and add tasks to users"                               |
| T2  | "Your lead only cares about the React work. Show just that, then send them something that opens on exactly the same view."                    | Only React tasks show (3 tasks, the address ends in `?tags=REACT`), and the participant copies the address or says they would send the link     | A filtered view should be shareable (`README.md`, "Decisions worth explaining": filters live in the URL) |
| T3  | "The review is finished. Update the board so everyone can see that."                                                                          | The T1 task's status is Done                                                                                                                    | Keeping the board true is part of the job                                                                |
| T4  | "Remove the task you created; it was only a test."                                                                                            | The task is gone after the participant confirms the Delete dialog                                                                               | A destructive action asks first (`README.md`, "What it does": a confirmation dialog handles delete)      |

**Before T3, always.** The React filter from T2 hides the T1 task. After T2, the moderator asks
the participant to click "Clear filters", at the right end of the filter row, and to close any
tab they opened. If the T1 task is gone anyway (they reloaded), they add it again, untimed, and
the notes say so.

**What a dry run on 2026-10-06 changed.** T1 now names the date, because the date field starts
at today and a task left there used to pass. T3 now starts from "Clear filters", because the T2
filter hid the task and a reload would delete it. T4 now records whether the participant noticed
the "Task deleted" message, which shows for 5 seconds in the bottom-right corner.

**What the moderator watches.** T1: whether they find the date field, which has no visible label,
and who they pick as assignee, since nothing on screen says who "you" are. T2: a search for a
share button; there is none. T3: the card leaving the visible board after Save, since Done can
sit off screen to the right, and any pause at the unlabelled Position field. T4: whether they
notice "Task deleted".

## What to record, per task

- **Success.** Success, partial or fail. Partial means done with help or with a detour of more
  than one minute.
- **Time.** In seconds, from the end of the reading to "done". These are think-aloud times.
- **First click.** Where it went.
- **Errors.** Each wrong turn, with a short note of what the participant expected to happen.
- **Quote.** The one sentence that best explains what happened, with its mm:ss, in the session
  notes.
- **Ease (SEQ).** Right after each task: "Overall, how difficult or easy was that task to
  complete? 1 is very difficult, 7 is very easy."

Per session: the three worst problems, each with its mm:ss. P1 also picks the five of 25
reaction words that best describe using the board, and says why they picked the first.

### What stays out of this repository

This repository is public, and its history keeps every version. So recordings, transcripts and
session notes stay outside it, because the notes hold quotes, reasons and word-for-word answers.
Quotes and clips of 60 seconds or less stay on an unlisted page shown to RAVN evaluators, never
here.

The Results below hold only outcomes, times, SEQ, first clicks, errors, paraphrased findings,
and P1's five reaction words picked from the fixed list. The spoken reason for the first word
stays in the session notes.

If a participant later asks, their results are removed from this repository, and earlier
versions stay in its history, de-identified.

## Severity

Give each finding a severity from 0 to 4. Base it on how often it happened, how much it cost the
participant, and whether it would keep happening
(<https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/>). With one
participant per profile, how often is unknown, so "Seen in" names the P numbers instead.

| 0             | 1        | 2     | 3     | 4                               |
| ------------- | -------- | ----- | ----- | ------------------------------- |
| not a problem | cosmetic | minor | major | catastrophe, fix before release |

## Reporting

Individual values only, in the form `P1: success, <seconds> s, SEQ <1-7>`. Never an average or a
percentage: two people cannot carry one. Every finding names the change it puts in the
roadmap's Next (`docs/product.md`).

## Results

Fill this in after the sessions. Write down what happened, not what it means: interpretation
goes in "Findings". No participant's spoken words go here
([what stays out](#what-stays-out-of-this-repository)). Evidence in mm:ss exists only if the
recording did not fail.

### Per task

| Task                                     | P1  | P2                        |
| ---------------------------------------- | --- | ------------------------- |
| T1 success / time / SEQ                  |     |                           |
| T2 success / time / SEQ                  |     |                           |
| T3 success / time / SEQ                  |     |                           |
| T4 success / time / SEQ                  |     |                           |
| T4 noticed "Task deleted" (yes / no)     |     |                           |
| Reaction words, five from the fixed list |     | not asked about the board |

### Findings

| #   | What happened | Seen in (P#) | Severity 0-4 | Evidence (recording, mm:ss) | Assumption confirmed or refuted | Next item |
| --- | ------------- | ------------ | ------------ | --------------------------- | ------------------------------- | --------- |
| F1  |               |              |              |                             |                                 |           |

### What changes because of this

- In `docs/product.md`: what the proto-persona keeps, changes or drops.
- In `docs/qa/risk-register.md`: any new risk.
- In the roadmap's Next: what to build or fix first.
