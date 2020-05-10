"use strict";
/* eslint-disable @typescript-eslint/member-delimiter-style */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FA（有限状态自动机）及状态、转换的声明
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
/**
 * 自动机状态
 */
class State {
    constructor(uuid) {
        this._uuid = uuid || Symbol();
    }
    // 判断两个状态是不是一样的
    same(another) {
        return this._uuid === another._uuid;
    }
    static same(one, another) {
        return one._uuid === another._uuid;
    }
}
exports.State = State;
/**
 * 特殊字符枚举
 */
var SpAlpha;
(function (SpAlpha) {
    SpAlpha[SpAlpha["EPSILON"] = -1] = "EPSILON";
    SpAlpha[SpAlpha["ANY"] = -2] = "ANY";
})(SpAlpha = exports.SpAlpha || (exports.SpAlpha = {}));
/**
 * 将特殊字符下标转为字符描述
 */
function getSpAlpha(alpha) {
    switch (alpha) {
        case -1:
            return 'ε';
        case -2:
            return '[any]';
    }
    return '';
}
exports.getSpAlpha = getSpAlpha;
/**
 * 有限状态自动机
 */
class FiniteAutomata {
    get startStates() {
        return this._startStates;
    }
    get acceptStates() {
        return this._acceptStates;
    }
    get states() {
        return this._states;
    }
    get alphabet() {
        return this._alphabet;
    }
    get transformAdjList() {
        return this._transformAdjList;
    }
    /**
     * 获得从该状态出发的所有一步转移
     * @param state 出发状态
     * @param epsilonOnly 是否只考虑epsilon转移，默认false
     */
    getTransforms(state, epsilonOnly = false) {
        let res = this._transformAdjList[this._states.indexOf(state)];
        if (epsilonOnly)
            return res.filter((v) => v.alpha === -1);
        else
            return res;
    }
    /**
     * 设置从该状态出发的所有一步转移
     */
    setTransforms(state, transfroms) {
        this._transformAdjList[this._states.indexOf(state)] = transfroms;
    }
}
exports.FiniteAutomata = FiniteAutomata;
