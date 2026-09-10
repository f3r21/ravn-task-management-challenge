---
name: structure
description: Feature-scoped layout, the lint-enforced layering ban, and the two directories that override it.
paths:
  - 'src/**'
  - 'eslint.config.js'
---

# Structure and routing

Feature-scoped, named exports, no barrel files. `app/` (routing, providers, query client, error
pages), `features/` (board, profile, navigation), `ui/` (shared design-system pieces),
`graphql/`, `lib/`, `shared/`, `mocks/`, `test/`. A component lives in the feature that uses it
and moves to `ui/` when something else needs it. `@/` aliases `src/`.

`routes` is exported as a plain `RouteObject[]` rather than a configured router, so tests mount
the real table in a memory router and navigate for real. Swapping components would not exercise
route matching. `AppLayout` wraps each element instead of being a parent route with an
`<Outlet />`: a parent keeps the shell mounted across navigations, which would put the not-found
page inside chrome, implying the app is fine.

**The layering is lint-enforced since #40, having been prose until then, and prose does not fail
a build.** `no-restricted-imports` in `eslint.config.js` bans `@/features/*` and
`@/features/*/**` across `src/`, so no feature reaches into another and no lower layer
(`mocks/`, `lib/`, `ui/`, `graphql/`) reaches up into one.

What forced it: `User` is returned by the `Users`, `Profile` **and** `Tasks` queries and belongs
to none of them, yet it lived in `features/board/task-types.ts`, so `features/profile` and every
MSW handler imported `@/features/board` to learn what a user is, and deleting `features/board`
would have stopped the mocks compiling.

**Two directories override the ban and neither is cleanup debt.** `src/app/` composes features
because that is the routing layer's job, and the rule as first drafted would have failed on
`routes.tsx` itself. `src/features/navigation/` is the shell in everything but its directory,
mounted once by `AppLayout`, and its `useBoardFilters` edge is load-bearing: the `name` URL
parameter had two independent writers until `FILTER_PARAMS` collapsed them, so renaming the key
broke the header's search box with no type error and no failing test. Re-derive rather than
taking it from here:

```bash
git log -S 'FILTER_PARAMS' --oneline
git show f683cb0 -- src/features/navigation/app-header.tsx | grep -E '^[-+].*(URLSearchParams|setFilter)'
```

Banning the import and re-exporting the hook would satisfy the linter and restore the defect.

**The generated barrel is banned by `paths`, not deleted, and the spelling is the trap.**
`src/graphql/generated/index.ts` is a one-line `export * from "./gql"` that nothing imports. It
does contradict the no-barrels rule, but it is codegen output the `client` preset cannot be told
to skip, so deleting it buys one clean commit and a dirty diff on every `npm run codegen` after.
A `patterns` entry is a gitignore-style glob in which a bare directory name also matches
everything beneath it, so `{ group: ['@/graphql/generated'] }` flagged the imports of
`@/graphql/generated/graphql`, the correct path every consumer uses. `paths` matches the
specifier exactly.
