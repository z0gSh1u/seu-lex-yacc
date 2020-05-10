"use strict";
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable indent */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * NFA（非确定有限状态自动机）
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
const FA_1 = require("./FA");
const utils_1 = require("../../utils");
/**
 * 非确定有限状态自动机
 */
class NFA extends FA_1.FiniteAutomata {
    /**
     * 构造一个空NFA
     */
    constructor() {
        super();
        this._startStates = []; // 开始状态
        this._acceptStates = []; // 接收状态
        this._states = []; // 全部状态
        this._alphabet = []; // 字母表
        this._transformAdjList = []; // 状态转移邻接链表
    }
    /**
     * 构造一个形如`->0 --a--> [1]`的原子NFA（两个状态，之间用初始字母连接）
     * `initAlpha`也可以为SpAlpha枚举
     */
    static atom(initAlpha) {
        let nfa = new NFA();
        nfa._startStates = [new FA_1.State()]; // 开始状态
        nfa._acceptStates = [new FA_1.State()]; // 接收状态
        nfa._states = [...nfa._startStates, ...nfa._acceptStates]; // 全部状态
        nfa._alphabet =
            typeof initAlpha === 'string' ? [initAlpha] : [FA_1.getSpAlpha(initAlpha)]; // 字母表
        nfa._transformAdjList = [
            [{ alpha: typeof initAlpha === 'number' ? initAlpha : 0, target: 1 }],
            [],
        ]; // []表示接收态没有出边
        return nfa;
    }
    /**
     * 返回形状一致的新NFA（深拷贝，State的Symbol生成新的，与原NFA互不影响）
     */
    static copy(nfa) {
        let res = new NFA();
        res._states = [];
        for (let i = 0; i < nfa._states.length; i++) {
            if (nfa._startStates.includes(nfa._states[i])) {
                let newState = new FA_1.State();
                res._startStates.push(newState);
                res._states[i] = newState;
            }
            else if (nfa._acceptStates.includes(nfa._states[i])) {
                let newState = new FA_1.State();
                res._acceptStates.push(newState);
                res._states[i] = newState;
            }
            else {
                res._states[i] = new FA_1.State();
            }
        }
        res._alphabet = [...nfa._alphabet];
        res._transformAdjList = JSON.parse(JSON.stringify(nfa._transformAdjList));
        return res;
    }
    /**
     * 尝试用NFA识别字符串
     * @param str 待识别字符串
     */
    test(str) {
        let sentence = str.split('');
        // 试验每一个开始状态
        for (let startState of this._startStates) {
            let currentState = startState, // 本轮深搜当前状态
            matchedLength = 0, candidates = []; // DFS辅助数组，记录历史状态
            while (matchedLength <= sentence.length) {
                if (
                // 目前匹配了全句
                matchedLength === sentence.length &&
                    // 并且目前已经到达接收态
                    this.hasReachedAccept(currentState)) {
                    return true;
                }
                else if (matchedLength === sentence.length) {
                    // 全部匹配完成但是未到达接收态，说明应换一个开始状态再次试验
                    break;
                }
                else if (!this._alphabet.includes(sentence[matchedLength]) &&
                    !this._alphabet.includes(FA_1.getSpAlpha(FA_1.SpAlpha.ANY))) {
                    // 字母表不存在该字符，并且该自动机没有any转移
                    // 注：此时matchedWordCount一定小于sentence.length，不用担心越界
                    return false;
                }
                else {
                    // 剩余情况则向外推进，继续搜索
                    let expandResult = this.expand(currentState, this._alphabet.indexOf(sentence[matchedLength]));
                    matchedLength += 1;
                    for (let expandState of expandResult) {
                        !candidates.includes(expandState) && candidates.push(expandState);
                    }
                }
                if (!candidates.length) {
                    // 没有可选的进一步状态了
                    break;
                }
                else {
                    // 选一个可选的进一步状态
                    currentState = candidates.pop();
                }
            }
        }
        return false;
    }
    /**
     * 返回从某状态收到一个字母并消耗它后能到达的所有其他状态（考虑了利用epsilon边进行预先和预后扩展）
     * @param state 某状态
     * @param alpha 字母在字母表的下标
     * @returns `{结果状态数组, 是否消耗字母}`
     */
    expand(state, alpha) {
        let preExpand = this.epsilonClosure([state]); // 所有可行的出发状态
        let result = [];
        for (let state of preExpand) {
            let transforms = this.getTransforms(state); // 该状态的所有出转移
            for (let transform of transforms) {
                if (transform.alpha === alpha ||
                    (transform.alpha === FA_1.SpAlpha.ANY && this._alphabet[alpha] !== '\n')) {
                    // 能够吃掉当前字符后到达的所有状态
                    result.push(this._states[transform.target]);
                }
            }
        }
        let postExpanded = this.epsilonClosure(result); // 再考虑一次epsilon扩展
        return postExpanded;
    }
    /**
     * 返回从某状态集合通过一个字母能到达的所有状态（没有考虑epsilon边扩展）
     * @param states 状态集合
     * @param alpha 字母在字母表的下标
     */
    move(states, alpha) {
        let result = [];
        for (let state of states) {
            let transforms = this.getTransforms(state);
            for (let transform of transforms) {
                if (transform.alpha === alpha ||
                    (transform.alpha === FA_1.SpAlpha.ANY && this._alphabet[alpha] !== '\n')) {
                    let targetState = this._states[transform.target];
                    if (!result.includes(targetState)) {
                        result.push(targetState);
                    }
                }
            }
        }
        return result;
    }
    /**
     * 获得epsilon闭包，即从某状态集合只通过epsilon边所能到达的所有状态（包括自身）
     * @param states 状态集合
     */
    epsilonClosure(states) {
        let result = [...states];
        for (let i = 0; i < result.length; i++) {
            result = result.concat(this.getTransforms(result[i], [FA_1.SpAlpha.EPSILON])
                .map((transform) => this._states[transform.target])
                .filter((v) => !result.includes(v)));
        }
        return result;
    }
    /**
     * 将当前NFA原地做Kleene闭包（星闭包），见龙书3.7.1节图3-34
     *
     * ```
     *      ________________ε_______________
     *     |                                ↓
     * 新开始 -ε-> 旧开始 --...--> 旧接收 -ε-> 新接收
     *              ↑______ε______|
     * ```
     */
    kleene() {
        // new_start --epsilon--> old_start
        let oldStartStates = [...this._startStates], newStartState = new FA_1.State();
        this._startStates = [newStartState];
        this._states.push(newStartState);
        this._transformAdjList.push([]);
        this.linkEpsilon(this._startStates, oldStartStates);
        // old_accept --epsilon--> new_accept
        let oldAcceptStates = [...this._acceptStates], newAcceptState = new FA_1.State();
        this._acceptStates = [newAcceptState];
        this._states.push(newAcceptState);
        this._transformAdjList.push([]);
        this.linkEpsilon(oldAcceptStates, this._acceptStates);
        // new_start --epsilon--> new_accept
        this.linkEpsilon(this._startStates, this._acceptStates);
        // old_accept --epsilon--> old_start
        this.linkEpsilon(oldAcceptStates, oldStartStates);
    }
    /**
     * 把`from`中的每个状态到`to`中的每个状态用字母alpha建立边
     * @param alpha 字母在字母表的下标
     */
    link(from, to, alpha) {
        for (let i = 0; i < from.length; i++) {
            let transforms = this.getTransforms(from[i]);
            for (let j = 0; j < to.length; j++) {
                transforms.push({
                    alpha,
                    target: this._states.indexOf(to[j]),
                });
            }
            this.setTransforms(from[i], transforms);
        }
    }
    /**
     * 把`from`中的每个状态到`to`中的每个状态建立epsilon边
     */
    linkEpsilon(from, to) {
        this.link(from, to, FA_1.SpAlpha.EPSILON);
    }
    /**
     * 检测该状态是否到达接收状态（考虑了借助epsilon边）
     */
    hasReachedAccept(currentState) {
        // 不考虑epsilon边
        if (this._acceptStates.includes(currentState)) {
            return true;
        }
        // 考虑epsilon边
        let stack = [currentState]; // 深搜辅助栈
        while (!!stack.length) {
            for (let transform of this.getTransforms(stack.pop(), [
                FA_1.SpAlpha.EPSILON,
            ])) {
                // 遍历所有epsilon转移
                let targetState = this._states[transform.target];
                // 如果到达接收状态就返回真
                if (this._acceptStates.includes(targetState))
                    return true;
                // 否则放入栈等待进一步扩展
                else if (stack.indexOf(targetState))
                    stack.push(targetState);
            }
        }
        return false;
    }
    /**
     * 就地合并`from`的状态转移表到`to`的。请保证先合并状态和字母表
     */
    static mergeTranformAdjList(from, to) {
        let transformMatrixResult = to._transformAdjList;
        for (let i = 0; i < from._transformAdjList.length; i++) {
            let transforms = from._transformAdjList[i], transformsResult = [];
            // 重构from中的所有转移
            for (let transform of transforms) {
                let indexOfAlphaInRes = transform.alpha < 0
                    ? transform.alpha
                    : to._alphabet.indexOf(from._alphabet[transform.alpha]), indexOfTargetInRes = to._states.indexOf(from._states[transform.target]);
                transformsResult.push({
                    alpha: indexOfAlphaInRes,
                    target: indexOfTargetInRes,
                });
            }
            transformMatrixResult.push(transformsResult);
        }
    }
    /**
     * 串联两个NFA（加"点"，连接运算）
     * ```
     * NFA1 --epsilon--> NFA2
     * ```
     */
    static serial(nfa1, nfa2) {
        let res = new NFA();
        // 处理开始状态、接收状态、状态、字母表
        res._startStates = [...nfa1._startStates];
        res._acceptStates = [...nfa2._acceptStates];
        res._states = [...nfa1._states, ...nfa2._states];
        // 请注意，由于使用Set去重后展开，无法保证字母的下标与原先一致！
        res._alphabet = [...new Set([...nfa1._alphabet, ...nfa2._alphabet])];
        NFA.mergeTranformAdjList(nfa1, res);
        NFA.mergeTranformAdjList(nfa2, res);
        res.linkEpsilon(nfa1._acceptStates, nfa2._startStates);
        return res;
    }
    /**
     * 并联两个NFA（对应于|或运算）
     * ```
     *             ε  NFA1  ε
     * new_start <             > new_accept
     *             ε  NFA2  ε
     * ```
     */
    static parallel(nfa1, nfa2) {
        let res = new NFA();
        res._startStates = [new FA_1.State()];
        res._acceptStates = [new FA_1.State()];
        res._alphabet = [...new Set([...nfa1._alphabet, ...nfa2._alphabet])];
        res._states = [
            ...res._startStates,
            ...nfa1._states,
            ...nfa2._states,
            ...res._acceptStates,
        ];
        res._transformAdjList = [[]]; // new_start
        NFA.mergeTranformAdjList(nfa1, res);
        NFA.mergeTranformAdjList(nfa2, res);
        res._transformAdjList.push([]); // new_accept
        res.linkEpsilon(res._startStates, nfa1._startStates);
        res.linkEpsilon(res._startStates, nfa2._startStates);
        res.linkEpsilon(nfa1._acceptStates, res._acceptStates);
        res.linkEpsilon(nfa2._acceptStates, res._acceptStates);
        return res;
    }
    /**
     * 根据正则表达式构造NFA
     */
    static fromRegex(regex) {
        let parts = utils_1.splitAndKeep(regex.postFix, '()|*?+\\. '); // 分离特殊符号
        let stack = [], oprand1, oprand2, waitingEscapeDetail = false;
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i].trim();
            if (part.length === 0) {
                // 空格跳过
                continue;
            }
            if (waitingEscapeDetail) {
                stack.push(NFA.atom(`\\${part}`));
                waitingEscapeDetail = false;
                continue;
            }
            switch (part) {
                case '|': // 或符
                    ;
                    [oprand1, oprand2] = [stack.pop(), stack.pop()];
                    stack.push(NFA.parallel(oprand2, oprand1));
                    break;
                case '[dot]': // 连接符
                    ;
                    [oprand1, oprand2] = [stack.pop(), stack.pop()];
                    stack.push(NFA.serial(oprand2, oprand1));
                    break;
                case '*': // 星闭包符
                    stack[stack.length - 1].kleene();
                    break;
                case '+': // 正闭包符
                    // A+ ----> AA*
                    oprand1 = stack.pop();
                    let oprand1Kleene = NFA.copy(oprand1);
                    oprand1Kleene.kleene();
                    stack.push(NFA.serial(oprand1, oprand1Kleene));
                    break;
                case '?': // 0/1符
                    oprand1 = stack.pop();
                    oprand1.linkEpsilon(oprand1._startStates, oprand1._acceptStates);
                    stack.push(oprand1);
                    break;
                case '\\': // 转义符
                    // 由于Regex转后缀阶段的机智处理，只要看到反斜杠，就一定是转义
                    waitingEscapeDetail = true;
                    break;
                case '.': // 任意字符点（不再是连接符了）
                    stack.push(NFA.atom(FA_1.SpAlpha.ANY));
                    break;
                case '[space]': // 空格
                    stack.push(NFA.atom(' '));
                    break;
                default:
                    // 普通字符
                    stack.push(NFA.atom(part[0]));
                    break;
            }
        }
        utils_1.assert(stack.length === 1, 'Stack too big after NFA construction.');
        return stack.pop();
    }
}
exports.NFA = NFA;
