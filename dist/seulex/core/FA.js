"use strict";
/* eslint-disable @typescript-eslint/member-delimiter-style */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FA（有限状态自动机）及状态、转换的声明
 * by z0gSh1u & Twileon
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
    SpAlpha[SpAlpha["OTHER"] = -3] = "OTHER";
})(SpAlpha = exports.SpAlpha || (exports.SpAlpha = {}));
/**
 * 将特殊字符下标转为字符描述
 */
function getSpAlpha(alpha) {
    const table = { '-1': '[ε]', '-2': '[any]', '-3': '[other]' };
    // @ts-ignore
    return table[alpha] || '';
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
     * 获得从该状态出发的所有一步转移（不自动扩展）
     * @param state 出发状态
     * @param spAlpha 如果定义，则只考虑该列表中的字母的转移
     */
    getTransforms(state, spAlpha) {
        let res = this._transformAdjList[this._states.indexOf(state)];
        if (spAlpha)
            return res.filter((v) => spAlpha.includes(v.alpha));
        else
            return res;
    }
    /**
     * 设置从该状态出发的所有一步转移
     */
    setTransforms(state, transfroms) {
        this._transformAdjList[this._states.indexOf(state)] = transfroms;
    }
    /**
     * 深拷贝FA，State的Symbol生成新的，与原FA互不影响）
     */
    static copy(fa) {
        let res = new FiniteAutomata();
        res._states = [];
        res._startStates = [];
        res._acceptStates = [];
        for (let i = 0; i < fa._states.length; i++) {
            if (fa._startStates.includes(fa._states[i])) {
                let newState = new State();
                res._startStates.push(newState);
                res._states[i] = newState;
            }
            else if (fa._acceptStates.includes(fa._states[i])) {
                let newState = new State();
                res._acceptStates.push(newState);
                res._states[i] = newState;
            }
            else {
                res._states[i] = new State();
            }
        }
        res._alphabet = [...fa._alphabet];
        res._transformAdjList = JSON.parse(JSON.stringify(fa._transformAdjList));
        return res;
    }
}
exports.FiniteAutomata = FiniteAutomata;
