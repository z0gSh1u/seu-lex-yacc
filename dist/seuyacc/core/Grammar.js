"use strict";
/* eslint-disable @typescript-eslint/member-delimiter-style */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 语法相关定义
 * by Withod, z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
/**
 * 特殊Symnpl
 */
exports.SpSymbol = {
    END: { type: 'sptoken', content: '[END]' },
    EPSILON: { type: 'sptoken', content: '[EPSILON]' },
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
/**
 *              LR1DFA
 *  LR1ItemSet
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
 * 将多个终结符的，拆分成不同的项目，每个项目只有一个终结符
 */
class LR1Item {
    constructor(producer, lookahead, dotPosition = 0) {
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
    /**
     * 检测点号是否到达尾部
     */
    dotAtLast() {
        return this._dotPosition === this._producer.rhs.length;
    }
    /**
     * 向后挪动点号
     */
    dotGo() {
        this._dotPosition += 1;
    }
    static copy(item, go = false) {
        return new LR1Item(item._producer, item._lookahead, item._dotPosition + (go ? 1 : 0));
    }
    static sameItem(i1, i2) {
        return (i1._dotPosition === i2._dotPosition &&
            i1._lookahead === i2._lookahead &&
            i1._producer.lhs === i2._producer.lhs &&
            JSON.stringify(i1._producer.rhs) === JSON.stringify(i2._producer.rhs));
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
    static copy(state) {
        return new LR1State(state._items.map(x => LR1Item.copy(x)));
    }
    static sameState(s1, s2) {
        return s1._items.every(x => s2._items.some(y => LR1Item.sameItem(x, y)));
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
    addState(state) {
        this._states.push(state);
        this._adjList.push([]);
    }
    link(from, to, alpha) {
        this._adjList[from].push({ to, alpha });
    }
    get startStateId() {
        return this._startStateId;
    }
    get states() {
        return this._states;
    }
    get adjList() {
        return this._adjList;
    }
}
exports.LR1DFA = LR1DFA;
