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
      },
    },
  },
}

export default config
