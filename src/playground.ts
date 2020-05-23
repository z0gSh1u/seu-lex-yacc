import fs from 'fs'
import path from 'path'
import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { DFA } from './seulex/core/DFA'
import { LexParser } from './seulex/core/LexParser'
import { generateCode } from './seulex/core/CodeGenerator'
import { beautifyCCode } from '../enhance/beautify'

let lp = new LexParser('example\\c99_test_2.l')
let re = new Regex('"("')
console.log(re)
let nfa = NFA.fromRegex(re)
console.log(nfa.alphabet)
visualizeFA(nfa)