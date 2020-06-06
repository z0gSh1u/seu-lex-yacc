/**
 * seuyacc CLI 工具
 * 使用：
 *    node <path_to_project>/dist/seuyacc/cli.js [yacc_file] [options]
 *    [options]:
 * github.com/z0gSh1u/seu-lex-yacc
 */

import fs from 'fs'
import path from 'path'
import { stdoutPrint } from '../utils'
import { YaccParser } from './core/YaccParser'
import { LR1Analyzer } from './core/LR1'
import { generateYTABC } from './core/CodeGenerator'
import { beautifyCCode } from '../../enhance/beautify'
import { callGCC } from '../../enhance/gcc'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const args = require('minimist')(process.argv.slice(2))
// args looks like { _: [ 'example/md.l' ], v: true }
const tik = new Date().getTime()
if (args._.length === 0) {
  stdoutPrint(`Missing argument [yacc_file].\n`)
} else if (args._.length !== 1) {
  stdoutPrint(`Too many arguments or .y file not specified.\n`)
} else {
  stdoutPrint(`[ Running... ]\n`)
  // 构建LR1并生成代码
  let finalCode = ''
  try {
    stdoutPrint(`[ Parsing .y file... ]\n`)
    let yaccParser = new YaccParser(path.resolve('./', args._[0]))
    stdoutPrint(`[ Building LR1... ]\n`)
    let lr1 = new LR1Analyzer(yaccParser)
    stdoutPrint(`[ Generating code... ]\n`)
    finalCode = generateYTABC(yaccParser, lr1)
    stdoutPrint(`[ Main work done! Start post-processing... ]\n`)
  } catch (e) {
    console.error(e)
  }
  // 输出c文件
  fs.writeFileSync(path.resolve('./', 'example/yy.seuyacc.c'), finalCode)
}
stdoutPrint(`[ All work done! ]\n`)
const tok = new Date().getTime()
stdoutPrint(`[ Time consumed: ${tok - tik} ms. ]\n`)
