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
            .readFileSync(this._filePath)
            .toString()
            .replace(/\r\n/g, '\n'); // 换行一律LF，没有CR
        this._regexAliases = {};
        this._actions = {};
        this._fillingParts();
        this._analyse();
    }
    get regexAliases() {
        return this._regexAliases;
    }
    get actions() {
        return this._actions;
    }
    _analyse() {
        // 分析正则别名
        this._regexAliasPart.split('\n').forEach((v) => {
            if (v.trim() !== '') {
                v = v.trim();
                let spaceTest = /\s+/.exec(v);
                utils_1.assert(spaceTest, `Invalid regex alias line: ${v}`);
                let alias = v.substring(0, spaceTest === null || spaceTest === void 0 ? void 0 : spaceTest.index);
                utils_1.assert((spaceTest === null || spaceTest === void 0 ? void 0 : spaceTest.index) < v.length - 1, `Invalid regex alias line: ${v}`);
                let regex = v.substring(spaceTest === null || spaceTest === void 0 ? void 0 : spaceTest.index).trimLeft();
                utils_1.assert(!(alias in this._regexAliases), `Regex alias re-definition found: ${v}`);
                this._regexAliases[alias] = regex;
            }
        });
        // 分析规则与动作
    }
    _fillingParts() {
        this._splitContent = this._rawContent.split('\n');
        let copyPartStart = -1, copyPartEnd = -1, twoPercent = [];
        this._splitContent.forEach((v, i) => {
            switch (v.trimRight() // 要求左侧顶格
            ) {
                case '%{':
                    utils_1.assert(copyPartStart === -1, 'Bad .lex structure. Duplicate %{.');
                    copyPartStart = i;
                    break;
                case '%}':
                    utils_1.assert(copyPartEnd === -1, 'Bad .lex structure. Duplicate %}.');
                    copyPartEnd = i;
                    break;
                case '%%':
                    utils_1.assert(twoPercent.length < 2, 'Bad .lex structure. Duplicate %%.');
                    twoPercent.push(i);
                    break;
            }
        });
        utils_1.assert(twoPercent.length === 2, 'Bad .lex structure. No enough %%.');
        this._cCodePart = this._splitContent.slice(twoPercent[1] + 1).join('\n');
        this._copyPart = this._splitContent
            .slice(copyPartStart + 1, copyPartEnd)
            .join('\n');
        this._actionPart = this._splitContent
            .slice(twoPercent[0] + 1, twoPercent[1])
            .join('\n');
        this._regexAliasPart =
            this._splitContent.slice(0, copyPartStart).join('\n') +
                this._splitContent.slice(copyPartEnd + 1, twoPercent[0]).join('\n');
    }
}
exports.LexParser = LexParser;
