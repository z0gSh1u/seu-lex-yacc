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

export function inStr(ch: string, str: string) {
  return str.indexOf(ch) !== -1
}

export function splitAndKeep(str: string, delims: string) {
  let res = [],
    part = ''
  for (let i = 0; i < str.length; i++) {
    if (inStr(str[i], delims)) {
      part.length !== 0 && res.push(part)
      part = ''
      res.push(str[i])
    } else {
      part += str[i]
    }
  }
  part.length !== 0 && res.push(part)
  return res
}
