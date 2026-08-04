import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { request } from '@/graphql/client'
import { UsersDocument } from '@/graphql/generated/graphql'
import type { User } from './task-types'

export const userKeys = { all: ['users'] as const }

/**
 * The people a task can be assigned to.
 *
 * One query key shared by every consumer — the create modal, the edit modal and
 * the assignee filter — so the directory is fetched once no matter how many of
 * them are mounted, and they cannot disagree about who exists.
 *
 * Longer `staleTime` than the board: a team's roster changes on the order of
 * weeks, so refetching it as often as the tasks would be waste.
 */
export function useUsers(): UseQueryResult<User[]> {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const data = await request(UsersDocument, {})
      return data.users
    },
    staleTime: 5 * 60_000,
  })
}
