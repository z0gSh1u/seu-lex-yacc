"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YaccParser_1 = require("./seuyacc/core/YaccParser");
const LR1_1 = require("./seuyacc/core/LR1");
const Visualizer_1 = require("./seuyacc/core/Visualizer");
let tik = new Date().getTime();
//let yp = new YaccParser('F:\\seulexyacc\\example\\SimplifiedTest\\Yacc.y')
let yp = new YaccParser_1.YaccParser('F:\\seulexyacc\\example\\Calculator\\Yacc.y');
let lr1 = new LR1_1.LR1Analyzer(yp, true);
let dfa = lr1.dfa;
Visualizer_1.visualizeGOTOGraph(dfa, lr1);
Visualizer_1.visualizeACTIONGOTOTable(lr1);
let tok = new Date().getTime();
console.log(`Time: ${tok - tik} ms.`);
for (let i = 0; i < lr1.symbols.length; i++) {
    console.log(i, lr1.getSymbolString(i));
}
