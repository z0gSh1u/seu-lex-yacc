"use strict";
/* eslint-disable @typescript-eslint/member-delimiter-style */
/**
 * 语法相关定义
 * by Withod
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpToken = [
    'END',
    'EPSILON'
];
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
/**
 * Single
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
