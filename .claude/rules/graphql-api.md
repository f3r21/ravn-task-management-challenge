# GraphQL & Data Layer Rules

## Client & Architecture

- **Single Source of Truth:** Server state is managed exclusively by TanStack React Query v5.
- **No Client Library Cache:** Use the hand-written typed `fetch` wrapper. Do not add `graphql-request`, Apollo Client, or Relay.
- **Operations:** Restrict operations to the specified API contract:
  - Queries: `tasks`, `profile`
  - Mutations: `createTask`, `updateTask`, `deleteTask`

## Code Generation & Schema Drift

- **Type Generation:** Run `npx graphql-codegen` (or `npm run codegen`) to update types from `schema.graphql`.
- **Schema Drift Check:** Run `npm run schema:check` to compare `schema.graphql` against the live Railway endpoint (`https://syn-api-production-e95c.up.railway.app/graphql`).
- **Strict Types:** Never use `any` or `@ts-ignore` on GraphQL responses or mutation parameters.

## Mock Service Worker (MSW)

- MSW backs both unit/integration tests and the credential-free dev server.
- Keep `src/mocks/task-store.ts` in sync with real GraphQL schema types.
