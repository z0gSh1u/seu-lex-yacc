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
     * 利用子集构造法通过一个NFA构造DFA；或者构造一个空DFA
     */
    constructor(nfa) {
        super();
        if (nfa) {
            this.constructFromNFA(nfa);
        }
        else {
            this._startStates = []; // 开始状态
            this._acceptStates = []; // 接收状态
            this._states = []; // 全部状态
            this._alphabet = []; // 字母表
            this._transformAdjList = []; // 状态转移矩阵
        }
    }
    /**
     * 原地最小化当前DFA。如果alphabet包含[any]则不处理
     */
    minimize() {
        // TODO: DFA最小化
        if (this._alphabet.includes('[any]')) {
            return;
        }
        //存放DFA最小化过程中状态划分
        let stateLists = [];
        stateLists.push([]);
        //将原DFA划分成接受状态和非接受状态
        let nonTerminalStates = new Array();
        let copyOfOriginalState = DFA.deepCloneFA(this).states;
        for (let i = 0; i < copyOfOriginalState.length; i++) {
            if (!this.acceptStates.includes(copyOfOriginalState[i])) {
                nonTerminalStates.push(copyOfOriginalState[i]);
            }
        }
        let terminalStates = DFA.deepCloneFA(this).acceptStates;
        stateLists.push(nonTerminalStates);
        stateLists.push(terminalStates);
        //划分nonTerminalStates直到不可划分
        this.splitStateList(stateLists, nonTerminalStates);
        //划分TerminalStates直到不可划分
        let leftMostEndStateIndex = this.splitStateList(stateLists, terminalStates);
        //根据存储状态列表的列表的每一个元素作为一个状态，构造最小化DFA
        this.rebuildDFA(stateLists, leftMostEndStateIndex);
    }
    /**将一个状态列表持续划分为多个列表直到不能再分
     *@param stateLists 存储划分得到的状态列表的列表
       *@param statesToCheck 待划分状态列表
     */
    splitStateList(stateLists, statesToCheck) {
        //console.log(statesToCheck)
        //console.log(stateLists.length)
        //console.log(stateLists)
        let index = (stateLists.length) - 1;
        let statesToRemove = new Array();
        for (let i = 0; i < this.alphabet.length; i++) {
            for (let j = 0; j < statesToCheck.length; j++) {
                let stateIndex = this.states.indexOf(statesToCheck[j]);
                if (stateIndex === -1) {
                    continue;
                }
                //获取状态遇到下标为i的符号时状态跳转情况
                console.log(stateIndex);
                let temp = this.transformAdjList[stateIndex][i];
                let nextState = this.states[temp.target];
                if (!statesToCheck.includes(nextState)) {
                    //经过状态转移达到的状态不包含在状态集statesToCheck中，
                    //nonTerminalStates继续划分为state和去掉state之后的nonTerminalStates
                    stateLists.push([statesToCheck[j]]);
                    statesToRemove.push(statesToCheck[j]);
                    if (index > stateLists.length - 1) {
                        index = stateLists.length - 1;
                    }
                }
            }
        }
        //移除不属于当前划分的状态
        statesToCheck = statesToCheck.filter((x) => !statesToRemove.includes(x));
        return index;
    }
    /**
       * 根据存储状态列表的列表的每一个元素作为一个状态，构造最小化DFA
       * @param stateLists 存储状态列表的列表
       */
    rebuildDFA(stateLists, leftMostEndStateIndex) {
        let copyOfStates = DFA.deepCloneFA(this).states;
        this.states.length = 0;
        let copyOfTransform = DFA.deepCloneFA(this).transformAdjList;
        this.transformAdjList.length = 0;
        //重构状态
        this.rebuildState(stateLists, leftMostEndStateIndex);
        //重构状态转移矩阵
        this.rebuildStateTrans(copyOfStates, copyOfTransform, stateLists);
    }
    /**
       * 重构状态
       * @param stateLists 包含状态列表的列表
       * @param leftMostEndStateIndex 可接受状态中下标最小的状态在stateLists中的下标
       */
    rebuildState(stateLists, leftMostEndStateIndex) {
        //stateLists中的第一个元素中的所有状态构成新的DFA对象的开始状态
        let newStart = new FA_1.State();
        this.startStates.push(newStart);
        this.states.push(newStart);
        //添加既不是开始状态节点，也不是可接受状态节点的状态节点
        for (let i = 1; i < leftMostEndStateIndex; i++) {
            let newState = new FA_1.State();
            this.states.push(newState);
        }
        // stateLists中原来DFA对象的接受状态构成新的DFA对象的接受状态
        for (let i = leftMostEndStateIndex; i < stateLists.length; i++) {
            let newState = new FA_1.State();
            this.acceptStates.push(newState);
            this.states.push(newState);
        }
    }
    /**
       * 为最小化DFA重构状态转移矩阵
       * @param originalStateList 原来DFA的状态列表
       * @param originalStateTrans 原来DFA的状态转移矩阵
       * @param stateists 存储状态列表的列表
       */
    rebuildStateTrans(originalStateList, originalStateTrans, stateLists) {
        for (let i = 0; i < stateLists.length; i++) {
            let stateList = stateLists[i];
            let stateTransform = Array();
            //建立到其它划分中状态的状态转移
            this.buildTansitWithStatesInOtherPartition(originalStateList, originalStateTrans, stateLists, stateList, stateTransform);
            //建立划分内的状态转移(针对划分内某个状态遇到某一符号串不转向下一状态的情况)
            this.buildTransitWithStatesInInnerPartition(originalStateList, originalStateTrans, stateLists, stateList, stateTransform);
            this.transformAdjList.push(stateTransform);
        }
    }
    //建立划分内的状态转移(针对划分内某个状态遇到某一符号串不转向下一状态的情况)
    buildTransitWithStatesInInnerPartition(originalStateList, originalStateTransitMat, stateLists, stateList, stateTransform) {
        for (let i = 0; i < stateList.length; i++) {
            let stateIndex = originalStateList.indexOf(stateList[i]);
            let transitEleRow = originalStateTransitMat[i];
            for (let j = 0; j < transitEleRow.length; j++) {
                if (transitEleRow[j].target == stateIndex) { //在该状态上存在转向自己的循环  
                    //获取在最小化的DFA对象中的下标
                    let currentStateIndex = this.getStateIndexInNewDFA(stateLists, stateList[i]);
                    stateTransform.push({ alpha: transitEleRow[j].alpha, target: currentStateIndex });
                }
            }
        }
    }
    //建立到其它划分中状态的状态转移
    buildTansitWithStatesInOtherPartition(originalStateList, originalStateTransitMat, stateLists, stateList, stateTransform) {
        let stateTransitMatRow = originalStateTransitMat[0];
        // console.log(originalStateIndex)
        for (let i = 0; i < stateTransitMatRow.length; i++) {
            //当前转向的状态
            let currentState = originalStateList[stateTransitMatRow[i].target];
            if (!stateList.includes(currentState)) {
                //不是在同一个划分中，存在到其它划分则状态的状态转移 
                let currentStateIndex = this.getStateIndexInNewDFA(stateLists, currentState);
                stateTransform.push({ alpha: stateTransitMatRow[i].alpha, target: currentStateIndex });
            }
        }
    }
    /**
       * 查找某一状态在最小化DFA中所在划分的下标
       * @param stateLists 状态列表的划分
       * @param state 将要查找的State对象
       * @return 某一状态在最小化DFA中所在划分的下标
       */
    getStateIndexInNewDFA(stateLists, state) {
        for (let i = 0; i < stateLists.length; i++) {
            let currentStateList = stateLists[i];
            if (currentStateList.includes(state)) {
                return i;
            }
        }
        return -1;
    }
    /**
     * 使用子集构造法由NFA构造此DFA
     * @param nfa 子集构造法所使用的NFA
     */
    constructFromNFA(nfa) {
        this._startStates = [];
        this._acceptStates = [];
        this._states = [];
        this._alphabet = [];
        this._transformAdjList = [];
        if (nfa.startStates.length === 0) {
            return;
        }
        // 设置第一个开始状态
        let stateSets = [nfa.epsilonClosure(nfa.startStates)];
        this._alphabet = nfa.alphabet;
        this._startStates = [new FA_1.State()];
        this._acceptStates = [this._startStates[0]];
        this._transformAdjList = [[]];
        if (stateSets[0].some((s) => nfa.acceptStates.includes(s))) {
            this._acceptStates = [this._startStates[0]];
        }
        this._states = [this._startStates[0]];
        // 遍历设置DFA中第i个状态读入第alpha个字母时的转换
        for (let i = 0; i < this._states.length; i++) {
            let anyTargetState = -1; // 由any出边指向的状态
            for (let alpha = 0; alpha < this._alphabet.length; alpha++) {
                let newStateSet = nfa.epsilonClosure(nfa.move(stateSets[i], alpha));
                if (newStateSet.length < 1) {
                    continue;
                }
                let j = 0;
                for (; j < stateSets.length; j++) {
                    if (stateSets[j].every((s) => newStateSet.includes(s)) &&
                        newStateSet.every((s) => stateSets[j].includes(s))) {
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
                    if (newStateSet.some((s) => nfa.acceptStates.includes(s))) {
                        this._acceptStates.push(newState);
                    }
                }
                if (this._alphabet[alpha] == FA_1.getSpAlpha(FA_1.SpAlpha.ANY)) {
                    this._transformAdjList[i].push({ alpha: FA_1.SpAlpha.ANY, target: j });
                    anyTargetState = j;
                }
                else {
                    this._transformAdjList[i].push({ alpha, target: j });
                }
            }
            if (anyTargetState != -1) {
                for (let index = 0; index < this._transformAdjList[i].length; index++) {
                    if (this._transformAdjList[i][index].target == anyTargetState) {
                        this._transformAdjList[i].splice(index--, 1);
                    }
                }
                if (this._transformAdjList[i].length < 1) {
                    this._transformAdjList[i].push({
                        alpha: FA_1.SpAlpha.ANY,
                        target: anyTargetState,
                    });
                }
                else {
                    this._transformAdjList[i].push({
                        alpha: FA_1.SpAlpha.OTHER,
                        target: anyTargetState,
                    });
                }
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
                else if (!this._alphabet.includes(sentence[matchedWordCount]) &&
                    !this._alphabet.includes(FA_1.getSpAlpha(FA_1.SpAlpha.ANY))) {
                    // 字母表不存在该字符，并且该自动机没有any转移
                    // 注：此时matchedWordCount一定小于sentence.length，不用担心越界
                    return false;
                }
                else {
                    // 剩余情况则向外推进，继续搜索
                    let newState = this.expand(currentState, this._alphabet.indexOf(sentence[matchedWordCount]));
                    matchedWordCount += 1;
                    newState &&
                        !maybeStates.includes(newState) &&
                        maybeStates.push(newState);
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
     * 返回从当前状态收到一个字母后能到达的所有状态
     * @param state 当前状态
     * @param alpha 字母在字母表的下标
     * @returns `结果状态`
     */
    expand(state, alpha) {
        let transforms = this.getTransforms(state), otherTarget = -1;
        for (let transform of transforms) {
            if (transform.alpha === alpha ||
                (transform.alpha === FA_1.SpAlpha.ANY && this._alphabet[alpha] !== '\n')) {
                return this._states[transform.target];
            }
            else if (transform.alpha === FA_1.SpAlpha.OTHER) {
                otherTarget = transform.target;
            }
        }
        return otherTarget == -1 ? null : this._states[otherTarget];
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
     * 检测该状态是否为接收状态
     */
    hasReachedAccept(currentState) {
        return this._acceptStates.indexOf(currentState) !== -1;
    }
}
exports.DFA = DFA;
//# sourceMappingURL=DFA.js.map