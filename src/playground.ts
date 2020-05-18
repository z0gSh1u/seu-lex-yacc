import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { DFA } from './seulex/core/DFA'
import { LexParser } from './seulex/core/LexParser'

let lexParser = new LexParser('example\\md_simp.l')
let bigNFA = NFA.fromLexParser(lexParser)
visualizeFA(bigNFA)
console.log(bigNFA)