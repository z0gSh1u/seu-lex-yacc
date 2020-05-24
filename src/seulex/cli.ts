/**
 * seulex CLI 工具
 * 使用：
 *    bin/seulex.cmd [lex_file] [options]
 *    [options]:
 *      -p: 美化生成的C代码。
 *      -c: 在生成代码后自动调用gcc编译。如果需要补充gcc参数，请使用"-c <supplement>"（保留引号）。
 *      -v: 可视化最终DFA。
 * github.com/z0gSh1u/seu-lex-yacc
 */

import fs from 'fs'
import path from 'path'
import { stdoutPrint } from '../utils'
import { generateCode } from './core/CodeGenerator'
import { LexParser } from './core/LexParser'
import { beautifyCCode } from '../../enhance/beautify'
import { callGCC } from '../../enhance/gcc'
import { visualizeFA } from './core/Visualizer'
import { DFA } from './core/DFA'
import { NFA } from './core/NFA'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const args = require('minimist')(process.argv.slice(2))
// args looks like { _: [ 'example/md.l' ], v: true }
const tik = new Date().getTime()
if (args._.length === 0) {
  stdoutPrint(`Missing argument [lex_file].\n`)
} else if (args._.length !== 1) {
  stdoutPrint(`Too many arguments or .l file not specified.\n`)
} else {
  stdoutPrint(`[ Running... ]\n`)
  // 构建最终DFA并生成代码
  let finalCode = '',
    bigDFA!: DFA
  try {
    stdoutPrint(`[ Parsing .l file... ]\n`)
    let lexParser = new LexParser(path.resolve('./', args._[0]))
    stdoutPrint(`[ Building NFA... ]\n`)
    let bigNFA = NFA.fromLexParser(lexParser)
    stdoutPrint(`[ Building DFA... ]\n`)
    bigDFA = DFA.fromNFA(bigNFA)
    stdoutPrint(`[ Generating code... ]\n`)
    finalCode = generateCode(lexParser, bigDFA)
    stdoutPrint(`[ Main work done! Start post-processing... ]\n`)
  } catch (e) {
    console.error(e)
  }
  // 后处理
  args.p && (finalCode = beautifyCCode(finalCode))
  // 输出c文件
  fs.writeFileSync(path.resolve('./', 'yy.seulex.c'), finalCode)
  // 调用GGC
  args.c && callGCC(path.resolve('./', 'yy.seulex.c'), args.c.length ? args.c.toString() : '')
  // 可视化DFA
  args.v && visualizeFA(bigDFA)
}
stdoutPrint(`[ All work done! ]\n`)
const tok = new Date().getTime()
stdoutPrint(`[ Time consumed: ${tok - tik} ms. ]\n`)
