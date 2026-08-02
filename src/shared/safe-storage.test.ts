import { afterEach, describe, expect, it, vi } from 'vitest'
import { readJson, writeJson } from './safe-storage'

interface Prefs {
  view: string
}

function isPrefs(value: unknown): value is Prefs {
  return typeof value === 'object' && value !== null && typeof (value as Prefs).view === 'string'
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('readJson', () => {
  it('round-trips a value written by writeJson', () => {
    writeJson('prefs', { view: 'grid' })

    expect(readJson<Prefs>('prefs')).toEqual({ view: 'grid' })
  })

  it('returns undefined for a key that was never written', () => {
    expect(readJson('missing')).toBeUndefined()
  })

  it('returns undefined instead of throwing when the stored value is not valid JSON', () => {
    localStorage.setItem('broken', '{not json')
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(readJson('broken')).toBeUndefined()
  })

  it('rejects a well-formed value whose shape no longer matches the predicate', () => {
    // The shape a previous release persisted. Parsing succeeds, so without the
    // predicate this would be handed back as a `Prefs` and blow up downstream.
    writeJson('prefs', { layout: 'grid' })

    expect(readJson('prefs', isPrefs)).toBeUndefined()
  })

  it('accepts a value that satisfies the predicate', () => {
    writeJson('prefs', { view: 'list' })

    expect(readJson('prefs', isPrefs)).toEqual({ view: 'list' })
  })
})

describe('writeJson', () => {
  it('reports success when the value lands', () => {
    expect(writeJson('prefs', { view: 'grid' })).toBe(true)
  })

  it('reports failure instead of throwing when storage rejects the write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(writeJson('prefs', { view: 'grid' })).toBe(false)
  })
})
