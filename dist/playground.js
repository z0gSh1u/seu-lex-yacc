"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_1 = require("./seulex/core/Regex");
const DFA_1 = require("./seulex/core/DFA");
const NFA_1 = require("./seulex/core/NFA");
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
let dfa = DFA_1.DFA.fromNFA(NFA_1.NFA.fromRegex(new Regex_1.Regex('(x|y)b*c+d?')));
