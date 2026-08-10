# Deployment

Vercel, at **[ravn-task-management-challenge.vercel.app](https://ravn-task-management-challenge.vercel.app)**,
with a preview deployment per pull request.

**Why a static SPA has a serverless function.** Vite replaces `import.meta.env.VITE_*` at
build time, which means a deployed build configured the way local development is configured
would ship RAVN's access token as a readable string in `dist/` — findable with devtools, or
with `grep`, on a public URL. There is no browser-side fix for that: the token has to reach
the API, and everything the browser can read is public. So it never reaches the browser.
`api/graphql.ts` runs on Vercel, reads `API_TOKEN` from the deployment's environment — no
`VITE_` prefix, which is exactly what would put it back in the bundle — and forwards the
query. The app posts to `/api/graphql` on its own origin carrying no credential at all.

**What that cost.** `readApiConfig` in `src/lib/env.ts` had two states, and it required a
URL and a token together — so a deployment pointed at `/api/graphql` with the token held
server-side read as "not configured", fell back to the MSW mock, and would have served
seeded data under a banner telling the visitor to edit a `.env` file they do not have. It
now has three:

|             | `VITE_API_URL` | Token    | Where                                               |
| ----------- | -------------- | -------- | --------------------------------------------------- |
| **mock**    | unset          | —        | a clone with no credentials; MSW serves seeded data |
| **direct**  | absolute       | required | local development with a filled-in `.env`           |
| **proxied** | `/api/graphql` | none     | the deployment; the server holds it                 |

The rule that a URL needs a token is unchanged rather than relaxed. It exists because an
absolute URL reaches a server that answers every query `UNAUTHENTICATED` — the app looks
broken rather than unconfigured — and a same-origin path cannot fail that way, because it
reaches this app's own origin. `//host/path` is excluded by name: it starts with a slash
and resolves somewhere else entirely.

**The endpoint is intentionally open, which is a trade rather than an oversight.** The app
has no concept of a user, so there is nothing to authenticate a caller against; anyone who
finds the URL can post a query through it. Checking `Origin` would stop nothing, since a
header is trivially set outside a browser. What the proxy does buy is that the credential
itself stays unreadable and can be rotated in one place — the difference between a misused
endpoint and a leaked token.

The rest is small. `vercel.json` rewrites everything that is not a static file or a function
to `index.html`, because `createBrowserRouter` serves `/settings` from JavaScript and a
direct hit on it would otherwise ask the host for a file that does not exist; `/api/` is
excluded so a mistyped function path 404s instead of being answered with the app's HTML.
`VITE_API_URL` is pinned in that file rather than in the dashboard, because forgetting it is
silent — the deployed board would quietly show mock data. `API_TOKEN` is the only secret,
and it only exists in Vercel's environment.

The proxy is exported as `POST`, not as a default handler. Vercel reads a default export as
Node's `(req, res) => void` and ignores what it returns, so the first deploy answered
nothing at all and hung until the platform timed it out. The export name doubles as the
method restriction: anything that is not a POST is refused before the function runs.

**Two response headers, and no Content-Security-Policy.** `vercel.json` sends
`X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.
Neither can break this app — nothing here is served with a content type a browser would want
to second-guess — and the referrer policy does something real: task cards load avatars from
whatever host the API names, and without it every one of those requests carries the board's
full URL, filters and search term included, to a third party.

There is deliberately no CSP, and `frame-ancestors` is deliberately not set. A CSP would be
about eight lines and it is the thing reviewers grep for, so the reasoning matters more than
the answer. Two parts:

- **It cannot be verified before it ships.** Header rules do not apply to `vite preview` or
  `npm run dev`; the first time a policy is real is on a deployment, and a policy that is one
  directive short takes the app down in a way no local check can see beforehand. Against
  that, what a CSP defends is script injection, and this app has no `dangerouslySetInnerHTML`,
  no `eval`, no user-supplied markup and no third-party scripts — React escapes every string
  that reaches the DOM. The trade is a real outage risk against a hypothetical one.
- **Framing buys an attacker nothing here.** `frame-ancestors` stops clickjacking, and the
  action worth clickjacking is deleting a task. But `/api/graphql` is intentionally open —
  the app has no users to authenticate, so anyone who wants to delete a task can simply post
  the mutation. There is no privilege a framed click could borrow that a `curl` does not
  already have.

Both would change the moment this app grew a login. The e2e spec against the deployment (see
[Testing](#testing)) is what would catch a CSP that broke the board, so the ordering is:
users first, then the policy, with a check that can prove it.
