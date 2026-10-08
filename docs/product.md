# Product

**Would I ship this to production today? No.** The app does what the brief asks, but RAVN's
API is gone, so it cannot do that job for a real team. [Go or no-go](#go-or-no-go) has the
evidence.

Written on 2026-10-06, after the app was built. It reads the product back from what this
repository already says. Every line that is inferred rather than recorded says
**assumption**. Updated 2026-10-07 with the interview findings, paraphrased from a synthesis
kept outside this repository, and with F1, the first change they led to.

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

**What the interviews found, 2026-10-07.** Two interviews, with P1 and P2, were run to test the
assumptions above. Two people give a first signal, not a pattern.

- **Persona: complicated by both participants.** Their teams track work in Linear, but they
  hand work over in Slack and standups.
- **Second persona (untested).** A non-developer who hands work to developers.
- **Problem: complicated.** P2 has the problem. P1 says a tool already meets that need. Nobody
  probed or tried its second half: a way to hand a teammate exactly the slice they need.
- **The board.** The "Estimated points" field confused both participants. P1 found that the
  tech-stack labels assume developers. P1 created a task; P2 created none.

**F1: the estimate field says Effort and explains itself (app#202).** It is the first change
the interviews led to. Their findings are above, and the usability-pilot research doc records
[what changes because of them](research/usability-pilot.md#what-changes-because-of-this).

- **Problem.** A person who is not a developer must set a field called "Estimated points" to
  create a task, and nothing says what points are. Both participants guessed that points meant
  priority, so a task's size can be set and read as its urgency.
- **Job story (assumption).** When I hand a piece of work to a teammate, I want to say how big
  it is in words we both understand, so they know how much I am asking of them.

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

### After the interviews: what to build first

The build above was cut with MoSCoW and written reasons, because reach, impact and effort were
never measured. The eight interview findings that ask for a change are scored with the course's
method (PM week Thursday brief): RICE, MoSCoW, Value vs Effort and the North Star check.

- **The course's part.** The formula: RICE = Reach × Impact × Confidence ÷ Effort. The impact
  scale: 3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal. The confidence anchors:
  100, 80 or 50% ("Prioritization frameworks", Atlassian, PM week Thursday). Effort is in
  person-weeks.
- **Confidence is 50% in every row.** Two interviews with friends of the moderator are low data,
  and "low data means low confidence" (PM week Thursday brief).
- **Our estimates, never measured.** Reach: of 10 people like the persona, how many meet this in
  a week. Effort: S (under 2 hours) = 0.05, M (half a day) = 0.1, L (more than a day) = 0.3
  person-weeks. The impact step in each row is our call too.
- **Value vs Effort.** Value is Reach × Impact, high at 5 or more; S and M are low effort. Quick
  win: high value, low effort. Big bet: high value, high effort. Money pit: low value, high
  effort. Do last: low value, low effort.

| Finding (seen in)                              | Reach                                       | Impact                                    | Effort (person-weeks) | RICE = R × I × C ÷ E           | MoSCoW      | Value vs Effort | North Star check                  |
| ---------------------------------------------- | ------------------------------------------- | ----------------------------------------- | --------------------- | ------------------------------ | ----------- | --------------- | --------------------------------- |
| F1: the estimate field is unclear (P1, P2)     | 8: set on every create, shown on every card | 1: friction when creating; nobody blocked | S, 0.05               | 8 × 1 × 0.5 ÷ 0.05 = **80**    | Should      | Quick win       | Moves it: creating a task         |
| A date-range filter (P2)                       | 5: people who filter by date                | 1: "when it is due" is in the problem     | M, 0.1                | 5 × 1 × 0.5 ÷ 0.1 = **25**     | Could       | Quick win       | Orphan: filtering creates no task |
| Custom labels (P1, P2)                         | 8: on every create and every card           | 1: a better fit, not a block              | L, 0.3                | 8 × 1 × 0.5 ÷ 0.3 = **13.3**   | Should      | Big bet         | Indirect, through creating        |
| A + button per column (P1)                     | 8                                           | 0.25: a preference                        | M, 0.1                | 8 × 0.25 × 0.5 ÷ 0.1 = **10**  | Won't       | Do last         | Moves nothing                     |
| A due time of day (P1)                         | 5                                           | 1                                         | L, 0.3                | 5 × 1 × 0.5 ÷ 0.3 = **8.3**    | Could       | Big bet         | Indirect                          |
| Days in the current status (P2)                | 8                                           | 0.5                                       | L, 0.3                | 8 × 0.5 × 0.5 ÷ 0.3 = **6.7**  | Could       | Money pit       | Indirect                          |
| Add a teammate (P2)                            | 2                                           | 2: no teammate means no assignee          | L, 0.3                | 2 × 2 × 0.5 ÷ 0.3 = **6.7**    | Won't (now) | Money pit       | Moves it, but rarely              |
| Smaller type and a sidebar that folds (P1, P2) | 8                                           | 0.25: a preference                        | L, 0.3                | 8 × 0.25 × 0.5 ÷ 0.3 = **3.3** | Won't       | Money pit       | Moves nothing                     |

**Why F1 and not custom labels**, which both participants also asked for. The two have the same
reach, impact and confidence, so effort decides. F1 changes words only. Custom labels mean
changing `enum TaskTag` in `schema.graphql` and the mock, away from RAVN's API, plus a colour
rule for new labels, because the kit's tag has five colours. So F1 costs a sixth of the effort.
F1 was also weighed a core problem in both sessions, and custom labels in one. The date-range
filter scores second but moves neither the North Star nor a supporting signal, so it waits. The scores inform this call;
they do not make it: the PM week Thursday brief names "Treating the score as the decision" as a
trap.

## Top three risks

Likelihood and impact on a 1 to 3 scale. The first risk is R1 in the QA register,
[`qa/risk-register.md`](qa/risk-register.md). The persona and call-to-action risks below are
product risks and are not in the QA register.

| Risk                                                             | L × I     | Response                                                                                            |
| ---------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| RAVN's API does not come back, so nothing is ever saved for real | 3 × 3 = 9 | Serve the seeded mock with a banner; one line in `vercel.json` switches back                        |
| The proto-persona is wrong, so the roadmap aims at the wrong job | 2 × 3 = 6 | The interviews on 2026-10-07 (P1, P2) complicated it; this page records what they found             |
| The brand's call-to-action fails WCAG AA (3.83:1 against 4.5:1)  | 3 × 2 = 6 | Accepted on purpose: only a darker red fixes it, and that is a brand decision ([design](design.md)) |

F1's top three risks, on the same scale:

| Risk                                                               | L × I     | Mitigation                                                                                    |
| ------------------------------------------------------------------ | --------- | --------------------------------------------------------------------------------------------- |
| A first-time user still reads Effort as priority                   | 2 × 2 = 4 | The help line says "not how urgent it is", and the blind check before and after reads it      |
| The promotion to `main` breaks creating a task on production       | 1 × 3 = 3 | The promotion PR merges only on green CI; Vercel Instant Rollback undoes a bad deploy         |
| One place keeps the old words, or Figma's "N Pts" comes back later | 1 × 2 = 2 | One formatter owns the wording, tests read all four places, the design doc records the reason |

## The core flow: create a task

**F1's requirements.** Its acceptance criteria go in the table below, each with the test that
checks it.

- **Functional.** The field reads "Effort" wherever a person meets it: the form, the filter, the
  card and the list row. Its values read "Effort N", for 0, 1, 2, 4 and 8.
- **Functional.** The form and the filter show one help line under the field, "How much work it
  takes, not how urgent it is. 0 = tiny, 8 = big.", and a screen reader reads it as the field's
  description.
- **Non-functional.** The help line has a contrast ratio of at least 4.5:1 against its
  background.

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
  a few minutes near the end of their interviews on 2026-10-07 ([Validated by](#validated-by)).

**Ship criteria**, all of them: the API answers; the E2E spec passes against the production
deployment with no retries; CI is green on `main`; every piece of interview feedback weighed
as a core problem, not a preference, is fixed.

**Owner:** Fernando Ramirez. **Rollback trigger:** the E2E spec goes red on a production
deployment, or a report that someone cannot create a task. **How:** Vercel Instant Rollback
(`docs/deployment.md`, "Rolling back").

**Monitoring:** none today. North Star (assumption): tasks created per week that have an
assignee. Every task has a `createdAt`, and `assignee` is the one field a task can lack
(`schema.graphql`). The app records nothing yet; the API's task list could count it once the
API is back. **Supporting signal (assumption):** how many first-time users can say what the
Effort field means. F1 moves it, and F1's blind check below reads it.

### F1's go or no-go

**Success measure: a blind check before and after.** An agent playing a first-time user sees
only the app and one task: "Create a task for a teammate. Then say, in one sentence, what the
Effort field means." It runs on production before the promotion, while the field still says
"Estimated points", and again after it. It passes when the answer says amount or size of work,
not priority or urgency. It is a rehearsal by an agent, not a user.

- **Ship criteria:** the gate and the build are green in CI, F1's acceptance criteria pass, the
  change is reviewed before it merges, and production shows "Effort" in the form, the filter,
  the cards and the list rows.
- **Owner:** Fernando Ramirez.
- **Rollback trigger:** a report that someone cannot create a task, or a create test red on
  `main`. **How:** Vercel Instant Rollback. A failed blind check opens a follow-up issue instead.
- **Monitor:** the blind check, before and after. The usability-pilot research doc holds each
  result with its date ([What changes because of this](research/usability-pilot.md#what-changes-because-of-this)).
- **Recommendation: go.** F1 changes words only, not the API, the data or the kit, so it is
  cheap to undo, and it fixes a core problem that both participants hit. The no-go above stands:
  the deployment stays a demo on seeded data.

## Validated by

Two interviews ran on 2026-10-07 with P1 and P2, neither of them a developer
([`research/usability-pilot.md`](research/usability-pilot.md)). Each one asked for the story of
the last time they handed work to a teammate or picked it up, read the problem statement above
aloud and asked whether it matched their experience, then gave them a few minutes on the
deployed board. Their aim was to test the persona, the problem and whether the board helps with
it. **Results:** the persona and the problem are complicated, and whether the board helps is
unclear. Two people are a first signal, not a pattern.
[What the interviews found, 2026-10-07](#the-user-and-the-problem) has the detail.

## Now, next, later

- **Now:** F1, the estimate field says Effort and explains itself (app#202). It ranked first of
  the eight findings ([what to build first](#after-the-interviews-what-to-build-first)). The two
  interviews are done, and their findings are in
  [The user and the problem](#the-user-and-the-problem). Keep the deployment on mock data with
  its banner. Keep CI green.
- **Next:** write the interviews' findings into the risk register. When the API returns, point
  `VITE_API_URL` back at the proxy and turn the E2E trigger on. Bump the kit past its breaking
  renames (app#157).
- **Later:** drag and drop, if people are seen changing status often; the 2026-10-07 interviews
  did not show it. A darker brand red, if the brand owner agrees. A login, and then a
  Content-Security-Policy (`docs/deployment.md` explains that order).
