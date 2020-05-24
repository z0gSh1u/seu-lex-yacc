import fs from 'fs'
import path from 'path'
import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { DFA } from './seulex/core/DFA'
import { LexParser } from './seulex/core/LexParser'
import { generateCode } from './seulex/core/CodeGenerator'
import { beautifyCCode } from '../enhance/beautify'

let parser = new LexParser('example\\2.l')
console.log(parser.actionPart)
console.log(parser.actions)
console.log(parser.regexActionMap)

// let re = new Regex(`[\\+\\*]`)
//   _postFix: '\\ + \\ * |' }
// let re = new Regex(`\\"[^"]*\\"`)
// console.log(re)
// let nfa = DFA.fromNFA(NFA.fromRegex(re))
// visualizeFA(nfa)
// // console.log(nfa)
// console.log(nfa.test(`" "`))
// console.log(nfa.test(`"abc""bad man"`))
// console.log(nfa.test(`"def"`))
// console.log(nfa.test(`("break")`))

// function format() {
//   let arr = [

//   ]
//   // let from = 2, receive = 't'.charCodeAt(0)
//   // let goto = arr[from * 127 + receive]
//   console.log(arr[0 * 128 + 'a'.charCodeAt(0)])
//   console.log(arr[1 * 128 + ' '.charCodeAt(0)])
// }
// format()
