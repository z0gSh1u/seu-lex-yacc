"use strict";
/**
 * 语法相关定义
 * by Withod
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 产生式类
 */
class Producer {
    constructor(lhs, rhs, action) {
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
exports.Producer = Producer;
/**
 * 操作符类
 */
class Operator {
    constructor(name, isRight) {
        this._name = name;
        this._isRight = isRight;
    }
    get name() {
        return this._name;
    }
    get isRight() {
        return this._isRight;
    }
}
exports.Operator = Operator;
