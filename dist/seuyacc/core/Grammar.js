"use strict";
/* eslint-disable @typescript-eslint/member-delimiter-style */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 特殊Symbol
 */
exports.SpSymbol = {
    END: { type: 'sptoken', content: 'SP_END' },
    EPSILON: { type: 'sptoken', content: 'SP_EPSILON' },
};
/**
 * YaccParser读出的产生式
 */
class YaccParserProducer {
    constructor(lhs, rhs, actions) {
        this._lhs = lhs;
        this._rhs = [...rhs];
        this._actions = [...actions];
    }
    get lhs() {
        return this._lhs;
    }
    get rhs() {
        return this._rhs;
    }
    get actions() {
        return this._actions;
    }
}
exports.YaccParserProducer = YaccParserProducer;
// ===================== LR1相关 =====================
// LR1阶段对各文法符号都进行了编号
/**
 *              LR1DFA
 *  LR1State
 *  _________
 * |         |
 * | LR1Item |
 * | LR1Item | -----> ...
 * | ...     |
 * |_________|
 */
/**
 * LR1单条产生式
 * lhs->rhs {action}
 */
class LR1Producer {
    constructor(lhs, rhs, action = '') {
        this._lhs = lhs;
        this._rhs = [...rhs];
        this._action = action;
    }
    get lhs() {
        return this._lhs;
    }
    get rhs() {
        return this._rhs;
    }
    get action() {
        return this._action;
    }
}
exports.LR1Producer = LR1Producer;
/**
 * LR1项目
 * A->a, $就是一条项目
 * 将多个展望符的，拆分成不同的项目，每个项目只有一个展望符号
 */
class LR1Item {
    constructor(rawProducer, producer, lookahead, dotPosition = 0) {
        this._rawProducer = rawProducer;
        this._producer = producer;
        this._lookahead = lookahead;
        this._dotPosition = dotPosition;
    }
    get producer() {
        return this._producer;
    }
    get dotPosition() {
        return this._dotPosition;
    }
    get lookahead() {
        return this._lookahead;
    }
    get rawProducer() {
        return this._rawProducer;
    }
    dotAtLast() {
        return this._dotPosition === this._rawProducer.rhs.length;
    }
    dotGo() {
        this._dotPosition += 1;
    }
    static copy(item, go = false) {
        return new LR1Item(item._rawProducer, item._producer, item._lookahead, item._dotPosition + (go ? 1 : 0));
    }
    static same(i1, i2) {
        return (i1._dotPosition === i2._dotPosition &&
            i1._lookahead === i2._lookahead &&
            i1._producer === i2._producer);
    }
}
exports.LR1Item = LR1Item;
/**
 * LR1项目集（LR1自动机状态）
 */
class LR1State {
    constructor(items) {
        this._items = [...items];
    }
    get items() {
        return this._items;
    }
    addItem(item) {
        this._items.push(item);
    }
    forceSetItems(items) {
        this._items = [...items];
    }
    static copy(state) {
        return new LR1State(state._items.map(x => LR1Item.copy(x)));
    }
    static same(s1, s2) {
        return (s1._items.every(x => s2._items.some(y => LR1Item.same(x, y))) &&
            s2._items.every(x => s1._items.some(y => LR1Item.same(x, y))));
    }
}
exports.LR1State = LR1State;
/**
 * LR1项目集族（LR1自动机）
 */
class LR1DFA {
    constructor(startStateId) {
        this._startStateId = startStateId;
        this._states = [];
        this._adjList = [];
    }
    get startStateId() {
        return this._startStateId;
    }
    set startStateId(val) {
        this._startStateId = val;
    }
    get states() {
        return this._states;
    }
    get adjList() {
        return this._adjList;
    }
    addState(state) {
        this._states.push(state);
        this._adjList.push([]);
    }
    link(from, to, alpha) {
        this._adjList[from].push({ to, alpha });
    }
}
exports.LR1DFA = LR1DFA;
/**
 * LR1运算符
 */
class LR1Operator {
    constructor(symbolId, assoc, precedence) {
        this._symbolId = symbolId;
        this._assoc = assoc;
        this._precedence = precedence;
    }
    get symbolId() {
        return this._symbolId;
    }
    get assoc() {
        return this._assoc;
    }
    get precedence() {
        return this._precedence;
    }
}
exports.LR1Operator = LR1Operator;
