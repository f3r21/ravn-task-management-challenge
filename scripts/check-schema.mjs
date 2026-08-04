/**
 * Fails if `schema.graphql` has drifted from the live API.
 *
 * The committed schema is what codegen reads and what the MSW handlers
 * implement, so if the API changes underneath it every generated type quietly
 * becomes a lie. This is deliberately *not* part of `npm run gate`: it needs
 * network access, and a CI run should not go red because someone else's server
 * is having a bad afternoon. Run it when something looks wrong, or on a
 * schedule.
 *
 * Introspection needs no token — only queries do — so this works for anyone.
 */
import { readFileSync } from 'node:fs'
import { buildClientSchema, buildSchema, getIntrospectionQuery, printSchema } from 'graphql'

const ENDPOINT =
  process.env.VITE_API_URL ?? 'https://syn-api-production-e95c.up.railway.app/graphql'

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: getIntrospectionQuery() }),
})

if (!response.ok) {
  console.error(`Introspection failed: ${response.status} ${response.statusText}`)
  process.exit(1)
}

const { data, errors } = await response.json()
if (errors) {
  console.error('Introspection returned errors:', JSON.stringify(errors, null, 2))
  process.exit(1)
}

// Both sides are printed from a parsed schema, so formatting, field order and
// comments cannot cause a false difference — only the contract itself can.
const live = printSchema(buildClientSchema(data))
const committed = printSchema(buildSchema(readFileSync('schema.graphql', 'utf8')))

if (live === committed) {
  console.log(`schema.graphql matches ${ENDPOINT}`)
  process.exit(0)
}

console.error(`schema.graphql has drifted from ${ENDPOINT}.`)
console.error('Update it from the live schema below, then re-run `npm run codegen`.\n')
console.error(live)
process.exit(1)
