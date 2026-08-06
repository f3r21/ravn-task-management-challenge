/**
 * A workaround for one dead host in RAVN's seed data. Delete it when that is fixed.
 *
 * Every seeded `User.avatar` the live API returns points at
 * `https://avatars.dicebear.com/api/initials/<initials>.svg`, a service that was
 * decommissioned. So every task card on the deployed site shows a grey square with
 * a red mark instead of a person.
 *
 * The reflex fix — an `onError` handler on the `<img>` — cannot work here, and it
 * is worth saying why before someone spends an afternoon on it. The host answers
 * `410 Gone`, but with a *valid* 14.6 kB SVG body (`#E3E3E3` background, `#BABABA`
 * shapes, `#C70000` text — that is the placeholder on screen). Browsers ignore the
 * status code for an image whose payload decodes, so the element fires `load`, not
 * `error`, and reports a `naturalWidth` of 150. There is no failure to hook.
 *
 * Rewriting the URL to dicebear's current API is not the fix either: the path says
 * `initials`, so the seed data is asking a third party to draw two letters that
 * `Avatar` already derives from `fullName`. Treating the dead host as "no avatar"
 * hands the same intent to the fallback that is already there, with nothing
 * third-party in the loop — and it is what the design draws, since every avatar in
 * the Figma mockups and in `docs/screenshots/dashboard.jpg` is initials.
 *
 * This lives here rather than inside `Avatar` because the component is not wrong:
 * it renders the `src` it is handed. The defect is that the app hands it a URL it
 * knows is dead, so the correction belongs at the boundary where a GraphQL `User`
 * becomes component props — the call sites of `Avatar`.
 */

/**
 * Hosts known to serve a decoding placeholder image instead of a real avatar.
 *
 * Matched on hostname rather than on a substring of the URL, so a path that merely
 * mentions the host (`https://cdn.example/avatars.dicebear.com/x.svg`) is left alone.
 */
const DECOMMISSIONED_AVATAR_HOSTS = new Set(['avatars.dicebear.com'])

/**
 * The avatar URL to render, or `undefined` when there is nothing worth rendering —
 * which is the value that makes `Avatar` fall back to the person's initials.
 *
 * A URL that does not parse is passed through untouched: only a known-dead host is
 * this function's business, and a relative path is a perfectly good `src`.
 */
export function avatarSrcUnlessDecommissioned(
  avatar: string | null | undefined,
): string | undefined {
  if (avatar == null) {
    return undefined
  }

  if (URL.canParse(avatar) && DECOMMISSIONED_AVATAR_HOSTS.has(new URL(avatar).hostname)) {
    return undefined
  }

  return avatar
}
