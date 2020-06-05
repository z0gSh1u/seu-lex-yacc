import { Regex } from './seulex/core/Regex'
import { YaccParser } from './seuyacc/core/YaccParser'
import { DFA } from './seulex/core/DFA'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { LR1Analyzer } from './seuyacc/core/LR1'
import { visualizeGOTOGraph, visualizeACTIONGOTOTable } from './seuyacc/core/Visualizer'
import { LR1DFAtoLALRDFA } from './seuyacc/core/LALR'

let tik = new Date().getTime()
let yp = new YaccParser('example\\Simplified\\c99_test.y')
let lr1 = new LR1Analyzer(yp)
let dfa = lr1.dfa
//let lalrdfa = LR1DFAtoLALRDFA(lr1)
//lr1.dfa = lalrdfa
// console.dir(dfa, { maxArrayLength: null, depth: null })
//visualizeGOTOGraph(lr1.dfa, lr1)
console.log('DFA STATE COUNT = ', lr1.dfa.states.length)
visualizeACTIONGOTOTable(lr1)
let tok = new Date().getTime()
console.log(`Time: ${tok - tik} ms.`)

// let re = new Regex('(a|b)*a(a|b)')
// let dfa = DFA.fromNFA(NFA.fromRegex(re))
// //dfa.minimize()
// visualizeFA(dfa)
