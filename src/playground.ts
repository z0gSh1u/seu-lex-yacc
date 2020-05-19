
import fs from 'fs'
import path from 'path'
import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { DFA } from './seulex/core/DFA'
import { LexParser } from './seulex/core/LexParser'
import { generateCode } from './seulex/core/CodeGenerator'
import { beautifyCCode } from '../enhance/beautify'

let lexParser = new LexParser('example\\md_simp.l')
let bigNFA = NFA.fromLexParser(lexParser)
let bigDFA = DFA.fromNFA(bigNFA)
visualizeFA(bigDFA)
console.log(bigDFA)
let bigCode = generateCode(lexParser, bigDFA)
// bigCode = beautifyCCode(bigCode)
console.log(bigCode)
fs.writeFileSync('example\\code.c', bigCode)