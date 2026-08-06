import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

/**
 * One spec, deliberately, and this is the gap it fills.
 *
 * There are 26 Vitest files over `src/`, running the real components against
 * MSW at the network layer, and they cover the app's behaviour better than a
 * browser driver could. What none of them can reach is `api/graphql.ts` running
 * on Vercel. That function is not imported by the app — the app posts to a URL —
 * so no unit test loads it, and the one bug it has already had was invisible to
 * every kind of test in this repository: exported as a default handler, Vercel
 * read it as Node's `(req, res) => void`, ignored the `Response` it returned,
 * and left every request hanging until the platform killed it. `api/graphql.ts`
 * typechecked, its own unit test passed, and the deployed board showed a
 * spinner forever. The answer was in a runtime log nobody was reading.
 *
 * So this drives the deployed thing: create, filter, edit, delete, through the
 * UI, against a real deployment, with the final assertion checking that the
 * requests went through `/api/graphql` and came back. A deploy that hangs, that
 * lost its `API_TOKEN`, that fell back to mock data, or that rewrote
 * `/api/graphql` into `index.html` fails here and nowhere else.
 *
 * It is one spec rather than a suite on purpose. Every additional flow would
 * re-test components that are already covered in jsdom, at a hundred times the
 * cost and with a live API's latency underneath — and each one writes to a
 * board that RAVN can see.
 */

/**
 * A token no other run can collide with, so a run can find and clean up after
 * itself even when the assertions never got that far, and so two runs against
 * the same deployment (a preview and a promotion, say) cannot see each other's
 * task.
 */
const RUN_ID = `${new Date().toISOString().replace(/[:.]/g, '-')}-${Math.random().toString(36).slice(2, 8)}`
const TASK_NAME = `e2e-smoke-${RUN_ID}`
const EDITED_NAME = `e2e-smoke-${RUN_ID}-edited`

/**
 * The id the API assigned this run's task, captured from the create response.
 *
 * Written for the case where the run dies before its own delete step: the
 * cleanup below can find the task by name, but a human reading CI output after
 * a cleanup that *also* failed needs the id to remove it by hand, and a name
 * containing a timestamp is not something you can paste into a mutation.
 */
let createdTaskId: string | null = null

/** Where the proxy lives, relative to the deployment's own origin. */
const PROXY_PATH = '/api/graphql'

/**
 * Deletes anything this run left on the board.
 *
 * The happy path deletes the task as its last step, so this only ever finds
 * something when the test failed partway — which is exactly when leaving a
 * `e2e smoke …` card on a board RAVN reviews would be worst. It runs against
 * the same proxy the browser used.
 *
 * Every task is fetched and narrowed here rather than by passing `name` to the
 * API: `FilterTaskInput` carries no descriptions, so whether `name` matches
 * exactly or by substring is the server's business and this file does not get
 * to assume. Narrowing locally is right whichever it turns out to be.
 *
 * Failures are reported, never thrown — see the hook at the bottom of the file.
 */
interface E2ETask {
  id: string
  name: string
}

/**
 * Every task on the board that carries this run's token.
 *
 * Split out from the delete so the same question can be asked again afterwards:
 * "did the delete work" and "what is still there" are the same query, and
 * running it twice is what turns a claim into a check.
 */
async function findTasksFromThisRun(request: APIRequestContext): Promise<E2ETask[]> {
  const list = await request.post(PROXY_PATH, {
    data: {
      query: 'query E2ETasks($input: FilterTaskInput!) { tasks(input: $input) { id name } }',
      variables: { input: {} },
    },
  })

  if (!list.ok()) {
    console.warn(`e2e cleanup: could not list tasks (HTTP ${String(list.status())})`)
    return []
  }

  // The one type assertion in this file, at the transport boundary, mirroring
  // `src/graphql/client.ts`. `APIResponse.json()` is untyped by construction.
  const body = (await list.json()) as { data?: { tasks?: E2ETask[] } }
  return (body.data?.tasks ?? []).filter((task) => task.name.includes(RUN_ID))
}

async function deleteTasksFromThisRun(request: APIRequestContext): Promise<void> {
  for (const task of await findTasksFromThisRun(request)) {
    const deleted = await request.post(PROXY_PATH, {
      data: {
        query: 'mutation E2EDelete($input: DeleteTaskInput!) { deleteTask(input: $input) { id } }',
        variables: { input: { id: task.id } },
      },
    })
    console.warn(
      `e2e cleanup: removed leftover task "${task.name}" (HTTP ${String(deleted.status())})`,
    )
  }
}

/**
 * Opens a card's options menu and picks an action.
 *
 * The menu's trigger is named after the task it belongs to — every card carries
 * an identical one, so "options" alone would be ambiguous the moment the board
 * holds two tasks.
 */
async function chooseCardAction(page: Page, taskName: string, action: 'Edit' | 'Delete') {
  await page.getByRole('button', { name: `Task options for ${taskName}` }).click()
  await page.getByRole('menuitem', { name: action, exact: true }).click()
}

test('creates, filters, edits and deletes a task on the deployed proxy', async ({ page }) => {
  // Collected rather than asserted inline, because the final check is about the
  // whole run: did this app talk to its own `/api/graphql` at all, and did that
  // function answer. A deployment that fell back to MSW never posts here, and a
  // rewrite that swallowed `/api/` would answer with the app's HTML.
  const proxyStatuses: number[] = []
  page.on('response', (response) => {
    if (new URL(response.url()).pathname !== PROXY_PATH) return
    proxyStatuses.push(response.status())

    // Read out of the response the app already made, rather than issuing a
    // lookup of our own: an extra round trip would be a second chance for the
    // id to be something other than what the UI is now holding.
    void response
      .json()
      .then((body: { data?: { createTask?: { id?: string } } }) => {
        const id = body.data?.createTask?.id
        if (id) {
          createdTaskId = id
          console.warn(`e2e: created task id ${id} ("${TASK_NAME}")`)
        }
      })
      .catch(() => {
        // A body that is not JSON is the deployment being broken, which the
        // assertions below already say far more precisely than this would.
      })
  })

  await page.goto('/')
  const createTrigger = page.getByRole('button', { name: 'Create task' })
  await expect(createTrigger).toBeVisible()

  // `BoardPage` renders this banner whenever `readApiConfig` resolved to the
  // mock backend. On a deployment that means `VITE_API_URL` never reached the
  // build — a failure that otherwise looks exactly like a working board, since
  // MSW serves a full set of seeded tasks.
  await expect(page.getByText(/Running on mocked data/)).toHaveCount(0)

  await test.step('creates a task', async () => {
    await createTrigger.click()
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel('Task title').fill(TASK_NAME)
    await dialog.getByRole('button', { name: 'Create', exact: true }).click()
    await expect(page.getByText('Task created')).toBeVisible()
  })

  await test.step('filters the board down to it', async () => {
    // Server-side filtering, so this is a second round trip through the proxy
    // carrying arguments — not the same request as the unfiltered board.
    await page.getByLabel('Search tasks').fill(TASK_NAME)
    await expect(page.getByRole('article', { name: TASK_NAME, exact: true })).toHaveCount(1)
  })

  await test.step('edits it', async () => {
    await chooseCardAction(page, TASK_NAME, 'Edit')
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel('Task title').fill(EDITED_NAME)
    await dialog.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(page.getByText('Task updated')).toBeVisible()

    // Searched again for the new name in full, rather than relying on the old
    // filter still matching. Whether `name` narrows by substring or exactly is
    // the API's business — an exact name matches under either reading, so this
    // asserts the edit landed without also asserting a filter semantics this
    // repository has no contract for.
    await page.getByLabel('Search tasks').fill(EDITED_NAME)
    await expect(page.getByRole('article', { name: EDITED_NAME, exact: true })).toHaveCount(1)
  })

  await test.step('deletes it', async () => {
    await chooseCardAction(page, EDITED_NAME, 'Delete')
    // Named, because a React Aria toast is itself a `role="alertdialog"` and an
    // unqualified query would match the "Task updated" toast still on screen.
    const confirm = page.getByRole('alertdialog', { name: `Delete ${EDITED_NAME}` })
    await confirm.getByRole('button', { name: 'Delete', exact: true }).click()
    await expect(page.getByText('Task deleted')).toBeVisible()

    // The filter is still applied and now matches nothing, which is a stronger
    // statement than the card being gone: the board refetched and the server
    // agreed the task no longer exists.
    await expect(page.getByText('No tasks match these filters')).toBeVisible()
  })

  // The assertion this file exists for, and the one that cannot pass against a
  // local dev server: the app reached its own `/api/graphql` and the function
  // there answered. Only successes are counted — a transient upstream 5xx that
  // React Query retried past is not a broken deployment, and every step above
  // has already asserted the UI got what it asked for.
  expect(proxyStatuses.filter((status) => status === 200).length).toBeGreaterThan(0)
})

test.afterEach(async ({ request }) => {
  try {
    await deleteTasksFromThisRun(request)

    // Say out loud whether the board is actually clean, rather than inferring it
    // from the test having passed. The delete step asserts the *UI* stopped
    // showing the card; this asks the API directly, after the fact, which is the
    // question someone looking at RAVN's shared board actually has.
    const remaining = await findTasksFromThisRun(request)
    const label = createdTaskId ?? '(id never seen)'
    console.warn(
      remaining.length === 0
        ? `e2e: board is clean — task ${label} is gone`
        : `e2e: ${String(remaining.length)} task(s) REMAIN and must be removed by hand: ` +
            remaining.map((task) => `${task.id} "${task.name}"`).join(', '),
    )
  } catch (error) {
    // Logged, not thrown. The test's own result is already decided by the time
    // this runs, and a cleanup failure surfacing as a test failure would name
    // the wrong thing — the run would read as "the deployment is broken" when
    // what actually happened is "the tidy-up could not reach it". Silence is
    // the other wrong answer: a leftover task on a live board is worth saying
    // out loud, because someone has to go and remove it.
    console.warn(`e2e cleanup: failed, a task named "…${RUN_ID}" may remain — ${String(error)}`)
  }
})
