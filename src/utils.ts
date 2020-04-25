/**
 * Ensure `condition`. Else throw `hint`.
 */
export function assert(condition: unknown, hint: string): void {
  if (!condition) {
    throw hint
  }
}

export function stdoutPrint(content: string): void {
  process.stdout.write(content)
}
