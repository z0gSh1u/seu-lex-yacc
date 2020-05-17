"use strict";
/**
 * Lex源文件（.l）解析器
 * by z0gSh1u & Withod
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../../utils");
/**
 * .l文件解析器
 */
class LexParser {
    constructor(filePath) {
        this._filePath = filePath;
        this._rawContent = fs_1.default
            .readFileSync(this._filePath)
            .toString()
            .replace(/\r\n/g, '\n'); // 换行一律LF，没有CR
        this._regexAliases = {};
        this._actions = {};
        this._fillText();
        this._fillAttributes();
    }
    get copyPart() {
        return this._copyPart;
    }
    get cCodePart() {
        return this._cCodePart;
    }
    get regexAliases() {
        return this._regexAliases;
    }
    get actions() {
        return this._actions;
    }
    /**
     * 解析出四部分的文本
     */
    _fillText() {
        this._splitContent = this._rawContent.split('\n');
        let copyPartStart = -1, copyPartEnd = -1, twoPercent = [];
        // 寻找分界符位置
        this._splitContent.forEach((v, i) => {
            switch (v.trimRight() // 要求左侧顶格
            ) {
                case '%{':
                    utils_1.assert(copyPartStart === -1, 'Bad .l structure. Duplicate %{.');
                    copyPartStart = i;
                    break;
                case '%}':
                    utils_1.assert(copyPartEnd === -1, 'Bad .l structure. Duplicate %}.');
                    copyPartEnd = i;
                    break;
                case '%%':
                    utils_1.assert(twoPercent.length < 2, 'Bad .l structure. Duplicate %%.');
                    twoPercent.push(i);
                    break;
            }
        });
        utils_1.assert(copyPartStart !== -1, 'Bad .l structure. {% not found.');
        utils_1.assert(copyPartEnd !== -1, 'Bad .l structure. %} not found.');
        utils_1.assert(twoPercent.length === 2, 'Bad .l structure. No enough %%.');
        // 最末尾的C代码部分
        this._cCodePart = this._splitContent.slice(twoPercent[1] + 1).join('\n');
        // 开头的直接复制部分
        this._copyPart = this._splitContent
            .slice(copyPartStart + 1, copyPartEnd)
            .join('\n');
        // 中间的正则-动作部分
        this._actionPart = this._splitContent
            .slice(twoPercent[0] + 1, twoPercent[1])
            .join('\n');
        // 剩余的是正则别名部分
        this._regexAliasPart =
            this._splitContent.slice(0, copyPartStart).join('\n') +
                this._splitContent.slice(copyPartEnd + 1, twoPercent[0]).join('\n');
    }
    /**
     * 填充解析结果
     */
    _fillAttributes() {
        // 分析正则别名部分
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
        // 分析规则与动作部分，并作别名展开
        let regexPart = '', // 读取的正则部分
        actionPart = '', // 读取的动作部分
        regexes = [], // 别名展开后的正则列表
        isReadingRegex = true, // 是否正在读取正则
        isWaitingOr = false, // 是否正在等待正则间的“或”运算符
        isInQuote = false, // 是否在引号内
        isSlash = false, // 是否转义
        braceLevel = 0; // 读取动作时处于第几层花括号内
        this._actionPart.split('').forEach((c) => {
            if (isReadingRegex) {
                // 正在读取正则
                if (isWaitingOr) {
                    // 正在等待正则间的或运算符
                    if (c.trim()) {
                        // 非空白字符
                        isWaitingOr = false;
                        if (c != '|')
                            isReadingRegex = false;
                    }
                }
                else {
                    if (!isInQuote && !c.trim() && regexPart != '') {
                        // 正则读取完毕
                        let ptr1 = 0;
                        isSlash = false;
                        for (; ptr1 < regexPart.length; ptr1++) {
                            // 寻找正则别名的开头{
                            let char = regexPart.charAt(ptr1);
                            if (!isInQuote && !isSlash && char == '{') {
                                // 开始读取别名
                                let ptr2 = ptr1 + 1, alias = '';
                                for (; ptr2 < regexPart.length; ptr2++) {
                                    // 寻找别名的结尾}
                                    char = regexPart.charAt(ptr2);
                                    if (char == '}')
                                        break; // 完成读取别名
                                    alias += char;
                                }
                                utils_1.assert(ptr2 < regexPart.length, `Missing right brace at the end of alias: ${alias}`);
                                if (alias in this._regexAliases) {
                                    regexPart =
                                        regexPart.substring(0, ptr1) +
                                            '(' +
                                            this._regexAliases[alias] +
                                            ')' +
                                            regexPart.substring(ptr2 + 1);
                                    ptr1 -= 1;
                                }
                                else
                                    ptr1 = ptr2;
                            }
                            else if (char == '\\')
                                isSlash = !isSlash;
                            else if (!isSlash && char == '"')
                                isInQuote = !isInQuote;
                            else
                                isSlash = false;
                        }
                        utils_1.assert(!this._actions.hasOwnProperty(regexPart), `Regex re-definition found: ${regexPart}`);
                        regexes.push(regexPart);
                        regexPart = '';
                        isSlash = false;
                        isInQuote = false;
                        isWaitingOr = true; // 开始等待正则间的或运算符
                    }
                    else {
                        regexPart += c.trim() ? c : regexPart == '' ? '' : ' ';
                        if (c == '\\')
                            isSlash = !isSlash;
                        else if (c == '"' && !isSlash)
                            isInQuote = !isInQuote;
                        else
                            isSlash = false;
                    }
                }
            }
            // 正在读取动作
            if (!isReadingRegex) {
                actionPart += c.trim() ? c : ' ';
                if ((!isInQuote && braceLevel == 0 && c == ';') ||
                    (!isInQuote && c == '}' && braceLevel == 1)) {
                    // 动作读取完毕
                    regexes.forEach((regex) => {
                        this._actions[regex] = actionPart;
                    });
                    regexes = [];
                    isSlash = false;
                    isInQuote = false;
                    braceLevel = 0;
                    actionPart = '';
                    isReadingRegex = true; // 开始读取正则
                }
                else {
                    if (c == '\\')
                        isSlash = !isSlash;
                    else if (!isSlash && (c == "'" || c == '"'))
                        isInQuote = !isInQuote;
                    else if (!isInQuote && c == '{')
                        braceLevel += 1;
                    else if (!isInQuote && c == '}')
                        braceLevel = Math.max(0, braceLevel - 1);
                    else
                        isSlash = false;
                }
            }
        });
    }
}
exports.LexParser = LexParser;
