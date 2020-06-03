"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YaccParser_1 = require("./seuyacc/core/YaccParser");
const LR1_1 = require("./seuyacc/core/LR1");
const Visualizer_1 = require("./seuyacc/core/Visualizer");
// let yp = new YaccParser('example\\YaccParserTest.y')
// let lr1 = new LR1Analyzer(yp)
// console.dir(lr1.symbols, { maxArrayLength: null })
let tik = new Date().getTime();
let yp = new YaccParser_1.YaccParser('example\\YaccTest2.y');
let lr1 = new LR1_1.LR1Analyzer(yp);
let dfa = lr1.dfa;
console.dir(dfa, { maxArrayLength: null, depth: null });
Visualizer_1.visualizeGOTOGraph(dfa, lr1);
let tok = new Date().getTime();
console.log(`Time: ${tok - tik} ms.`);
// for (let p of lr1.producers) {
//   console.log(lr1.formatPrintProducer(p))
// }
// console.log('========================')
// console.log(lr1.FIRST([lr1._getSymbolId({ type: 'nonterminal', content: 'S' })]).map(x=>lr1.getSymbolString(x)).join('/'))
// console.log(lr1.FIRST([lr1._getSymbolId({ type: 'nonterminal', content: 'C' })]).map(x=>lr1.getSymbolString(x)).join('/'))
