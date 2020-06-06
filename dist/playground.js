"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_1 = require("./seulex/core/Regex");
const DFA_1 = require("./seulex/core/DFA");
const NFA_1 = require("./seulex/core/NFA");
const Visualizer_1 = require("./seulex/core/Visualizer");
/*let tik = new Date().getTime()
let yp = new YaccParser('example\\YaccTest2.y')
let lr1 = new LR1Analyzer(yp)
let dfa = lr1.dfa*/
let DFA88 = DFA_1.DFA.fromNFA(NFA_1.NFA.fromRegex(new Regex_1.Regex('([a-c])?(b|d)*e?f+ghi')));
DFA88.minimize();
//console.log(DFA88.states)
Visualizer_1.visualizeFA(DFA88);
/*console.dir(dfa, { maxArrayLength: null, depth: null })
visualizeGOTOGraph(dfa, lr1)
visualizeACTIONGOTOTable(lr1)
let tok = new Date().getTime()
console.log(`Time: ${tok - tik} ms.`)
*/ 
