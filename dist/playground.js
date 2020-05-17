"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_1 = require("./seulex/core/Regex");
const NFA_1 = require("./seulex/core/NFA");
const Visualizer_1 = require("./seulex/core/Visualizer");
let re = new Regex_1.Regex(`t" "m`);
let re2 = new Regex_1.Regex(`hoy+s`);
Visualizer_1.visualizeFA(NFA_1.NFA.fromRegex(re));
