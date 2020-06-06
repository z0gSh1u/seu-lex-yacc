import { Regex } from './seulex/core/Regex'
import { YaccParser } from './seuyacc/core/YaccParser'
import { DFA } from './seulex/core/DFA'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { LR1Analyzer } from './seuyacc/core/LR1'
import { visualizeGOTOGraph, visualizeACTIONGOTOTable } from './seuyacc/core/Visualizer'
import { LR1DFAtoLALRDFA } from './seuyacc/core/LALR'

// let tik = new Date().getTime()
// let yp = new YaccParser('example\\Calculator\\Yacc.y')
// let lr1 = new LR1Analyzer(yp, true)
// visualizeGOTOGraph(lr1.dfa, lr1)
// visualizeACTIONGOTOTable(lr1)
// console.log('DFA STATE COUNT = ', lr1.dfa.states.length)
// //visualizeGOTOGraph(lr1.dfa, lr1)
// //console.dir(lr1.ACTIONTable[0], { maxArrayLength: null, depth: null })
// visualizeACTIONGOTOTable(lr1)
// let tok = new Date().getTime()
// console.log(`Time: ${tok - tik} ms.`)
let dfa = DFA.fromNFA(NFA.fromRegex(new Regex('(x|y)b*c+d?')))

