"use strict";
/**
 * Yacc源文件 (.y）解析器
 * by Withod
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
const Grammar_1 = require("./Grammar");
/**
 * .y文件解析器
 */
class YaccParser {
    constructor(filePath) {
        this._filePath = filePath;
        this._rawContent = fs_1.default
            .readFileSync(this._filePath)
            .toString()
            .replace(/\r\n/g, '\n'); // 统一使用LF，没有CR
        this._splitContent = this._rawContent.split('\n');
        this._fillText();
        this._parseInfo();
        this._parseProducers();
    }
    get producers() {
        return this._producers;
    }
    get tokens() {
        return this._tokens;
    }
    get operators() {
        return this._operators;
    }
    get startSymbol() {
        return this._startSymbol;
    }
    /**
     * 分析信息部分
     */
    _parseInfo() {
        this._operators = [];
        this._tokens = [];
        this._startSymbol = '';
        this._infoPart.split('\n').forEach((line) => {
            if (!line.trim())
                return;
            let words = line.split(/\s/);
            switch (words[0]) {
                case '%token':
                    for (let i = 1; i < words.length; i++)
                        !this._tokens.includes(words[i]) && this._tokens.push(words[i]);
                    break;
                case '%left':
                case '%right':
                    let isRight = words[0] == '%right';
                    for (let i = 1; i < words.length; i++) {
                        let isRepetitive = this._operators.some((x) => x.name == words[i]);
                        utils_1.assert(!isRepetitive, `Operator redefined: ${words[i]}`);
                        this._operators.push(new Grammar_1.Operator(words[i], isRight));
                    }
                    break;
                case '%start':
                    for (let i = 1; i < words.length; i++) {
                        utils_1.assert(!this._startSymbol, `Start symbol redefined: ${words[i]}`);
                        this._startSymbol = words[i];
                    }
                    break;
                default:
                    utils_1.assert(false, `Unknown declaration: ${words[0]}`);
            }
        });
        this._operators.reverse();
    }
    _parseProducers() {
        let parseState = 0; // 解析过程所处的状态
        // 0：等待产生式左侧，1：正在读取产生式左侧，1.5：等冒号，2：正在读取产生式右侧非动作部分，3：正在读取动作部分，4：动作部分读取完成
        let buffer = ""; // 字符缓存区
        let bslash = false; // 是否转义
        let quot = false; // 是否在引号中
        let producerLhs = ""; // 产生式左侧缓存区
        let producerRhs = []; // 产生式右侧缓存区
        let action = ""; // 动作缓存区
        let braceLevel = 0; // 读取动作时处于第几层花括号内
        this._producers = [];
        for (let char of this._producerPart) {
            if (parseState == 0) {
                // 正在等待产生式左侧
                if (char.trim()) {
                    utils_1.assert(char != ':', `Non-terminal can't be empty`);
                    buffer += char;
                    parseState = 1;
                }
            }
            else if (parseState == 1) {
                // 正在读取产生式左侧
                if (!char.trim() || char === ':') {
                    // 产生式左侧读取完成
                    producerLhs = buffer;
                    buffer = '';
                    parseState = char === ':' ? 2 : 1.5;
                }
                else {
                    // 还在读
                    buffer += char;
                    utils_1.assert(/^\w+$/.test(char), `Invalid non-terminal: ${buffer}`);
                }
            }
            else if (parseState == 1.5) {
                // 等标志着开始产生式右边的冒号
                if (char == ':')
                    parseState = 2;
                else
                    utils_1.assert(!char.trim(), `Expect colon after ${producerLhs}`);
            }
            else if (parseState == 2) {
                // 在读产生式右侧非动作部分
                if (quot) {
                    // 在引号内
                    buffer += char;
                    if (char === '\\') {
                        bslash = !bslash;
                    }
                    else if (!bslash && char === "'") {
                        utils_1.assert(buffer.length <= 3 || (buffer.length == 4 && buffer[1] === '\\'), `Multiple characters between quotes: ${buffer}`);
                        utils_1.assert(buffer.length > 2, `No character beteween quotes: ${buffer}`);
                        quot = false;
                        producerRhs.push(buffer);
                        buffer = '';
                    }
                    else {
                        bslash = false;
                    }
                }
                else if (!char.trim() || utils_1.inStr(char, `;|{'`)) {
                    // 完成一个符号的读取
                    if (buffer.length) {
                        producerRhs.push(buffer);
                        buffer = '';
                    }
                    if (char === '{') {
                        parseState = 3;
                        bslash = false;
                        quot = false;
                        braceLevel = 1;
                    }
                    else if (char === "'") {
                        buffer += char;
                        quot = true;
                    }
                }
                else
                    buffer += char; // 尚在读取
            }
            else if (parseState == 3) {
                // 正在读取动作部分
                if (quot) {
                    // 在引号内
                    action += char;
                    if (!bslash && utils_1.inStr(char, `"'`))
                        quot = false;
                    else if (char === '\\')
                        bslash = !bslash;
                    else
                        bslash = false;
                }
                else if (char === '}') {
                    if (--braceLevel == 0) {
                        // 动作部分读取完成
                        quot = false;
                        bslash = false;
                        parseState = 4;
                    }
                    else
                        action += char;
                }
                else if (utils_1.inStr(char, `"'`)) {
                    // 进入引号
                    action += char;
                    quot = true;
                }
                else {
                    action += char;
                    if (char == '{')
                        braceLevel++;
                }
            }
            else if (parseState == 4 && char.trim() && char != '|' && char != ';') {
                utils_1.assert(false, 'New producer before the previous ends.');
            }
            if ((parseState == 2 || parseState == 4) && utils_1.inStr(char, `;|`)) {
                // 完成一条产生式
                this._producers.push(new Grammar_1.Producer(producerLhs, producerRhs, action));
                producerRhs = [];
                action = '';
                if (char === '|') {
                    // 仍使用当前的产生式左侧
                    parseState = 2;
                }
                else {
                    parseState = 0;
                    producerLhs = '';
                }
            }
        }
        if (!this._startSymbol.trim() && this._producers.length) {
            this._startSymbol = this._producers[0].lhs;
        }
        else if (this._startSymbol.trim()) {
            let flag = false;
            for (let i in this._producers) {
                let producer = this._producers[i];
                if (producer.lhs === this._startSymbol)
                    flag = true;
            }
            utils_1.assert(flag, `Invalid start: ${this._startSymbol}`);
        }
    }
    /**
     * 填充各部分文本
     */
    _fillText() {
        let copyPartStart = -1, copyPartEnd = -1, twoPercent = [];
        // 寻找分界符位置
        this._splitContent.forEach((v, i) => {
            switch (v.trimRight() // 要求左侧顶格
            ) {
                case '%{':
                    utils_1.assert(copyPartStart === -1, 'Bad .y structure. Duplicate %{.');
                    copyPartStart = i;
                    break;
                case '%}':
                    utils_1.assert(copyPartEnd === -1, 'Bad .y structure. Duplicate %}.');
                    copyPartEnd = i;
                    break;
                case '%%':
                    utils_1.assert(twoPercent.length < 2, 'Bad .y structure. Duplicate %%.');
                    twoPercent.push(i);
                    break;
            }
        });
        utils_1.assert(copyPartStart !== -1, 'Bad .y structure. {% not found.');
        utils_1.assert(copyPartEnd !== -1, 'Bad .y structure. %} not found.');
        utils_1.assert(twoPercent.length === 2, 'Bad .y structure. No enough %%.');
        // 最末尾的C代码部分
        this._userCodePart = this._splitContent.slice(twoPercent[1] + 1).join('\n');
        // 开头的直接复制部分
        this._copyPart = this._splitContent
            .slice(copyPartStart + 1, copyPartEnd)
            .join('\n');
        // 中间的规则部分
        this._producerPart = this._splitContent
            .slice(twoPercent[0] + 1, twoPercent[1])
            .join('\n');
        // 剩余的是信息部分
        this._infoPart =
            this._splitContent.slice(0, copyPartStart).join('\n') +
                this._splitContent.slice(copyPartEnd + 1, twoPercent[0]).join('\n');
    }
}
exports.YaccParser = YaccParser;
