"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_1 = require("./seulex/core/Regex");
const NFA_1 = require("./seulex/core/NFA");
let re = new Regex_1.Regex('B+');
//console.log(re.dotRaw)
//console.log(re.postFix)
let nfa = NFA_1.NFA.fromRegex(new Regex_1.Regex('B'));
let nfa2 = NFA_1.NFA.fromRegex(new Regex_1.Regex('B'));
nfa2.kleene();
//console.log(nfa.transformAdjList)
//visualizeFA(NFA.fromRegex(re))
NFA_1.NFA.fromRegex(re);
