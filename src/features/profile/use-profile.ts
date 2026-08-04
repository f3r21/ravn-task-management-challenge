import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { request } from '@/graphql/client'
import { ProfileDocument } from '@/graphql/generated/graphql'
import type { User } from '@/features/board/task-types'

export const profileKeys = { current: ['profile'] as const }

/**
 * The signed-in user.
 *
 * Shared by the settings page and the header avatar, under one key, so the two
 * cannot disagree about who is signed in and the request is made once however
 * many components ask for it.
 *
 * Long `staleTime`: this changes when someone edits their own account, which is
 * not something a task board needs to poll for.
 */
export function useProfile(): UseQueryResult<User> {
  return useQuery({
    queryKey: profileKeys.current,
    queryFn: async () => {
      const data = await request(ProfileDocument, {})
      return data.profile
    },
    staleTime: 5 * 60_000,
  })
}
