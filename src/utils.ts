// 工具函数
// by z0gSh1u @ 2020-05

/**
 * Ensure `condition`. Else throw `hint`.
 */
export function assert(condition: unknown, hint: string): void {
  if (!condition) {
    throw hint
  }
}

/**
 * Print directly to stdout.
 */
export function stdoutPrint(content: string): void {
  process.stdout.write(content)
}

/**
 * Return true if ch can be found in str.
 */
export function inStr(ch: string, str: string) {
  return str.indexOf(ch) !== -1
}

/**
 * Split a string using any delim in delims.
 * Return split array with delim remained.
 */
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

/**
 * Return true if ch is an English character.
 */
export function isAlpha(ch: string) {
  return ch.length === 1 && !!ch.match(/[A-Za-z]/)
}
