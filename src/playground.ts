import { Regex } from './seulex/core/Regex'
import { YaccParser } from './seuyacc/core/YaccParser'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { LR1Analyzer } from './seuyacc/core/LR1'
import { visualizeGOTOGraph, visualizeACTIONGOTOTable } from './seuyacc/core/Visualizer'
import { DFA } from './seulex/core/DFA'

// let tik = new Date().getTime()
// let yp = new YaccParser('example\\YaccTest2.y')
// let lr1 = new LR1Analyzer(yp)
// let dfa = lr1.dfa
// console.dir(dfa, { maxArrayLength: null, depth: null })
// visualizeGOTOGraph(dfa, lr1)
// visualizeACTIONGOTOTable(lr1)
// let tok = new Date().getTime()
// console.log(`Time: ${tok - tik} ms.`)
// let dfa = DFA.fromNFA(NFA.fromRegex(new Regex('(a|b)*abb(a|b)*')))
// visualizeFA(dfa)

console.log(new Regex('a(b|c)+d*e?f'))