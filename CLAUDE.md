# CLAUDE.md

Graded RAVN take-home, public on GitHub. React 19, TypeScript strict, Vite, TanStack Query over a
GraphQL API, with `@ravn/ui-kit` supplying the UI layer. Reasoning lives in code comments, where
the density is deliberately high, and in `docs/` for a human reviewer.

## Commands

```bash
npm run gate           # typecheck, lint, format:check, coverage. This is the bar.
npm run dev            # Vite on :5173, runs with no credentials
npm run build          # tsc --noEmit then a production bundle
npm test               # the suite, once
npm run codegen        # regenerate src/graphql/generated/ from schema.graphql
npm run schema:check   # fail if schema.graphql has drifted from the live API
npm run test:e2e       # one Playwright spec against a deployment. Needs E2E_BASE_URL.
```

The last two sit outside `gate` deliberately, one needing the network and one a deployment. CI
runs `gate` plus `build` on every pull request. Nothing enforces `gate` before a commit.

## Invariants

- **When a kit component fails an assertion here, the fix goes in the kit, never in the test.**
  This app is what proves the package works, so loosening an assertion throws away the only
  signal the arrangement generates.
- **Generated types are the domain model.** Nothing redeclares an API shape.
- **No barrel files, no test ids, no `any`, no `@ts-ignore`, no non-null `!`.** The last three
  are lint errors, so `npm run lint` holds them at zero.
- **React Aria hooks only.** Never `react-aria-components`.
- **Comments explain why, and a stale comment is a defect.** Change behaviour, grep for comments
  describing the old one.
- **Quality outranks completion.** The challenge grades on quality, not on features shipped.

## Branch layout

`dev` is the standing integration branch and everything PRs back into it. `main` only receives
promotions of a verified-stable `dev`. **`Closes #<n>` is inert here**, because GitHub fires the
keyword only on a merge into the default branch, which is `main`. Issues are closed by hand.

## Where the detail is

`.claude/rules/` is path-scoped, so each file loads when you touch what it governs.
`/start-issue` and `/finish-issue` hold this project's process rules and are the only copy of
most of them.
