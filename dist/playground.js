"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NFA_1 = require("./seulex/core/NFA");
const Visualizer_1 = require("./seulex/core/Visualizer");
const LexParser_1 = require("./seulex/core/LexParser");
let lexParser = new LexParser_1.LexParser('example\\md_simp.l');
let bigNFA = NFA_1.NFA.fromLexParser(lexParser);
Visualizer_1.visualizeFA(bigNFA);
console.log(bigNFA);
