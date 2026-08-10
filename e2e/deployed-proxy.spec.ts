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

/**
 * The board scrolls sideways; the page must not.
 *
 * This has to live in a real browser, which is why it is here and not in the unit
 * suite: jsdom has no layout, so `scrollWidth` is 0 everywhere and the defect is
 * invisible to every test the gate runs.
 *
 * What it caught: five 348px columns in an `overflow-x-auto` container scrolled
 * correctly *inside* the board, and Chrome still added their width to the document's
 * scrollable area. The page then scrolled 434px at a 1582px viewport, sliding the
 * sidebar and the header off screen to reveal nothing — there is no content out there.
 *
 * The cure is `contain: paint` on the wrapper, and it is the only one that worked.
 * `overflow-x: clip`/`hidden` on the shell, on `#root`, on `main`, and on the wrapper
 * itself all left the document at 2016, as did `min-width: 0`. So this asserts the
 * *behaviour* rather than the class: a future refactor that drops the containment for
 * something that looks equivalent fails here rather than shipping.
 */
test('the page does not scroll horizontally while the board does', async ({ page }) => {
  await page.setViewportSize({ width: 1582, height: 1035 })
  await page.goto('/')
  // Wait for the BOARD, not the toolbar. `Create task` paints immediately; the columns
  // live inside `AsyncSection` and appear only once the tasks query resolves, so
  // measuring on the button alone found no scroll container and returned null.
  await expect(page.getByRole('heading', { name: /^Backlog/ })).toBeVisible()

  // Passed as a **string** rather than a function, and that is this project's rule
  // being followed rather than dodged. `e2e/tsconfig.json` leaves the DOM lib out on
  // purpose — "a spec that can reach `document` compiles fine and then fails at
  // runtime, because the page is on the other side of a websocket". A string body
  // says that out loud; a typed arrow function would have needed the lib added and
  // would have made remote code look local.
  const measured: { overflowsBy: number; pageScrollX: number; boardScrolls: boolean } | null =
    await page.evaluate(`(() => {
    const de = document.documentElement
    const board = document.querySelector('[class*="overflow-x-auto"]')
    if (!board) return null
    window.scrollTo({ left: 900, behavior: 'instant' })
    const pageScrollX = window.scrollX
    window.scrollTo({ left: 0, behavior: 'instant' })
    return {
      overflowsBy: de.scrollWidth - de.clientWidth,
      pageScrollX,
      boardScrolls: board.scrollWidth > board.clientWidth,
    }
  })()`)

  expect(measured).not.toBeNull()
  // The page: no scrollable width, and a scroll attempt that goes nowhere. Both,
  // because a document can report width it will not actually scroll.
  expect(measured?.overflowsBy).toBe(0)
  expect(measured?.pageScrollX).toBe(0)
  // The control. Without it this passes just as well on a board that stopped
  // scrolling at all, which would be a worse bug than the one being fixed.
  expect(measured?.boardScrolls).toBe(true)
})

/**
 * Neither view may scroll the page sideways, at any width.
 *
 * The test above this one pins the same property, and could not reach this: it queries
 * `[class*="overflow-x-auto"]` — the board — at a single `Desktop Chrome` viewport, so it
 * is scoped to one view at one width. It passed green throughout the entire period the
 * list view scrolled the page at every phone width. This closes the class rather than the
 * instance: both views, four widths, all of them narrow, because that is where the list
 * view failed and where the board never did.
 *
 * What it caught: the list view overflowed the document by 667px at 375, 554 at 768, 298
 * at 1024 and 42 at 1280, sliding the sidebar and the header off screen. The cure is the
 * one `#142` proved for the board — see `board-list-table.tsx`.
 *
 * `tables` is the control that the toggle actually changed the view rather than the probe
 * measuring the same thing twice: the list view renders one `<table>` per status group and
 * the board view renders none. Asserted as "some" and "none" rather than a count, so adding
 * a sixth status does not fail a test that has nothing to do with statuses.
 */
test('neither view scrolls the page sideways at narrow widths', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /^Backlog/ })).toBeVisible()

  const READ = `(() => {
    const de = document.documentElement
    return {
      pageOverflowBy: de.scrollWidth - de.clientWidth,
      tables: document.querySelectorAll('table').length,
    }
  })()`

  // The instrument's own control, run first and once. Every assertion below is a zero, and
  // a zero from an expression that could not have reported anything else is not evidence —
  // this repo's most repeated failure. Plant an element wider than the viewport, confirm the
  // very same expression flips, remove it, confirm it returns to baseline.
  const control: { base: number; planted: number; restored: number } = await page.evaluate(`(() => {
    const de = document.documentElement
    const base = de.scrollWidth - de.clientWidth
    const spy = document.createElement('div')
    spy.style.cssText = 'width:' + (window.innerWidth + 400) + 'px;height:4px;position:relative'
    document.body.appendChild(spy)
    const planted = de.scrollWidth - de.clientWidth
    spy.remove()
    return { base, planted, restored: de.scrollWidth - de.clientWidth }
  })()`)
  expect(control.base).toBe(0)
  expect(control.planted).toBeGreaterThan(0)
  expect(control.restored).toBe(0)

  for (const width of [375, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 })

    for (const view of ['Grid view', 'List view'] as const) {
      await page.getByRole('radio', { name: view }).click()
      const reading: { pageOverflowBy: number; tables: number } = await page.evaluate(READ)
      const where = `${view} @${String(width)}`

      if (view === 'List view') {
        expect(reading.tables, `${where}: expected the list view's tables`).toBeGreaterThan(0)
      } else {
        expect(reading.tables, `${where}: expected no tables in the board view`).toBe(0)
      }
      expect(reading.pageOverflowBy, `${where}: the page scrolls sideways`).toBe(0)
    }
  }
})

/**
 * The *loading* board must not scroll the page sideways either.
 *
 * The third instance of one defect, and the one that outlived the other two: `BoardSkeleton`
 * draws five 348px columns like the real board but had neither a scroll container nor paint
 * containment, so its 1868px went to the document. The page scrolled 884px at 1280, 564 at
 * 1600 and 244 at 1920 while the tasks query was in flight. It survived both `#142` and
 * `#144` precisely because it is transient — every guard above measures a board that has
 * already loaded, and none of them can see this.
 *
 * **Which makes this the arm most likely to be vacuous, so it does not trust its own setup.**
 * If the `Tasks` response is not actually held open, the page under measurement is the loaded
 * board and every assertion here silently becomes a duplicate of the test above. Two controls
 * rule that out before the measurement is read: the live region must say `Loading tasks`, and
 * there must be no column headings on the page — the loaded board renders one per status.
 *
 * The widths are the three where it failed. 375 and 1024 are omitted deliberately rather than
 * forgotten: the skeleton wraps there and read 0 before the fix too, so they would pass either
 * way and could only dilute the result.
 */
test('the loading board does not scroll the page sideways either', async ({ page }) => {
  // Hold the tasks query open so the skeleton is what is on screen when we measure. The
  // route stays pending; navigating away abandons it, which is what ends each iteration.
  await page.route('**/graphql', async (route) => {
    if ((route.request().postData() ?? '').includes('Tasks')) {
      await new Promise((resolve) => setTimeout(resolve, 8000))
    }
    await route.continue()
  })

  for (const width of [1280, 1600, 1920]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/', { waitUntil: 'commit' })

    // Deterministic rather than a timeout: wait until the app says it is loading.
    await page.waitForFunction(`(() => {
      const region = document.querySelector('[role="status"]')
      return region !== null && region.textContent.trim() === 'Loading tasks'
    })()`)

    const reading: { pageOverflowBy: number; status: string; headings: number } =
      await page.evaluate(`(() => {
      const de = document.documentElement
      const region = document.querySelector('[role="status"]')
      return {
        pageOverflowBy: de.scrollWidth - de.clientWidth,
        status: region === null ? '' : region.textContent.trim(),
        headings: document.querySelectorAll('h2').length,
      }
    })()`)
    const where = `loading @${String(width)}`

    // The controls, read before the assertion they qualify.
    expect(reading.status, `${where}: not on the loading state`).toBe('Loading tasks')
    expect(reading.headings, `${where}: the board loaded, so this measured the wrong thing`).toBe(0)

    expect(reading.pageOverflowBy, `${where}: the page scrolls sideways`).toBe(0)
  }
})

/** One viewport's worth of board geometry, as the string probe below returns it. */
interface BoardReading {
  boardWidth: number
  hiddenBy: number
  pageOverflowBy: number
}

/**
 * A wider window has to show more of the board.
 *
 * It did not. `AppLayout` capped its content at 1440px, which left the board 1176px —
 * and 1176px was the answer at 1600, 1920, 2200 *and* 2600, because the cap binds long
 * before the viewport does. Measured on the deployment: 692px of board hidden at every
 * one of those widths, three of the five columns visible, `Done` and `Cancelled` cut at
 * all of them. The widest monitor available revealed no more of the board than a 1600px
 * one, and less than a 1024px one, where the wrapping layout fits all five.
 *
 * Two claims, because either alone is survivable by a regression. **Widening helps** is
 * the general one and holds at every step. **The whole board fits somewhere** is the
 * specific one, and 2400px is where it is asserted rather than 2200px on purpose: at
 * 2200 the board measures 1872px against the 1868px five columns need, and four pixels
 * of slack is not a margin. A platform whose classic vertical scrollbar takes 15px —
 * which CI's Linux Chromium has and this was measured on macOS's overlay scrollbars,
 * where it does not — would put that row at 1857px and fail a green build. 2400px
 * leaves ~204px, which is slack rather than luck.
 *
 * Four viewports, because the widest two alone cannot tell this fix from a regression:
 * the 1024 reading is the control that the narrow *wrapping* layout still fits its board
 * entirely, so a fix that bought desktop width by clipping the phone fails here. And
 * `pageOverflowBy` is checked at all four, so "widen the board" cannot quietly become
 * "widen the document" — the defect the test above this one exists for.
 *
 * Not asserted: that the board never scrolls. Five 348px columns need 1868px, and the
 * 348px pin is a written decision `board.tsx` argues for — five equal shares of 1440px
 * leave ~200px cards, at which point the points label, the date badge and the tag row
 * all wrap. Below ~2130px scrolling is correct behaviour, not a defect.
 *
 * One `goto`, four viewports: this is pure CSS, so a resize re-lays out and three more
 * page loads against a live deployment are not warranted.
 */
test('a wider window shows more of the board', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /^Backlog/ })).toBeVisible()

  // A string body for the same reason as the test above: `e2e/tsconfig.json` leaves the
  // DOM lib out, so remote code must not be made to look local.
  const READ = `(() => {
    const de = document.documentElement
    const board = document.querySelector('[class*="overflow-x-auto"]')
    if (!board) return null
    return {
      boardWidth: board.clientWidth,
      hiddenBy: board.scrollWidth - board.clientWidth,
      pageOverflowBy: de.scrollWidth - de.clientWidth,
    }
  })()`

  // Narrowed through a throw rather than a `!`, which is a lint error here, and rather
  // than `?.`, which would make the arithmetic below `number | undefined`. A missing
  // scroll container is a real outcome — it is what a board that never loaded looks
  // like — so it earns a message naming the width it happened at.
  const readAt = async (width: number): Promise<BoardReading> => {
    await page.setViewportSize({ width, height: 1000 })
    const reading: BoardReading | null = await page.evaluate(READ)
    if (reading === null) throw new Error(`no board scroll container at ${String(width)}px`)
    return reading
  }

  const at1024 = await readAt(1024)
  const at1600 = await readAt(1600)
  const at1920 = await readAt(1920)
  const at2400 = await readAt(2400)

  // Claim one: widening helps, at every step. Before the fix all three of these read
  // 1176 and each of these lines fails.
  expect(at1920.boardWidth).toBeGreaterThan(at1600.boardWidth + 250)
  expect(at2400.boardWidth).toBeGreaterThan(at1920.boardWidth + 400)

  // Claim two: past a certain width the board is simply all there. Before the fix this
  // read 692 at every width from 1600 up, however large the monitor.
  expect(at2400.hiddenBy).toBe(0)

  // Controls. The narrow layout wraps rather than scrolling, so its board is whole —
  // a fix that bought desktop width by clipping the phone would fail here. And the
  // document must not scroll sideways at any of the four.
  expect(at1024.hiddenBy).toBe(0)
  expect(at1024.pageOverflowBy).toBe(0)
  expect(at1600.pageOverflowBy).toBe(0)
  expect(at1920.pageOverflowBy).toBe(0)
  expect(at2400.pageOverflowBy).toBe(0)
})
