"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const NFA_1 = require("./seulex/core/NFA");
const Visualizer_1 = require("./seulex/core/Visualizer");
const DFA_1 = require("./seulex/core/DFA");
const LexParser_1 = require("./seulex/core/LexParser");
const CodeGenerator_1 = require("./seulex/core/CodeGenerator");
let lexParser = new LexParser_1.LexParser('example\\md_simp.l');
let bigNFA = NFA_1.NFA.fromLexParser(lexParser);
let bigDFA = DFA_1.DFA.fromNFA(bigNFA);
Visualizer_1.visualizeFA(bigDFA);
console.log(bigDFA);
let bigCode = CodeGenerator_1.generateCode(lexParser, bigDFA);
// bigCode = beautifyCCode(bigCode)
console.log(bigCode);
fs_1.default.writeFileSync('example\\code.c', bigCode);
