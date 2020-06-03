import { Regex } from './seulex/core/Regex'
import { YaccParser } from './seuyacc/core/YaccParser'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { LR1Analyzer } from './seuyacc/core/LR1'
import { visualizeGOTOGraph } from './seuyacc/core/Visualizer'

// let yp = new YaccParser('example\\YaccParserTest.y')
// let lr1 = new LR1Analyzer(yp)
// console.dir(lr1.symbols, { maxArrayLength: null })

let tik = new Date().getTime()
let yp = new YaccParser('example\\YaccTest2.y')
let lr1 = new LR1Analyzer(yp)
let dfa = lr1.dfa
console.dir(dfa, { maxArrayLength: null, depth: null })
visualizeGOTOGraph(dfa, lr1)
let tok = new Date().getTime()
console.log(`Time: ${tok - tik} ms.`)
// for (let p of lr1.producers) {
//   console.log(lr1.formatPrintProducer(p))
// }

// console.log('========================')

// console.log(lr1.FIRST([lr1._getSymbolId({ type: 'nonterminal', content: 'S' })]).map(x=>lr1.getSymbolString(x)).join('/'))
// console.log(lr1.FIRST([lr1._getSymbolId({ type: 'nonterminal', content: 'C' })]).map(x=>lr1.getSymbolString(x)).join('/'))
