import { Regex } from './seulex/core/Regex'
import { YaccParser } from './seuyacc/core/YaccParser'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { LR1Analyzer } from './seuyacc/core/LR1'
import { visualizeGOTOGraph } from './seuyacc/core/Visualizer'

// let yp = new YaccParser('example\\YaccParserTest.y')
// let lr1 = new LR1Analyzer(yp)
// console.dir(lr1.symbols, { maxArrayLength: null })

let yp = new YaccParser('example\\YaccTest2.y')
let lr1 = new LR1Analyzer(yp)
let dfa = lr1.constructLR1DFA()
console.dir(dfa, { maxArrayLength: null, depth: null })
visualizeGOTOGraph(dfa, lr1)
