import type { CodegenConfig } from '@graphql-codegen/cli'

/**
 * Generates typed documents from the operations in `src/`, checked against the
 * committed `schema.graphql`.
 *
 * Reading the schema from a file rather than the live URL keeps `npm run codegen`
 * and CI free of both network access and a credential — and makes any schema
 * change a reviewable diff rather than a silent shift in generated types.
 */
const config: CodegenConfig = {
  schema: './schema.graphql',
  documents: ['src/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      presetConfig: {
        // Fragment masking hides a fragment's fields from components that did
        // not request them. Sound discipline on a large codebase; here it would
        // mean an `unmaskFragment` call at every use site for no benefit, and it
        // leaves nested fragment types as opaque `$fragmentRefs` markers rather
        // than the plain object shapes the UI actually works with.
        fragmentMasking: false,
      },
      config: {
        // The API's `DateTime` arrives as an ISO string. Left unmapped it is
        // typed `any` — which the lint config bans, and which would defeat the
        // point of generating types at all.
        scalars: { DateTime: 'string' },
        // Emit each operation as a `TypedDocumentString` — the query text, with
        // the same result/variables types attached — instead of a pre-parsed
        // AST literal.
        //
        // The transport sends a string either way, so the AST only ever existed
        // to be turned back into the text codegen already had, and `print()` was
        // enough of a reference to pull `graphql` into the entry chunk. A string
        // needs no library at all: `graphql` is now a build-and-scripts
        // dependency, not something users download.
        //
        // The cost is that nothing in the app can inspect an operation
        // structurally any more. Nothing did, and MSW matches handlers by
        // parsing the request body itself, so its `graphql.query('Tasks', …)`
        // handlers are unaffected.
        documentMode: 'string',
      },
    },
  },
}

export default config
