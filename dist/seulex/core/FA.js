"use strict";
/* eslint-disable @typescript-eslint/member-delimiter-style */
Object.defineProperty(exports, "__esModule", { value: true });
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
 * 有限状态自动机
 */
class FiniteAutomata {
    /**
     * 获得从该状态出发的所有一步转移
     * @param state 出发状态
     * @param epsilonOnly 是否只考虑epsilon转移，默认false
     */
    getTransforms(state, epsilonOnly = false) {
        let res = this._transformMatrix[this._states.indexOf(state)];
        if (epsilonOnly)
            return res.filter((v) => v.alpha === -1);
        else
            return res;
    }
    setTransforms(state, transfroms) {
        this._transformMatrix[this._states.indexOf(state)] = transfroms;
    }
}
exports.FiniteAutomata = FiniteAutomata;
