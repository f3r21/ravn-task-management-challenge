import { ApiError } from '@/graphql/client'
import { formatUtcTimestamp } from '@/lib/due-date'
import { Avatar } from '@/ui/avatar/avatar'
import { Skeleton } from '@/ui/skeleton/skeleton'
import type { User } from '@/features/board/task-types'
import { useProfile } from './use-profile'

/**
 * A label/value pair in the details list.
 *
 * `<dl>` rather than a grid of divs: the pairing between a label and its value
 * is the structure here, and a description list is the element that carries it.
 * A screen reader then announces "Email, alicia@ravn.co" rather than two
 * unrelated strings that happen to sit next to each other.
 */
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-text-secondary/10 flex flex-col gap-1 border-b py-4 last:border-b-0">
      <dt className="text-text-secondary text-body-m">{label}</dt>
      <dd className="text-body-m font-semibold">{value}</dd>
    </div>
  )
}

function userTypeLabel(type: User['type']): string {
  return type === 'ADMIN' ? 'Admin' : 'Candidate'
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <p role="status" className="sr-only">
        Loading your profile
      </p>
      <Skeleton className="size-20 rounded-full" />
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-12 w-full max-w-md" />
      ))}
    </div>
  )
}

/**
 * The settings route.
 *
 * The brief has no design for this screen, so it reuses the pieces the rest of
 * the app is built from — the same surfaces, radii, type scale and avatar — and
 * adds nothing new.
 *
 * The brief also asks for a `Position` field. The API does not have one: `User`
 * exposes id, fullName, email, avatar, type, createdAt and updatedAt, and
 * nothing else. Inventing a value would be worse than saying so, and this is
 * noted in the README rather than silently dropped.
 */
export function ProfilePage() {
  const { data: profile, status, error, refetch } = useProfile()

  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-body-xl font-semibold">My task</h1>

      {status === 'pending' ? <ProfileSkeleton /> : null}

      {status === 'error' ? (
        <div role="alert" className="flex flex-col items-start gap-4">
          <p className="text-body-l font-semibold">Could not load your profile</p>
          <p className="text-text-secondary text-body-m">
            {error instanceof ApiError ? error.message : 'Please try again.'}
          </p>
          {error instanceof ApiError && error.isUnauthenticated ? null : (
            <button
              type="button"
              onClick={() => {
                void refetch()
              }}
              className="rounded-card bg-brand text-body-m px-4 py-2 font-semibold"
            >
              Try again
            </button>
          )}
        </div>
      ) : null}

      {status === 'success' ? (
        <section
          aria-labelledby="profile-heading"
          className="bg-surface-raised rounded-bar flex max-w-2xl flex-col gap-6 p-6"
        >
          <div className="flex items-center gap-4">
            <Avatar src={profile.avatar} name={profile.fullName} size={40} />
            <h2 id="profile-heading" className="text-body-l font-semibold">
              {profile.fullName}
            </h2>
          </div>

          <dl className="flex flex-col">
            <Detail label="Full name" value={profile.fullName} />
            <Detail label="Email" value={profile.email} />
            <Detail label="Type" value={userTypeLabel(profile.type)} />
            <Detail label="Created at" value={formatUtcTimestamp(profile.createdAt)} />
            <Detail label="Updated at" value={formatUtcTimestamp(profile.updatedAt)} />
          </dl>
        </section>
      ) : null}
    </main>
  )
}
