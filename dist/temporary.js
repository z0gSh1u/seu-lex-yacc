"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_1 = require("./seulex/core/Regex");
let re = new Regex_1.Regex('AB(C|D)*EFG');
console.log(re.dotRaw);
console.log(re.postFix);
let nfa = re.constructNFA();
console.log(nfa.test('ABCDCDCCCEFG'.split('')));
