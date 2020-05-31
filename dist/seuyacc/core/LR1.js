"use strict";
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * LR语法分析表
 * by Withod, z0gSh1u
 * 2020-05 @ https://github.com/Withod/seu-lex-yacc
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("./Grammar");
const utils_1 = require("../../utils");
/**
 *             LR1DFA
 *  LR1ItemSet
 *  _________
 * |         |
 * | LR1Item |
 * | LR1Item | -----> ...
 * | ...     |
 * |_________|
 */
/**
 * LR1项目
 */
class LR1Item {
}
exports.LR1Item = LR1Item;
/**
 * LR1项目集（LR1自动机状态）
 */
class LR1ItemSet {
}
exports.LR1ItemSet = LR1ItemSet;
/**
 * LR1项目集族（LR1自动机）
 */
class LR1DFA {
}
exports.LR1DFA = LR1DFA;
class LR1Analyzer {
    constructor(yaccParser) {
        this._symbols = [];
        // @ts-ignore
        this._symbolRange = [];
        this._producers = [];
        this._operators = yaccParser.operatorDecl;
        this._distributeId(yaccParser);
        this._convertProducer(yaccParser.producers);
    }
    get symbols() {
        return this._symbols;
    }
    /**
     * 为符号分配编号
     */
    _distributeId(yaccParser) {
        // 处理方式参考《Flex与Bison》P165
        // 0~127 ASCII，文字符号编号
        // 128~X Token编号
        // X+1~Y 非终结符编号
        for (let i = 0; i < 128; i++)
            this._symbols.push({ type: 'ascii', content: String.fromCharCode(i) });
        // 标记一下ASCII中的不可打印字符
        for (let i = 0; i < utils_1.ASCII_MIN; i++)
            this._symbols[i] = { type: 'ascii', content: '[UNPRINTABLE]' };
        this._symbols[utils_1.ASCII_MAX + 1] = { type: 'ascii', content: '[UNPRINTABLE]' };
        this._symbolRange.push(0, 128);
        for (let token of yaccParser.tokenDecl)
            this._symbols.push({ type: 'token', content: token });
        this._symbolRange.push(this._symbols.length);
        for (let nonTerminal of yaccParser.nonTerminals)
            this._symbols.push({ type: 'nonterminal', content: nonTerminal });
        this._symbolRange.push(this._symbols.length);
        for (let spToken of Grammar_1.SpToken)
            this._symbols.push({ type: 'sptoken', content: spToken });
        this._startSymbol = this._getSymbolId({ content: yaccParser.startSymbol });
        utils_1.assert(this._startSymbol, 'LR1 startSymbol unset.');
    }
    /**
     * 获取编号后的符号的编号
     */
    _getSymbolId(grammarSymbol) {
        for (let i = 0; i < this._symbols.length; i++)
            if ((!grammarSymbol.type ? true : this._symbols[i].type === grammarSymbol.type) &&
                this._symbols[i].content === grammarSymbol.content)
                return i;
        return -1;
    }
    /**
     * FIRST函数
     * @param symbols
     */
    _first(symbols) {
        if (!symbols.length)
            return [this._getSymbolId({ type: 'sptoken', content: 'EPSILON' })];
        let ret = [];
        if (symbols[0] < this._symbolRange[2] || symbols[0] >= this._symbolRange[3])
            ret.push(symbols[0]);
        else {
            //TODO: 在存在直接或间接左递归的情况下会进入死循环，需要解决办法
            this._producersOf(symbols[0]).forEach(producer => {
                this._first(producer.rhs).forEach(symbol => {
                    if (!ret.includes(symbol))
                        ret.push(symbol);
                });
            });
        }
        if (ret.includes(this._getSymbolId({ type: 'sptoken', content: 'EPSILON' }))) {
            this._first(symbols.slice(1)).forEach(symbol => {
                if (!ret.includes(symbol))
                    ret.push(symbol);
            });
        }
        return ret;
    }
    /**
     * FOLLOW函数
     * @param nonterminal
     */
    _follow(nonterminal) {
        let ret = [];
        let epsilon = this._getSymbolId({ type: 'sptoken', content: 'EPSILON' });
        if (nonterminal == this._startSymbol)
            ret.push(this._getSymbolId({ type: 'sptoken', content: 'END' }));
        for (let producer of this._producers) {
            for (let i = 0; i < producer.rhs.length; i++) {
                if (producer.rhs[i] == nonterminal) {
                    let first = this._first(producer.rhs.slice(i + 1));
                    first.forEach(symbol => {
                        if (symbol != epsilon && !ret.includes(symbol))
                            ret.push(symbol);
                    });
                    if (first.includes(epsilon) && nonterminal != producer.lhs) {
                        this._follow(producer.lhs).forEach(symbol => {
                            if (!ret.includes(symbol))
                                ret.push(symbol);
                        });
                    }
                }
            }
        }
        return ret;
    }
    /**
     * 获取指定非终结符为左侧的所有产生式
     * @param nonterminal 产生式左侧的非终结符
     */
    _producersOf(nonterminal) {
        let ret = [];
        for (let producer of this._producers) {
            if (producer.lhs == nonterminal)
                ret.push(producer);
        }
        return ret;
    }
    /**
     * 将产生式转换为单条存储的、数字->数字[]形式
     */
    _convertProducer(stringProducers) {
        for (let stringProducer of stringProducers) {
            let lhs = this._getSymbolId({ type: 'nonterminal', content: stringProducer.lhs });
            utils_1.assert(lhs != -1, 'lhs not found in symbols. This error should never occur.');
            for (let [index, right] of stringProducer.rhs.entries()) {
                let rhs = [], PATTERN = new RegExp(/(' '|[^ ]+)/g), char;
                while ((char = PATTERN.exec(right))) {
                    let tmp = char[0];
                    if (/'.+'/.test(char[0])) {
                        tmp = char[0].substring(1, char[0].length - 1);
                        if (tmp[0] == '\\')
                            tmp = utils_1.cookString(tmp);
                    }
                    let id = this._getSymbolId({ content: tmp });
                    rhs.push(id);
                }
                this._producers.push(new Grammar_1.LR1Producer(lhs, rhs, stringProducer.actions[index]));
            }
        }
    }
    epsilonClosure(states) {
        let stack = [...states]; // 深搜辅助栈
    }
    firstSet() {
        return;
    }
}
exports.LR1Analyzer = LR1Analyzer;
