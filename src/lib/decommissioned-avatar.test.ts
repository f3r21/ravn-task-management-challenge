import { describe, expect, it } from 'vitest'
import { avatarSrcUnlessDecommissioned } from './decommissioned-avatar'

describe('avatarSrcUnlessDecommissioned', () => {
  it('drops the dicebear URL the live API actually returns', () => {
    // Copied from a `users` query against the deployed API, placeholders and all.
    expect(avatarSrcUnlessDecommissioned('https://avatars.dicebear.com/api/initials/jd.svg')).toBe(
      undefined,
    )
  })

  it('drops the dead host whatever the scheme or path', () => {
    expect(avatarSrcUnlessDecommissioned('http://avatars.dicebear.com/api/initials/gs.svg')).toBe(
      undefined,
    )
    expect(avatarSrcUnlessDecommissioned('https://avatars.dicebear.com/')).toBe(undefined)
  })

  it('ignores the casing a hostname is written in', () => {
    expect(avatarSrcUnlessDecommissioned('https://Avatars.DiceBear.com/api/initials/rb.svg')).toBe(
      undefined,
    )
  })

  it('reports no avatar for a user the API says has none', () => {
    // `User.avatar` is nullable, and `Task.assignee` is optional at the call site,
    // so both spellings of "nobody" arrive here.
    expect(avatarSrcUnlessDecommissioned(null)).toBe(undefined)
    expect(avatarSrcUnlessDecommissioned(undefined)).toBe(undefined)
  })

  it('keeps a real avatar URL, since this is not a general-purpose filter', () => {
    expect(avatarSrcUnlessDecommissioned('https://cdn.ravn.co/avatars/alicia.png')).toBe(
      'https://cdn.ravn.co/avatars/alicia.png',
    )
  })

  it('matches the host, not the spelling of the URL', () => {
    // A live host that merely mentions the dead one in its path still serves an
    // image. Substring matching would throw it away.
    expect(avatarSrcUnlessDecommissioned('https://cdn.ravn.co/avatars.dicebear.com/jd.svg')).toBe(
      'https://cdn.ravn.co/avatars.dicebear.com/jd.svg',
    )
  })

  it('passes a URL it cannot parse straight through', () => {
    expect(avatarSrcUnlessDecommissioned('/avatars/alicia.png')).toBe('/avatars/alicia.png')
  })

  it('returns the value unchanged when parsing throws, whatever the value is', () => {
    // The relative path above is the realistic case; these are the ones that make
    // `new URL()` throw for a different reason each time, so the `catch` is pinned
    // as the contract rather than as a side effect of one input shape.
    for (const unparseable of [
      '',
      '   ',
      'not a url at all',
      'https://',
      '://no-scheme',
      'http://[',
    ]) {
      expect(avatarSrcUnlessDecommissioned(unparseable)).toBe(unparseable)
    }
  })

  it('still works where URL.canParse does not exist', () => {
    // This is the regression, not a hypothetical. The first version reached for
    // `URL.canParse`, which shipped in Chrome 120 / Firefox 115 / Safari 17 — above
    // every browser in the floor declared in `package.json`'s `browserslist`
    // (chrome 111, edge 111, firefox 128, safari 16.4, ios_saf 16.4). A build
    // target lowers syntax and never polyfills an API, so it shipped verbatim and
    // threw on the first board render, replacing the page with the error boundary.
    //
    // No test can catch this class of defect: jsdom runs on Node 22, where
    // `canParse` exists. The absence is simulated here, which is the only place in
    // the suite that can — and the check that *does* catch it is a lint rule
    // generated from that same `browserslist`, in `eslint.config.js`. This file is
    // exempt from it on purpose, because the line below is the assertion that the
    // shadowing was undone and the rule would read it as the very call it forbids.
    //
    // It is *shadowed*, not deleted, and that is not incidental. In this
    // environment `canParse` is not an own property of the global `URL` —
    // `Reflect.deleteProperty` returns `true` and leaves it reachable, so a test
    // written that way passes against the broken implementation and pins nothing.
    // Defining an own `undefined` over it is what actually hides it. Undone by
    // removing that own property again, which uncovers the inherited one;
    // restoring a saved descriptor cannot work, because there was none to save.
    const hadOwn = Object.prototype.hasOwnProperty.call(URL, 'canParse')
    const own = Object.getOwnPropertyDescriptor(URL, 'canParse')
    Object.defineProperty(URL, 'canParse', { value: undefined, configurable: true, writable: true })

    try {
      expect(
        avatarSrcUnlessDecommissioned('https://avatars.dicebear.com/api/initials/jd.svg'),
      ).toBe(undefined)
      expect(avatarSrcUnlessDecommissioned('https://cdn.ravn.co/avatars/alicia.png')).toBe(
        'https://cdn.ravn.co/avatars/alicia.png',
      )
      expect(avatarSrcUnlessDecommissioned('/avatars/alicia.png')).toBe('/avatars/alicia.png')
    } finally {
      if (hadOwn && own) {
        Object.defineProperty(URL, 'canParse', own)
      } else {
        Reflect.deleteProperty(URL, 'canParse')
      }
    }

    // The restore is asserted, not assumed: leaving `URL.canParse` shadowed would
    // silently weaken every later test in this worker.
    expect(typeof URL.canParse).toBe('function')
  })
})
