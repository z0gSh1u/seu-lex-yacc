"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_1 = require("./seulex/core/Regex");
const NFA_1 = require("./seulex/core/NFA");
const DFA_1 = require("./seulex/core/DFA");
const Visualizer_1 = require("./seulex/core/Visualizer");
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
let re = new Regex_1.Regex('(a|b)*aaaab(a|b)*');
let nfa = NFA_1.NFA.fromRegex(re);
let dfa = DFA_1.DFA.fromNFA(nfa);
dfa.minimize();
console.log(re);
Visualizer_1.visualizeFA(dfa);
