/**
 * Ensure `condition`. Else throw `hint`.
 */
export function assert(condition: unknown, hint: string): void {
  if (!condition) {
    throw hint
  }
}
