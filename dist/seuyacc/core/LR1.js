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
class LR1Analyzer {
    // private _firstMap: Map<number, number[]>
    constructor(yaccParser) {
        this._symbols = [];
        // @ts-ignore
        this._symbolRange = [];
        this._producers = [];
        this._operators = yaccParser.operatorDecl;
        // this._firstMap = new Map<number, number[]>() // expr->firstSymbol[]
        this._distributeId(yaccParser);
        this._convertProducer(yaccParser.producers);
    }
    /**
     * 为符号分配编号
     */
    _distributeId(yaccParser) {
        // 处理方式参考《Flex与Bison》P165
        // 0~127 ASCII，文字符号编号
        // 128~X Token编号
        // X+1~Y 非终结符编号
        // Y+1~Y+3 特殊符号
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
        for (let spSymbol of Object.values(Grammar_1.SpSymbol))
            this._symbols.push(spSymbol);
        this._symbolRange.push(this._symbols.length);
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
     * 根据编号获得符号
     */
    _getSymbolById(id) {
        return this._symbols[id];
    }
    getSymbolById(id) {
        return this._getSymbolById(id);
    }
    /**
     * 判断符号是否是某个类型
     */
    _symbolTypeIs(id, type) {
        return this._symbols[id].type === type;
    }
    /**
     * 求取FIRST集
     */
    FIRST(symbols) {
        if (!symbols.length)
            return [this._getSymbolId(Grammar_1.SpSymbol.EPSILON)];
        let ret = [];
        if (this._symbolTypeIs(symbols[0], 'nonterminal'))
            ret.push(symbols[0]);
        else {
            // TODO: 在存在直接或间接左递归的情况下会进入死循环，需要解决办法
            this._producersOf(symbols[0]).forEach(producer => {
                this.FIRST(producer.rhs).forEach(symbol => {
                    if (!ret.includes(symbol))
                        ret.push(symbol);
                });
            });
        }
        if (ret.includes(this._getSymbolId(Grammar_1.SpSymbol.EPSILON))) {
            this.FIRST(symbols.slice(1)).forEach(symbol => {
                if (!ret.includes(symbol))
                    ret.push(symbol);
            });
        }
        return ret;
    }
    /**
     * 求取FOLLOW集
     */
    FOLLOW(nonterminal) {
        let ret = [];
        let epsilon = this._getSymbolId(Grammar_1.SpSymbol.EPSILON);
        if (nonterminal == this._startSymbol)
            ret.push(this._getSymbolId(Grammar_1.SpSymbol.END));
        for (let producer of this._producers) {
            for (let i = 0; i < producer.rhs.length; i++) {
                if (producer.rhs[i] == nonterminal) {
                    let first = this.FIRST(producer.rhs.slice(i + 1));
                    first.forEach(symbol => {
                        if (symbol != epsilon && !ret.includes(symbol))
                            ret.push(symbol);
                    });
                    if (first.includes(epsilon) && nonterminal != producer.lhs) {
                        this.FOLLOW(producer.lhs).forEach(symbol => {
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
     */
    _producersOf(nonterminal) {
        let ret = [];
        for (let producer of this._producers)
            if (producer.lhs == nonterminal)
                ret.push(producer);
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
    // /**
    //  * 求取所有现有符号的FIRST集作为基础
    //  */
    // private FIRSTAll() {
    //   for (let i = 0; i < this._symbolRange[4]; i++) this._firstMap.set(i, this.FIRST([i]))
    // }
    constructLR1DFA() {
        // 将C初始化为{CLOSURE}({|S'->.S,$|})
        let initProducer = this._producersOf(this._startSymbol)[0];
        let initItem = new Grammar_1.LR1Item(initProducer, this._getSymbolId(Grammar_1.SpSymbol.END));
        let I0 = new Grammar_1.LR1State([initItem]);
        I0 = this.CLOSURE(I0);
        let dfa = new Grammar_1.LR1DFA(0);
        dfa.addState(I0);
        let stack = [0];
        while (stack.length) {
            console.log(stack.length);
            let stateToProcess = dfa.states[stack.pop()];
            let goto = this.GOTO(stateToProcess);
            for (let [key, val] of goto.entries()) {
                const stateIndex = dfa.states.findIndex(x => Grammar_1.LR1State.sameState(x, val));
                if (stateIndex !== -1) {
                    // 存在一致状态，直接连上边即可
                    dfa.link(dfa.states.indexOf(stateToProcess), stateIndex, key);
                }
                else {
                    let newState = new Grammar_1.LR1State(val.items);
                    dfa.addState(newState);
                    dfa.link(dfa.states.indexOf(stateToProcess), dfa.states.length - 1, key);
                    stack.push(dfa.states.length - 1);
                }
            }
        }
        return dfa;
    }
    /**
     * 求取GOTO(I, X)
     * 做了一些改进，变成GOTO(I)(X)
     * 见龙书算法4.53
     */
    GOTO(state) {
        var _a;
        let res = new Map(); // alpha, state
        for (let item of state.items) {
            if (item.dotAtLast())
                continue;
            let alpha = item.producer.rhs[item.dotPosition];
            let newItem = Grammar_1.LR1Item.copy(item, true);
            if (res.has(alpha)) {
                (_a = res.get(alpha)) === null || _a === void 0 ? void 0 : _a.addItem(newItem);
            }
            else {
                res.set(alpha, new Grammar_1.LR1State([newItem]));
            }
        }
        return res;
    }
    /**
     * 求取CLOSURE(I)
     * 见龙书算法4.53
     */
    CLOSURE(state) {
        let res = Grammar_1.LR1State.copy(state);
        let allItemsOfI = [...state.items]; // for I中的每一个项
        while (allItemsOfI.length) {
            let oneItemOfI = allItemsOfI.pop();
            if (oneItemOfI.dotAtLast())
                continue; // 点号到最后，不能扩展
            let currentSymbol = oneItemOfI.producer.rhs[oneItemOfI.dotPosition];
            if (!this._symbolTypeIs(currentSymbol, 'nonterminal'))
                continue; // 非终结符打头才有CLOSURE
            let extendProducers = [];
            for (let producerInG of this._producers) // for G'中的每个产生式
                producerInG.lhs === currentSymbol && extendProducers.push(producerInG); // 左手边是当前符号的，就可以作为扩展用
            let lookahead = oneItemOfI.lookahead;
            for (let extendProducer of extendProducers) {
                let newLookaheads = this.FIRST(oneItemOfI.producer.rhs.slice(oneItemOfI.dotPosition));
                if (newLookaheads.includes(this._getSymbolId(Grammar_1.SpSymbol.EPSILON))) {
                    // 存在epsilon作为FIRST符
                    newLookaheads = newLookaheads.filter(v => v != this._getSymbolId(Grammar_1.SpSymbol.EPSILON));
                    newLookaheads.push(lookahead);
                }
                for (let lookahead of newLookaheads) {
                    // for FIRST(βa)中的每个终结符号b
                    let newItem = new Grammar_1.LR1Item(extendProducer, lookahead);
                    if (state.items.some(item => Grammar_1.LR1Item.sameItem(item, newItem)))
                        continue; // 重复的情况不再添加
                    allItemsOfI.push(newItem); // 继续扩展
                    res.addItem(newItem);
                }
            }
        }
        return res;
    }
}
exports.LR1Analyzer = LR1Analyzer;
