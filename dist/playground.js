"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LexParser_1 = require("./seulex/core/LexParser");
let parser = new LexParser_1.LexParser('example\\2.l');
console.log(parser.actionPart);
console.log(parser.actions);
console.log(parser.regexActionMap);
// let re = new Regex(`[\\+\\*]`)
//   _postFix: '\\ + \\ * |' }
// let re = new Regex(`\\"[^"]*\\"`)
// console.log(re)
// let nfa = DFA.fromNFA(NFA.fromRegex(re))
// visualizeFA(nfa)
// // console.log(nfa)
// console.log(nfa.test(`" "`))
// console.log(nfa.test(`"abc""bad man"`))
// console.log(nfa.test(`"def"`))
// console.log(nfa.test(`("break")`))
// function format() {
//   let arr = [
//   ]
//   // let from = 2, receive = 't'.charCodeAt(0)
//   // let goto = arr[from * 127 + receive]
//   console.log(arr[0 * 128 + 'a'.charCodeAt(0)])
//   console.log(arr[1 * 128 + ' '.charCodeAt(0)])
// }
// format()
