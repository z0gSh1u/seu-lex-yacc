"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../../utils");
class LexParser {
    constructor(filePath) {
        this._filePath = filePath;
        this._rawContent = fs_1.default
            .readFileSync(filePath)
            .toString()
            .replace('\r\n', '\n');
        this._splitParts();
    }
    _splitParts() {
        let pattern;
        // split copyPart
        pattern = new RegExp(/^%{\s*$/g);
        let copyPartStartMatch = pattern.exec(this._rawContent);
        utils_1.assert(copyPartStartMatch, 'Bad .lex structure. {% not found.');
        utils_1.assert(!pattern.exec(this._rawContent), 'Bad .lex structure. Duplicate {%.');
        let copyPartStartPos = copyPartStartMatch === null || copyPartStartMatch === void 0 ? void 0 : copyPartStartMatch.index;
        pattern = new RegExp(/^%{\s*$/g);
        let copyPartEndMatch = pattern.exec(this._rawContent);
        utils_1.assert(copyPartEndMatch, 'Bad .lex structure. %} not found.');
        utils_1.assert(!pattern.exec(this._rawContent), 'Bad .lex structure. Duplicate %}.');
        let copyPartEndPos = copyPartStartMatch === null || copyPartStartMatch === void 0 ? void 0 : copyPartStartMatch.index;
        this._copyPart = this._rawContent
            .substring(copyPartStartPos + 2, copyPartEndPos)
            .trim();
        // split cCodePart
        pattern = new RegExp(/^%%\s+$/g);
        let twoPercentMatch1 = pattern.exec(this._rawContent);
        let twoPercentMatch2 = pattern.exec(this._rawContent);
        utils_1.assert(twoPercentMatch1 && twoPercentMatch2, 'Bad .lex structure. No enough %%.');
        let twoPercentPos1 = twoPercentMatch1 === null || twoPercentMatch1 === void 0 ? void 0 : twoPercentMatch1.index;
        let twoPercentPos2 = twoPercentMatch2 === null || twoPercentMatch2 === void 0 ? void 0 : twoPercentMatch2.index;
        utils_1.assert(!pattern.exec(this._rawContent), 'Bad .lex structure. Duplicate %%.');
        this._cCodePart = this._rawContent.substring(twoPercentPos2 + 2).trim();
        // split actionPart
        this._actionPart = this._rawContent
            .substring(twoPercentPos1 + 2, twoPercentPos2)
            .trim();
        // split regexAliasPart
        this._regexAliasPart = this._rawContent
            .substring(0, twoPercentPos1)
            .trim()
            .replace(/^%{$.*^%}$/, '');
    }
}
exports.LexParser = LexParser;
