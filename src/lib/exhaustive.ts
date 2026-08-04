/**
 * Builds a list that the compiler proves covers every member of a union.
 *
 * The board needs to iterate statuses, and the filter UI needs to iterate tags
 * and point estimates — but the unions those come from are generated from
 * `schema.graphql`. A plain array would silently fall behind the day the API
 * gains a member: the new value would arrive at runtime with no column to sit in
 * and no filter option to select, and nothing would fail.
 *
 * Written as two calls so the union is named explicitly while the array's
 * literal types are still inferred:
 *
 * ```ts
 * export const ALL_STATUSES = exhaustiveList<Status>()(['BACKLOG', 'TODO'])
 * //                                                    ^ error names TODO's
 * //                                                      missing siblings
 * ```
 */
export function exhaustiveList<Union extends string>() {
  return <const List extends readonly Union[]>(
    values: Exclude<Union, List[number]> extends never
      ? List
      : List & Record<'MISSING_MEMBERS', Exclude<Union, List[number]>>,
  ): List => values
}
