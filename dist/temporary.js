"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_1 = require("./seulex/core/Regex");
console.log(new Regex_1.Regex('AB[C-F][A-Ca-c_]').rangeExpanded);
console.log(new Regex_1.Regex('[A-Ca-cdef]').rangeExpanded);
console.log(new Regex_1.Regex(`Hello"[x-z]"`).rangeExpanded);
console.log(new Regex_1.Regex('Hello\\"[x-z]\\"').rangeExpanded);
