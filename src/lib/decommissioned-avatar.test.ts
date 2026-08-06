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
})
