import { describe, expect, it } from 'vitest'
import { readApiConfig, shouldStartMockWorker } from './env'

function env(overrides: Partial<ImportMetaEnv>): ImportMetaEnv {
  return overrides as ImportMetaEnv
}

describe('readApiConfig', () => {
  it('returns the config when both values are present', () => {
    expect(
      readApiConfig(env({ VITE_API_URL: 'https://api.test/graphql', VITE_API_TOKEN: 'abc' })),
    ).toEqual({ url: 'https://api.test/graphql', token: 'abc' })
  })

  it('falls back to the mock when nothing is configured', () => {
    expect(readApiConfig(env({}))).toBeUndefined()
  })

  it('falls back to the mock when the URL is set but the token is not', () => {
    // A URL without a token reaches a real server that rejects every query, so
    // the app would look broken rather than unconfigured.
    expect(readApiConfig(env({ VITE_API_URL: 'https://api.test/graphql' }))).toBeUndefined()
  })

  it('treats a blank token as missing, since a half-filled .env is the common case', () => {
    expect(
      readApiConfig(env({ VITE_API_URL: 'https://api.test/graphql', VITE_API_TOKEN: '   ' })),
    ).toBeUndefined()
  })

  it('trims surrounding whitespace copied in from an email', () => {
    expect(
      readApiConfig(env({ VITE_API_URL: ' https://api.test/graphql ', VITE_API_TOKEN: ' abc ' })),
    ).toEqual({ url: 'https://api.test/graphql', token: 'abc' })
  })
})

describe('shouldStartMockWorker', () => {
  it('starts the worker when nothing is configured', () => {
    expect(shouldStartMockWorker(env({}))).toBe(true)
  })

  it('leaves the worker off when a real endpoint and token are both present', () => {
    expect(
      shouldStartMockWorker(
        env({ VITE_API_URL: 'https://api.test/graphql', VITE_API_TOKEN: 'abc' }),
      ),
    ).toBe(false)
  })

  it('starts the worker for a URL with no token — the state `cp .env.example .env` leaves behind', () => {
    // The regression this exists for. The bootstrap used to gate on the URL
    // alone, so this case started no worker while the client was still aimed at
    // the mock host: every request failed against a name that does not resolve,
    // under a banner claiming the app was running on mocked data.
    expect(shouldStartMockWorker(env({ VITE_API_URL: 'https://api.test/graphql' }))).toBe(true)
    expect(
      shouldStartMockWorker(
        env({ VITE_API_URL: 'https://api.test/graphql', VITE_API_TOKEN: '  ' }),
      ),
    ).toBe(true)
  })
})
