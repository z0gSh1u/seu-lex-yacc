"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YaccParser_1 = require("./seuyacc/core/YaccParser");
const LR1_1 = require("./seuyacc/core/LR1");
const Visualizer_1 = require("./seuyacc/core/Visualizer");
let tik = new Date().getTime();
let yp = new YaccParser_1.YaccParser('example\\Simplified\\c99_test.y');
let lr1 = new LR1_1.LR1Analyzer(yp);
let dfa = lr1.dfa;
//let lalrdfa = LR1DFAtoLALRDFA(lr1)
//lr1.dfa = lalrdfa
// console.dir(dfa, { maxArrayLength: null, depth: null })
//visualizeGOTOGraph(lr1.dfa, lr1)
console.log('DFA STATE COUNT = ', lr1.dfa.states.length);
Visualizer_1.visualizeACTIONGOTOTable(lr1);
let tok = new Date().getTime();
console.log(`Time: ${tok - tik} ms.`);
// let re = new Regex('(a|b)*a(a|b)')
// let dfa = DFA.fromNFA(NFA.fromRegex(re))
// //dfa.minimize()
// visualizeFA(dfa)
