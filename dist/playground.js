"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_1 = require("./seulex/core/Regex");
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
console.log(new Regex_1.Regex('a(b|c)+d*e?f'));
