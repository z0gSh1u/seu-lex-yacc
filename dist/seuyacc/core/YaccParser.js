"use strict";
/**
 * Yacc源文件 (.y）解析器
 * by Withod, z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../../utils");
const Grammar_1 = require("./Grammar");
/**
 * .y文件解析器
 */
class YaccParser {
    constructor(filePath) {
        this._tokenDecl = [];
        this._operatorDecl = [];
        this._nonTerminals = [];
        this._producers = [];
        this._startSymbol = '';
        this._rawContent = fs_1.default.readFileSync(filePath).toString().replace(/\r\n/g, '\n'); // 统一使用LF，没有CR
        this._splitContent = this._rawContent.split('\n');
        this._fillText();
        this._parseProducerPart();
        this._parseInfoPart();
    }
    get copyPart() {
        return this._copyPart;
    }
    get userCodePart() {
        return this._userCodePart;
    }
    get producers() {
        return this._producers;
    }
    get operatorDecl() {
        return this._operatorDecl;
    }
    get startSymbol() {
        return this._startSymbol;
    }
    get nonTerminals() {
        return this._nonTerminals;
    }
    get tokenDecl() {
        return this._tokenDecl;
    }
    /**
     * 分析信息部分
     */
    _parseInfoPart() {
        let currentPrecedence = 0;
        this._infoPart.split('\n').forEach(line => {
            if (!line.trim())
                return;
            let words = line.split(/\s+/);
            switch (words[0]) {
                case '%token':
                    for (let i = 1; i < words.length; i++)
                        !this._tokenDecl.includes(words[i]) && this._tokenDecl.push(words[i]);
                    break;
                case '%left':
                case '%right':
                    currentPrecedence += 1;
                    const assoc = words[0].substring(1);
                    for (let i = 1; i < words.length; i++) {
                        let temp = words[i], literalOnly = false;
                        if (temp[0] == "'") {
                            utils_1.assert(temp[temp.length - 1] == "'", `Quote not closed: ${temp}`);
                            temp = utils_1.cookString(temp.substring(1, temp.length - 1));
                            literalOnly = true;
                        }
                        utils_1.assert(!this._operatorDecl.some(x => x.tokenName == temp || x.literal == temp), `Operator redefined: ${temp}`);
                        this._operatorDecl.push(literalOnly
                            ? { literal: temp, assoc, precedence: currentPrecedence }
                            : { tokenName: temp, assoc, precedence: currentPrecedence });
                    }
                    break;
                case '%start':
                    for (let i = 1; i < words.length; i++) {
                        utils_1.assert(!this._startSymbol.trim(), `Start symbol redefined: ${words[i]}`);
                        console.log(this._producerPart);
                        // console.log(this._startSymbol)
                        // console.log(this._nonTerminals)
                        utils_1.assert(this._nonTerminals.includes(words[i]), `Unknown start symbol: ${words[i]}`);
                        this._startSymbol = words[i];
                    }
                    break;
                default:
                    utils_1.assert(false, `Unknown declaration: ${words[0]}`);
            }
        });
        utils_1.assert(this._startSymbol.trim(), 'Start symbol undefined.');
    }
    /**
     * 解析产生式部分
     */
    _parseProducerPart() {
        let m1, m2, m3;
        while ((m1 = utils_1.PATTERN_BLOCK_PRODUCER.exec(this._producerPart))) {
            let block = m1[0], lhs, rhs = [], actions = [];
            m2 = new RegExp(utils_1.PATTERN_INITIAL_PRODUCER).exec(block);
            lhs = m2[1];
            this._nonTerminals.push(lhs);
            rhs.push(m2[3]);
            actions.push(m2[4] ? m2[4].substring(1, m2[4].length - 1).trim() : '');
            let p3 = new RegExp(utils_1.PATTERN_CONTINUED_PRODUCER);
            while ((m3 = p3.exec(block))) {
                rhs.push(m3[2]);
                actions.push(m3[3] ? m3[3].substring(1, m3[3].length - 1).trim() : '');
            }
            this._producers.push(new Grammar_1.YaccParserProducer(lhs, rhs, actions));
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
        this._copyPart = this._splitContent.slice(copyPartStart + 1, copyPartEnd).join('\n');
        // 中间的规则部分
        this._producerPart = this._splitContent.slice(twoPercent[0] + 1, twoPercent[1]).join('\n');
        // 剩余的是信息部分
        this._infoPart =
            this._splitContent.slice(0, copyPartStart).join('\n') +
                this._splitContent.slice(copyPartEnd + 1, twoPercent[0]).join('\n');
    }
}
exports.YaccParser = YaccParser;
