import { describe, expect, it } from 'vitest'
import { ApiError } from '@/graphql/client'
import { createQueryClient } from './query-client'

/**
 * The retry rule, tested directly.
 *
 * The app's client is not the one tests render with — tests use a client with
 * retries off, so this logic would otherwise ship unexercised. What it encodes
 * is a real decision: a rejected token will be rejected again, so retrying only
 * delays the message the user needs by several seconds.
 */
function retryPredicate() {
  const options = createQueryClient().getDefaultOptions().queries
  const retry = options?.retry
  if (typeof retry !== 'function') {
    throw new Error('Expected the default query retry to be a predicate')
  }
  return retry
}

describe('createQueryClient', () => {
  it('does not retry a rejected token, because the retry would be rejected too', () => {
    expect(retryPredicate()(0, new ApiError('Token rejected', true))).toBe(false)
  })

  it('retries an ordinary failure, which may well be transient', () => {
    expect(retryPredicate()(0, new ApiError('Server error'))).toBe(true)
  })

  it('gives up after two retries rather than hammering a broken server', () => {
    expect(retryPredicate()(2, new ApiError('Server error'))).toBe(false)
  })

  it('retries a non-ApiError, since nothing says it is permanent', () => {
    expect(retryPredicate()(0, new Error('boom'))).toBe(true)
  })

  it('never retries a mutation, which may already have applied server-side', () => {
    // Retrying a failed createTask is how a board ends up with two of the
    // same task.
    expect(createQueryClient().getDefaultOptions().mutations?.retry).toBe(false)
  })
})
