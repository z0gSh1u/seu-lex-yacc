import { Regex } from './seulex/core/Regex'
import { YaccParser } from './seuyacc/core/YaccParser'
import { DFA } from './seulex/core/DFA'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { LR1Analyzer } from './seuyacc/core/LR1'
import { visualizeGOTOGraph, visualizeACTIONGOTOTable } from './seuyacc/core/Visualizer'

/*let tik = new Date().getTime()
let yp = new YaccParser('example\\YaccTest2.y')
let lr1 = new LR1Analyzer(yp)
let dfa = lr1.dfa*/
//let DFA88 = DFA.fromNFA(NFA.fromRegex(new Regex('([a-c])?(b|d)*e?f+ghi')))
let DFA88 = DFA.fromNFA(NFA.fromRegex(new Regex('(a*|b*)*')))
DFA88.minimize()
console.log(DFA88.test('ab'))
visualizeFA(DFA88)
/*console.dir(dfa, { maxArrayLength: null, depth: null })
visualizeGOTOGraph(dfa, lr1)
visualizeACTIONGOTOTable(lr1)
let tok = new Date().getTime()
console.log(`Time: ${tok - tik} ms.`)
*/