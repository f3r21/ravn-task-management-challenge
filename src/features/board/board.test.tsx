import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makeTask } from '@/mocks/task-fixtures'
import { renderWithProviders } from '@/test/test-utils'
import { Board } from './board'
import type { Status } from './task-types'

const now = new Date('2026-08-02T12:00:00.000Z')

describe('Board', () => {
  it('renders a column for every status the brief lists, even empty ones', () => {
    renderWithProviders(<Board tasks={[]} view="grid" now={now} />)

    for (const name of [/backlog/i, /todo/i, /in progress/i, /done/i, /cancelled/i]) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
  })

  it('puts each task in the column matching its status', () => {
    renderWithProviders(
      <Board
        tasks={[
          makeTask({ id: 't1', name: 'Slack', status: 'TODO' }),
          makeTask({ id: 't2', name: 'Twitter', status: 'DONE' }),
        ]}
        view="grid"
        now={now}
      />,
    )

    const todo = screen.getByRole('region', { name: /todo/i })
    const done = screen.getByRole('region', { name: /done/i })

    expect(within(todo).getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
    expect(within(done).getByRole('heading', { name: 'Twitter' })).toBeInTheDocument()
    expect(within(todo).queryByRole('heading', { name: 'Twitter' })).not.toBeInTheDocument()
  })

  it('orders a column by position, not by the order the API returned', () => {
    // `position` was selected by the query and read by nothing, so the board
    // rendered in whatever order the response happened to arrive in.
    renderWithProviders(
      <Board
        tasks={[
          makeTask({ id: 't1', name: 'Third', status: 'TODO', position: 30 }),
          makeTask({ id: 't2', name: 'First', status: 'TODO', position: 10 }),
          makeTask({ id: 't3', name: 'Second', status: 'TODO', position: 20 }),
        ]}
        view="grid"
        now={now}
      />,
    )

    const todo = screen.getByRole('region', { name: /todo/i })
    const names = within(todo)
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)

    expect(names).toEqual(['First', 'Second', 'Third'])
  })

  it('counts the tasks in each column, zero-padded like the design', () => {
    renderWithProviders(
      <Board
        tasks={[makeTask({ id: 't1', status: 'TODO' }), makeTask({ id: 't2', status: 'TODO' })]}
        view="grid"
        now={now}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Todo (02)' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Backlog (00)' })).toBeInTheDocument()
  })

  it('says a column is empty rather than leaving a blank gap', () => {
    renderWithProviders(<Board tasks={[]} view="grid" now={now} />)

    expect(screen.getAllByText(/no tasks here yet/i)).toHaveLength(5)
  })

  it('leaves out a task whose status the build does not know, without crashing', () => {
    // What happens when the API grows a sixth status before the UI does.
    renderWithProviders(
      <Board
        tasks={[makeTask({ id: 't1', name: 'Ghost', status: 'ARCHIVED' as Status })]}
        view="grid"
        now={now}
      />,
    )

    expect(screen.queryByRole('heading', { name: 'Ghost' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Todo (00)' })).toBeInTheDocument()
  })

  it('renders the same tasks in list view', () => {
    renderWithProviders(<Board tasks={[makeTask({ name: 'Slack' })]} view="list" now={now} />)

    expect(screen.getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  })

  it('lays a task out differently in each view, so the switcher does something', () => {
    // Asserting the same heading renders in both views — which is all the test above
    // does — passes even when the two branches are byte-identical. It was: below the
    // `sm` breakpoint the board is already a single stacked column, so the switcher had
    // no effect at all on a phone.
    //
    // **The anchor changed with the migration and is now stronger than it was.** It used
    // to compare the two `<article>` class strings, which is a proxy — two different
    // strings prove only that something differs. The views are now structurally distinct
    // components: the board is per-status `region` landmarks holding `article` cards, the
    // list is one `table`. Asserting the roles says what the switcher actually does, and
    // it cannot pass on a cosmetic difference.
    const task = makeTask({ id: 't1', name: 'Slack', status: 'TODO' })

    const grid = renderWithProviders(<Board tasks={[task]} view="grid" now={now} />)
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getAllByRole('region', { name: /todo/i })).toHaveLength(1)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    grid.unmount()

    renderWithProviders(<Board tasks={[task]} view="list" now={now} />)
    expect(screen.getAllByRole('table').length).toBeGreaterThan(0)
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /todo/i })).not.toBeInTheDocument()
  })
})
