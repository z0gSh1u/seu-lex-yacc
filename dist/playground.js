"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YaccParser_1 = require("./seuyacc/core/YaccParser");
const LR1_1 = require("./seuyacc/core/LR1");
let yp = new YaccParser_1.YaccParser('example\\YaccParserTest.y');
let lr1 = new LR1_1.LR1Analyzer(yp);
console.dir(lr1.symbols, { maxArrayLength: null });
