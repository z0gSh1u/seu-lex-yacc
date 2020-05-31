"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YaccParser_1 = require("./seuyacc/core/YaccParser");
const LR1_1 = require("./seuyacc/core/LR1");
const Visualizer_1 = require("./seuyacc/core/Visualizer");
// let yp = new YaccParser('example\\YaccParserTest.y')
// let lr1 = new LR1Analyzer(yp)
// console.dir(lr1.symbols, { maxArrayLength: null })
let yp = new YaccParser_1.YaccParser('example\\YaccTest2.y');
let lr1 = new LR1_1.LR1Analyzer(yp);
let dfa = lr1.constructLR1DFA();
console.dir(dfa, { maxArrayLength: null, depth: null });
Visualizer_1.visualizeGOTOGraph(dfa, lr1);
