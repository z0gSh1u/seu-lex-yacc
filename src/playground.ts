import { Regex } from './seulex/core/Regex'
import { YaccParser } from './seuyacc/core/YaccParser'
import { NFA } from './seulex/core/NFA'
import { DFA } from './seulex/core/DFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { LR1Analyzer } from './seuyacc/core/LR1'
import { visualizeGOTOGraph, visualizeACTIONGOTOTable } from './seuyacc/core/Visualizer'

// let tik = new Date().getTime()
// //let yp = new YaccParser('F:\\seulexyacc\\example\\SimplifiedTest\\Yacc.y')
// let yp = new YaccParser('F:\\seulexyacc\\example\\Calculator\\Yacc.y')

// let lr1 = new LR1Analyzer(yp, true)
// let dfa = lr1.dfa
// visualizeGOTOGraph(dfa, lr1)
// visualizeACTIONGOTOTable(lr1)
// let tok = new Date().getTime()
// console.log(`Time: ${tok - tik} ms.`)

// for (let i = 0; i < lr1.symbols.length; i++) {
//   console.log(i, lr1.getSymbolString(i))
// }

let re = new Regex('(a|b)*aaaab(a|b)*')
let nfa = NFA.fromRegex(re)
let dfa = DFA.fromNFA(nfa)
dfa.minimize()
console.log(re)
visualizeFA(dfa)