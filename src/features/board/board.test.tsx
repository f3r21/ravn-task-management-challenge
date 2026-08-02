import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makeTask } from '@/mocks/task-fixtures'
import { renderWithProviders } from '@/test/test-utils'
import { Board } from './board'
import { Status } from './task-types'

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
          makeTask({ id: 't1', name: 'Slack', status: Status.Todo }),
          makeTask({ id: 't2', name: 'Twitter', status: Status.Done }),
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

  it('counts the tasks in each column, zero-padded like the design', () => {
    renderWithProviders(
      <Board
        tasks={[
          makeTask({ id: 't1', status: Status.Todo }),
          makeTask({ id: 't2', status: Status.Todo }),
        ]}
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
})
