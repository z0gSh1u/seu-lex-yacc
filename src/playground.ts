import fs from 'fs'
import path from 'path'
import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { DFA } from './seulex/core/DFA'
import { LexParser } from './seulex/core/LexParser'
import { generateCode } from './seulex/core/CodeGenerator'
import { beautifyCCode } from '../enhance/beautify'

//let lexParser = new LexParser('example\\lexPlayground.l')

// let bigNFA = NFA.fromLexParser(lexParser)

// let bigDFA = DFA.fromNFA(bigNFA)

let re = new Regex(`([a-zA-Z_])(([a-zA-Z_])|([0-9]))*`)
let nfa = NFA.fromRegex(re)
console.log(nfa.test("main"))
let dfa = DFA.fromNFA(nfa)
console.log(dfa.test("main"))

// visualizeFA(bigDFA)
// console.log(bigDFA)
// let bigCode = generateCode(lexParser, bigDFA)
// // bigCode = beautifyCCode(bigCode)
// console.log(bigCode)
// fs.writeFileSync('example\\code.c', bigCode)

// let filecontent = fs
//   .readFileSync(path.resolve('./', 'example/c99_test.l'))
//   .toString()
//   .replace('\r\n', '\n')
// let pattern = / return\((.*)\);/g
// let one,
//   num = 1
// let res = ''
// while ((one = pattern.exec(filecontent))) {
//   //console.log(`#define ${one[1]} ${num.toString(16).padStart(4, '0x')}`)
//   //num++
//   res += `"${one[1]}", `
// }
// res = res.substring(0, res.length - 1)
// console.log(res)
