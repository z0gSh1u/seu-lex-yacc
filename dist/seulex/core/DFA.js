"use strict";
/**
 * DFA（确定有限状态自动机）
 * by Withod
 * 2020-05 @ https://github.com/Withod/seu-lex-yacc
 */
Object.defineProperty(exports, "__esModule", { value: true });
const FA_1 = require("./FA");
/**
 * 确定有限状态自动机
 */
class DFA extends FA_1.FiniteAutomata {
    /**
     * 构造一个形如`->0 --a--> [1]`的原子DFA（两个状态，之间用初始字母连接）
     */
    constructor(NFA) {
        super();
        if (NFA) {
            this.constructedByNFA(NFA);
        }
        else {
            this._startStates = [new FA_1.State()]; // 开始状态
            this._acceptStates = [new FA_1.State()]; // 接收状态
            this._states = [...this._startStates, ...this._acceptStates]; // 全部状态
            this._alphabet = []; // 字母表
            this._transformAdjList = [[], []]; // 状态转移矩阵
        }
    }
    /**
     * 使用子集构造法由NFA构造此DFA
     * @param NFA 子集构造法所使用的NFA
     */
    constructedByNFA(NFA) {
        this._startStates = [];
        this._acceptStates = [];
        this._states = [];
        this._alphabet = [];
        this._transformAdjList = [];
        if (NFA.startStates == []) {
            return;
        }
        // 设置第一个开始状态
        let stateSets = [NFA.epsilonClosure(NFA.startStates)];
        this._alphabet = NFA.alphabet;
        this._startStates = [new FA_1.State()];
        this._acceptStates = [this._startStates[0]];
        this._transformAdjList = [[]];
        if (stateSets[0].some(s => NFA.acceptStates.includes(s))) {
            this._acceptStates = [this._startStates[0]];
        }
        this._states = [this._startStates[0]];
        // 遍历设置DFA中第i个状态读入第alpha个字母时的转换
        for (let i = 0; i < this._states.length; i++) {
            for (let alpha = 0; alpha < this._alphabet.length; alpha++) {
                let newStateSet = NFA.epsilonClosure(NFA.move(stateSets[i], alpha));
                if (newStateSet == []) {
                    continue;
                }
                let j = 0;
                for (; j < stateSets.length; j++) {
                    if (stateSets[j].every(s => newStateSet.includes(s)) &&
                        newStateSet.every(s => stateSets[j].includes(s))) {
                        // 与已有的状态集合相同
                        break;
                    }
                }
                if (j == stateSets.length) {
                    // 与已有的状态集合均不相同，因此新建一个状态
                    stateSets.push(newStateSet);
                    let newState = new FA_1.State();
                    this._states.push(newState);
                    this._transformAdjList.push([]);
                    if (newStateSet.some(s => NFA.acceptStates.includes(s))) {
                        this._acceptStates.push(newState);
                    }
                }
                this._transformAdjList[i].push({ alpha: alpha, target: j });
            }
        }
    }
    /**
     * 尝试用DFA识别字符串
     * @param str 待识别字符串
     */
    test(str) {
        let sentence = str.split('');
        // 试验每一个开始状态
        for (let startState of this._startStates) {
            let currentState = startState, // 本轮深搜当前状态
            matchedWordCount = 0, // 符合的字符数
            maybeStates = []; // DFS辅助数组，记录历史状态
            while (matchedWordCount <= sentence.length) {
                if (
                // 目前匹配了全句
                matchedWordCount === sentence.length &&
                    // 并且目前已经到达接收态
                    this.hasReachedAccept(currentState)) {
                    return true;
                }
                else if (matchedWordCount === sentence.length) {
                    // 全部匹配完成但是未到达接收态，说明应换一个开始状态再次试验
                    break;
                }
                else if (!this._alphabet.includes(sentence[matchedWordCount])) {
                    // 字母表不存在该字符
                    // 注意此时matchedWordCount一定小于sentence.length
                    return false;
                }
                else {
                    // 剩余情况则向外推进，继续搜索
                    let result = this.expand(currentState, this._alphabet.indexOf(sentence[matchedWordCount]));
                    matchedWordCount += 1;
                    for (let newState of result) {
                        !maybeStates.includes(newState) && maybeStates.push(newState);
                    }
                }
                if (!maybeStates.length) {
                    // 没有可选的进一步状态了
                    break;
                }
                else {
                    // 选一个可选的进一步状态
                    currentState = maybeStates.pop();
                }
            }
        }
        return false;
    }
    /**
     * 返回从当前状态收到一个字母后能到达的所有其他状态
     * @param state 当前状态
     * @param alpha 字母在字母表的下标
     * @returns `结果状态数组`
     */
    expand(state, alpha) {
        let transforms = this.getTransforms(state), result = [];
        for (let transform of transforms) {
            if (transform.alpha === alpha) {
                result.push(this._states[transform.target]);
            }
        }
        return result;
    }
    /**
     * 把`from`中的每个状态到`to`状态用字母alpha建立边
     * @param alpha 字母在字母表的下标
     */
    link(from, to, alpha) {
        for (let i = 0; i < from.length; i++) {
            let transforms = this.getTransforms(from[i]);
            transforms.push({
                alpha,
                target: this._states.indexOf(to),
            });
            this.setTransforms(from[i], transforms);
        }
    }
    /**
     * 检测该状态是否到达接收状态
     */
    hasReachedAccept(currentState) {
        // 不考虑epsilon边
        return this._acceptStates.indexOf(currentState) !== -1;
    }
}
exports.DFA = DFA;
