"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LexParser_1 = require("./seulex/core/LexParser");
let lp = new LexParser_1.LexParser('F:\\seulexyacc\\example\\md.l');
console.log(lp.regexAliases);
