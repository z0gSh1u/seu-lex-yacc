/**
 * seulex cli tool
 * Usage:
 *    /bin/seulex.cmd [lex_file] [options]
 *    [options]:
 *      -c: Call gcc to compile after lexing.
 *      -p: Beautify generated C code.
 *      -h: Include seustr.h to compile.
 *      -v: Visualize final DFA.
 * by z0gSh1u @ 2020-05
 */

import { stdoutPrint } from "../utils"

// eslint-disable-next-line @typescript-eslint/no-var-requires
let args = require('minimist')(process.argv.slice(2))
if (args._.length === 0) {
  stdoutPrint(`Missing argument [lex_file].\n`)
}
if (args._.length !== 1) {
  stdoutPrint(`Too many arguments.\n`)
}
const callGCC = args.c ? false : true
const beautify = args.p ? false : true
const includeH = args.h ? false : true
const visualize = args.v ? false : true


