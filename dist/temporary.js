"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_1 = require("./seulex/core/Regex");
const NFA_1 = require("./seulex/core/NFA");
const Visualizer_1 = require("./seulex/core/Visualizer");
let re = new Regex_1.Regex(`AB?[c-fo]+qp*`);
console.log(re.rangeExpanded);
console.log(re.dotRaw);
Visualizer_1.visualizeFA(NFA_1.NFA.fromRegex(re));
