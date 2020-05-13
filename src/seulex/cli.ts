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
import { Regex } from './core/Regex'

// eslint-disable-next-line @typescript-eslint/no-var-requires
let args = require('minimist')(process.argv.slice(2))
// args looks like { _: [ 'example/md.l' ], v: true }

if (args._.length === 0) {
  stdoutPrint(`Missing argument [lex_file].\n`)
} else if (args._.length !== 1) {
  stdoutPrint(`Too many arguments or .l file not specified.\n`)
} else {
  stdoutPrint(`[ Running... ]\n`)
  // 构建最终DFA
  const lexParser = new LexParser(path.join(__dirname, args._[0]))
  let atomNFAs = []
  for (let key in lexParser.actions)
    atomNFAs.push(NFA.fromRegex(new Regex(key)))
  let dfa = new DFA(NFA.parallelAll(...atomNFAs))
  // 代码生成
  let finalCode = generateCode(lexParser, dfa)
  // 后处理
  args.p && (finalCode = beautifyCCode(finalCode))
  // 输出c文件
  fs.writeFileSync(path.join('./', 'yy.seulex.c'), finalCode)
  // 调用GGC
  args.c &&
    callGCC(
      path.join('./', 'yy.seulex.c'),
      args.c.length ? args.c.toString() : ''
    )
  // 可视化DFA
  args.v && visualizeFA(dfa)
}
