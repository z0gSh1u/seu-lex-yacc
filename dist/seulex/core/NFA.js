"use strict";
/**
 * NFA（非确定有限状态自动机）
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
Object.defineProperty(exports, "__esModule", { value: true });
const FA_1 = require("./FA");
const utils_1 = require("../../utils");
/**
 * 非确定有限状态自动机
 */
class NFA extends FA_1.FiniteAutomata {
    /**
     * 构造一个形如`->0 --a--> [1]`的原子NFA（两个状态，之间用初始字母连接）
     */
    constructor(initAlpha) {
        super();
        this._startStates = initAlpha ? [new FA_1.State()] : []; // 开始状态
        this._acceptStates = initAlpha ? [new FA_1.State()] : []; // 接收状态
        this._states = [...this._startStates, ...this._acceptStates]; // 全部状态
        this._alphabet = initAlpha ? [initAlpha] : []; // 字母表
        this._transformAdjList = initAlpha // 状态转移矩阵
            ? [[{ alpha: 0, target: 1 }], []] // []表示接收态没有出边
            : [];
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
                    let { result, notEpsilon } = this.expand(currentState, this._alphabet.indexOf(sentence[matchedWordCount]));
                    // TODO: epsilon下是否增加matchedWordCount？
                    if (notEpsilon) {
                        matchedWordCount += 1;
                    }
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
     * 返回从当前状态收到一个字母后能到达的所有其他状态（考虑了epsilon边）
     * @param state 当前状态
     * @param alpha 字母在字母表的下标
     * @returns `{结果状态数组, 是否消耗字母}`
     */
    expand(state, alpha) {
        let transforms = this.getTransforms(state), result = [], notEpsilon = false;
        for (let transfrom of transforms) {
            if (transfrom.alpha === alpha) {
                result.push(this._states[transfrom.target]);
                notEpsilon = true;
            }
            else if (transfrom.alpha === -1 /* epsilon */) {
                result.push(this._states[transfrom.target]);
            }
        }
        return { result, notEpsilon };
    }
    /**
     * 将当前NFA做Kleene闭包（星闭包），见龙书3.7.1节图3-34
     *
     * ```
     *      ________________ε_______________
     *     |                                ↓
     * 新开始 -ε-> 旧开始 --...--> 旧接收 -ε-> 新接收
     *              ↑_____________|
     * ```
     */
    kleene() {
        // new_start --epsilon--> old_start
        let oldStartStates = this._startStates, newStartState = new FA_1.State();
        this._startStates = [newStartState];
        this._states.push(newStartState);
        this._transformAdjList.push([]);
        this.linkEpsilon(this._startStates, oldStartStates);
        // old_accept --epsilon--> new_accept
        let oldAcceptStates = this._acceptStates, newAcceptState = new FA_1.State();
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
        this.link(from, to, -1);
    }
    /**
     * 检测该状态是否到达接收状态（考虑了借助epsilon边）
     */
    hasReachedAccept(currentState) {
        // 不考虑epsilon边
        if (this._acceptStates.indexOf(currentState) !== -1) {
            return true;
        }
        // 考虑epsilon边，尝试向外扩展
        let stack = [currentState]; // 深搜辅助栈
        while (!!stack.length) {
            for (let transform of this.getTransforms(stack.pop(), true)) {
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
     * 就地合并`from`的状态转移表到`to`的。请保证先合并状态和字母表。
     */
    static mergeTranformAdjList(from, to) {
        let transformMatrixResult = to._transformAdjList;
        for (let i = 0; i < from._transformAdjList.length; i++) {
            let transforms = from._transformAdjList[i], transformsResult = [];
            // 重构from中的所有转移
            for (let transform of transforms) {
                let indexOfAlphaInRes = transform.alpha === -1
                    ? -1
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
     * 串联两个NFA（连接符点号.）
     * ```
     * NFA1 --epsilon--> NFA2
     * ```
     */
    static serial(nfa1, nfa2) {
        let res = new NFA();
        // 处理开始状态、接收状态、状态、字母表
        res._startStates = nfa1._startStates;
        res._acceptStates = nfa2._acceptStates;
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
        //
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
        let parts = utils_1.splitAndKeep(regex.postFix, '().|* '); // 分离特殊符号
        let stack = [], oprand1, oprand2;
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i].trim();
            if (part.length === 0) {
                // 空格跳过
                continue;
            }
            switch (part[0]) {
                case '|':
                    ;
                    [oprand1, oprand2] = [stack.pop(), stack.pop()];
                    stack.push(NFA.parallel(oprand2, oprand1));
                    break;
                case '.': // 连接符
                    ;
                    [oprand1, oprand2] = [stack.pop(), stack.pop()];
                    stack.push(NFA.serial(oprand2, oprand1));
                    break;
                case '*':
                    stack[stack.length - 1].kleene();
                    break;
                default:
                    stack.push(new NFA(part[0]));
                    break;
            }
        }
        utils_1.assert(stack.length === 1, 'Stack too big after NFA construction.');
        return stack.pop();
    }
}
exports.NFA = NFA;
