"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_1 = require("./seulex/core/Regex");
const NFA_1 = require("./seulex/core/NFA");
const Visualizer_1 = require("./seulex/core/Visualizer");
// let re = new Regex(`ABC?"h.e?+a*"...\\"`)
let re = new Regex_1.Regex(`AB+(CD)?(D|E)*..F`);
console.log(re.dotAdded);
console.log(re.rangeExpanded);
console.log(re.postFix);
let nfa = NFA_1.NFA.fromRegex(re);
Visualizer_1.visualizeFA(nfa);
// console.log(nfa.transformAdjList)
