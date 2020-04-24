/**
 * Ensure `condition`. Else throw `hint`.
 */
export function assert(condition: any, hint: string) {
  if (!condition) {
    throw hint
  }
}
