# Product

**Would I ship this to production today? No.** The app does what the brief asks, but RAVN's
API is gone, so it cannot do that job for a real team. [Go or no-go](#go-or-no-go) has the
evidence.

Written on 2026-10-06, after the app was built. It reads the product back from what this
repository already says. Every line that is inferred rather than recorded says
**assumption**.

## The user and the problem

The brief asks for "a task management app that allows you to browse and add tasks to users"
(RAVN's challenge brief, Summary; the brief is not in this repository). No user research
came before the build.

**Proto-persona (assumption).** A member of a small team that plans its work on one shared
board. They add work, give it an owner and a date, keep its status true, and point a
teammate at the part of the board that matters.

It is built from reasons the repository wrote down while the app was built. Dates are the
first commit that carries each one (`git log -G`):

| What the repository says                                                       | Where                                                                         | First written         |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | --------------------- |
| Filters live in the URL: "you can link or bookmark a filtered board"           | `README.md`, "Decisions worth explaining"                                     | 2026-08-03, `512430c` |
| A task due tomorrow must not read "Yesterday" for someone west of Greenwich    | `README.md`, "This app reads dates in UTC"                                    | 2026-08-03, `e25ab5b` |
| The overdue badge says "overdue" to screen readers, not by colour alone        | `README.md`, "Bonus items"                                                    | 2026-08-03, `e25ab5b` |
| A rejected token gets no retry button, because retrying cannot fix it          | `README.md`, "A failure a user can fix is different from one they cannot fix" | 2026-08-03, `4bf9813` |
| A failed edit also goes to a notification, because the dialog can be dismissed | commit `939be0c`                                                              | 2026-08-06            |
| "My task" lists what is assigned to one person, filtered by `assigneeId`       | commit `dbcd92e`                                                              | 2026-08-11            |

Nothing here supports a manager role, permissions or mobile-first use. `docs/deployment.md`
says the app "has no concept of a user".

**Problem (assumption).** A small team needs one place that shows what work exists, who
owns it and when it is due, and a way to hand a teammate exactly the slice they need.

**What the interviews found, 2026-10-07.** Two interviews, with P1 and P2, tested the
assumptions above. Two people give a first signal, not a pattern.

- **Persona: complicated by both participants.** Their teams track work in Linear, but they
  hand work over in Slack and standups.
- **Second persona (untested).** A non-developer who hands work to developers.
- **Problem: complicated.** P2 has the problem. P1 says a tool already meets that need. Nobody
  probed or tried its second half: a way to hand a teammate exactly the slice they need.
- **The board.** Points confused both participants. P1 found that the tech-stack labels assume
  developers.

## What was built, and what was cut

The brief's six sections are requirements, so they are the Musts. The five bonus items are
optional. Built is the MVP.

| Candidate                                      | MoSCoW      | Status                    | Why                                                                                                                                                                                                  |
| ---------------------------------------------- | ----------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Board by status, create, edit, delete (§2-§4)  | Must        | Built                     | The core job: browse and add tasks                                                                                                                                                                   |
| Search and filter (§5)                         | Must        | Built                     | Sent to the API, kept in the URL                                                                                                                                                                     |
| Profile page (§6)                              | Must        | Built, without `Position` | The API's `User` type has no such field (`README.md`, "Things the brief asks for that the API cannot do")                                                                                            |
| Count per column, list layout, due-date colour | Could       | Built                     | Three of five bonus items (`README.md`, "Bonus items")                                                                                                                                               |
| Drag and drop                                  | Won't (now) | Cut                       | "for scope reasons, not difficulty": each column needs a collection layer. The Edit dialog, opened from the card's options menu, already changes status and position with the same `updateTask` call |
| Animation when a task is added                 | Won't       | Cut                       | No reason was written when it was cut. Read now: it changes how adding feels, not whether it works. **Assumption**                                                                                   |

There is no RICE table. Reach, impact and effort were never measured, and "a RICE score
built on made-up numbers is just a made-up decision" (PM week, Day 4 brief). MoSCoW and the
written reasons explain the cut.

## Top three risks

Likelihood and impact on a 1 to 3 scale. The first risk is R1 in the QA register,
[`qa/risk-register.md`](qa/risk-register.md). The persona and call-to-action risks below are
product risks and are not in the QA register.

| Risk                                                             | L × I     | Response                                                                                            |
| ---------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| RAVN's API does not come back, so nothing is ever saved for real | 3 × 3 = 9 | Serve the seeded mock with a banner; one line in `vercel.json` switches back                        |
| The proto-persona is wrong, so the roadmap aims at the wrong job | 2 × 3 = 6 | The interviews on 2026-10-07 (P1, P2) complicated it; this page records what they found             |
| The brand's call-to-action fails WCAG AA (3.83:1 against 4.5:1)  | 3 × 2 = 6 | Accepted on purpose: only a darker red fixes it, and that is a brand decision ([design](design.md)) |

## The core flow: create a task

| Given                                 | When                                                 | Then                                                             | Checked by                                                                                                                     |
| ------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| the board is open                     | I press the + button                                 | a dialog named "Create task" opens with focus in the title field | `create-task.test.tsx`: "opens a named dialog from the + button", "puts focus in the title field so the user can start typing" |
| the title is empty                    | I submit                                             | nothing is sent, and the form says why                           | "refuses to submit an empty title and says why"                                                                                |
| the form is valid                     | I submit                                             | the card is on the board by the time "Task created" shows        | "adds the created task to the board", 'has the card on the board by the time it says "Task created"'                           |
| the API rejects the request           | I submit                                             | the dialog stays open and shows the reason                       | "keeps the dialog open and shows the reason when the mutation fails"                                                           |
| a real deployment and a reachable API | a browser creates, filters, edits and deletes a task | each step shows its notification and the task is gone at the end | `e2e/deployed-proxy.spec.ts`: "creates, filters, edits and deletes a task on the deployed proxy". **Cannot pass today**        |

The first four run in CI against the mock on every pull request. [`qa/test-map.md`](qa/test-map.md)
says what each suite proves and what it does not.

## Go or no-go

**No-go for production.** The deployment stays up as a demo on seeded data.

- **The API is gone.** `https://syn-api-production-e95c.up.railway.app/graphql` answers 404,
  "Application not found" (checked 2026-10-06). The live board serves seeded mock data, and
  a change lasts until the page reloads (`docs/deployment.md`).
- **The one test of the deployment cannot pass.** Its last run, on 2026-10-06, failed 4 of
  5 tests because the API answered 404 (Actions run 37415458012). Its automatic trigger is
  off (`.github/workflows/e2e.yml`).
- **What is green.** CI on 2026-10-06 (run 37479127953): 489 tests in 39 files; coverage
  97.72% of statements and 90.95% of branches against an 85% gate; 0 vulnerabilities in
  production dependencies.
- **Two people outside the project have used it.** P1 and P2 each used the deployed board for
  a few minutes at the end of their interviews on 2026-10-07 ([Validated by](#validated-by)).

**Ship criteria**, all of them: the API answers; the E2E spec passes against the production
deployment with no retries; CI is green on `main`; every piece of interview feedback weighed
as a core problem, not a preference, is fixed.

**Owner:** Fernando Ramirez. **Rollback trigger:** the E2E spec goes red on a production
deployment, or a report that someone cannot create a task. **How:** Vercel Instant Rollback
(`docs/deployment.md`, "Rolling back").

**Monitoring:** none today. North Star (assumption): tasks created per week that have an
assignee. Every task has a `createdAt`, and `assignee` is the one field a task can lack
(`schema.graphql`). The app records nothing yet; the API's task list could count it once the
API is back.

## Validated by

Two interviews run on 2026-10-07 with P1 and P2, neither of them a developer
([`research/usability-pilot.md`](research/usability-pilot.md)). Each one asks for the story of
the last time they handed work to a teammate or picked it up, reads the problem statement above
aloud and asks whether it matches their experience, then gives them a few minutes on the deployed
board. They test the persona, the problem and whether the board helps with it. **Results:** the
persona and the problem are complicated, and whether the board helps is unclear. P1 created a
task and P2 created none; points confused both, and P1 found the tech-stack labels assume
developers. Two people are a first signal, not a pattern.
[What the interviews found, 2026-10-07](#the-user-and-the-problem) has the detail.

## Now, next, later

- **Now:** the two interviews are done, and their findings are in
  [The user and the problem](#the-user-and-the-problem). Keep the deployment on mock data with
  its banner. Keep CI green.
- **Next:** write the interviews' findings into the risk register. When the API returns, point
  `VITE_API_URL` back at the proxy and turn the E2E trigger on. Bump the kit past its breaking
  renames (app#157).
- **Later:** drag and drop, if the interviews show people change status often. A darker brand
  red, if the brand owner agrees. A login, and then a Content-Security-Policy
  (`docs/deployment.md` explains that order).
