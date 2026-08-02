/**
 * Fails to compile if `value` is not `never`.
 *
 * Put this in the `default` arm of a `switch` over a union and the compiler
 * starts enforcing exhaustiveness: adding a member to the union turns every
 * unhandled `switch` into a build error instead of a silent fallthrough at
 * runtime. It throws as well so the mistake is loud if a value the types said
 * was impossible arrives anyway — which is exactly what happens when data
 * crosses a boundary the type system does not police, like a server response.
 */
export function assertNever(value: never, context = 'value'): never {
  throw new Error(`Unhandled ${context}: ${JSON.stringify(value)}`)
}
