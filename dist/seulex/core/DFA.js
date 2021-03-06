"use strict";
/* eslint-disable @typescript-eslint/no-use-before-define */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * DFA（确定有限状态自动机）
 * by Withod, Twileon & z0gSh1u
 * 2020-05 @ https://github.com/Withod/seu-lex-yacc
 */
const FA_1 = require("./FA");
/**
 * 确定有限状态自动机
 */
class DFA extends FA_1.FiniteAutomata {
    /**
     * 利用子集构造法通过一个NFA构造DFA；或者构造一个空DFA
     */
    constructor() {
        super();
        this._startStates = []; // 开始状态
        this._acceptStates = []; // 接收状态
        this._states = []; // 全部状态
        this._alphabet = []; // 字母表
        this._transformAdjList = []; // 状态转移矩阵
        this._acceptActionMap = new Map(); // 接收态对应的动作
    }
    get acceptActionMap() {
        return this._acceptActionMap;
    }
    /**
     * 原地最小化当前DFA。如果alphabet包含[any]则不处理
     * 龙书 算法3.39
     * // FIXME：有BUG
     */
    minimize() {
        // 暂不考虑有any的情况（即有other）下的最小化，过于复杂
        if (this._alphabet.includes('[any]'))
            return;
        let stateLists = []; //首先建造包含两个组的初始划分
        let terminalStates = [...this.acceptStates]; //接受状态组，直接拆好装进去
        for (let i = 0; i < terminalStates.length; i++) {
            stateLists.push([terminalStates[i]]);
        }
        let nonTerminalStates = []; //非接受状态组
        let copyOfOriginalState = [...this._states];
        for (let i = 0; i < copyOfOriginalState.length; i++) {
            if (!this.acceptStates.includes(copyOfOriginalState[i]))
                nonTerminalStates.push(copyOfOriginalState[i]);
        }
        if (nonTerminalStates.length != 0) {
            stateLists.push(nonTerminalStates);
        }
        let flag = true;
        let newStateLists = []; //存放已经完成划分状态集的暂用容器
        while (flag) {
            //一次拆一个
            flag = false;
            let newSet = []; //装被拆出去状态的容器
            for (let k = 0; k < stateLists.length; k++) {
                //找一个要拆的，外层循环是statelists当中每一个state[]
                let s = stateLists[k];
                let reals = s; //为了保证循环顺利进行，我们用reals复制s，拆reals不会影响s的循环
                if (s.length <= 1) {
                    newStateLists.push(s);
                    stateLists.splice(k, 1);
                    flag = true;
                    break;
                } //单个状态无法拆,直接提出来
                else {
                    //这里剩下的都是至少包含两个状态的数组
                    for (let i = 1; i < s.length; i++) {
                        //中层循环是当前选中的这个state[]中每一个state
                        let standard = s[0]; //把每个数组的第一个状态作为参照
                        let tr1 = this.getTransforms(standard);
                        let tr2 = this.getTransforms(s[i]);
                        if (!this.sameTransform(tr1, tr2)) {
                            //经过状态转移达到的状态不在同一组,则拿出来放到容器里
                            newSet.push(s[i]);
                            reals.splice(i, 1);
                            flag = true;
                        }
                    }
                    //至此这个state[]已经拆完了，我们把确定在一组的reals提出来，把装着所有拆出来状态的数组回炉重造
                    stateLists.splice(k, 1);
                    newStateLists.push(reals);
                    if (newSet.length > 0)
                        stateLists.push(newSet);
                    break;
                }
            }
        }
        for (let i = 0; i < newStateLists.length; i++) {
            stateLists.push(newStateLists[i]);
        }
        //写到这里，状态已经全拆完了，就差一个重构DFA工作了
        let reducedStates = [];
        let oldNewMap = new Map(); //新旧状态映射表
        for (let i = 0; i < stateLists.length; i++) {
            //把需要删除的状态找出来
            for (let j = 0; j < stateLists[i].length; j++) {
                if (stateLists[i].length == 1) {
                    oldNewMap.set(this.states.indexOf(stateLists[i][j]), i);
                }
                else {
                    if (j > 0) {
                        reducedStates.push(this.states.indexOf(stateLists[i][j]));
                    }
                    let indexOld = this.states.indexOf(stateLists[i][j]);
                    oldNewMap.set(indexOld, i); //新旧状态映射表
                }
            }
        }
        let newStates = this.states.filter(x => !reducedStates.includes(this.states.indexOf(x))); //删掉多余状态
        let newTrans = this.transformAdjList.filter(x => !reducedStates.includes(this.transformAdjList.indexOf(x))); //删掉转移矩阵中多余状态对应的行
        for (let i = 0; i < newTrans.length; i++) {
            //将转移矩阵中所有target为旧状态的更新
            for (let j = 0; j < newTrans[i].length; j++) {
                let temp = newTrans[i][j].target;
                newTrans[i][j].target = oldNewMap.get(temp);
            }
        }
        this._states = newStates;
        this._transformAdjList = newTrans;
    }
    sameTransform(tr1, tr2) {
        return (tr1.every(i1 => tr2.some(i2 => i1.alpha == i2.alpha && i1.target == i2.target)) &&
            tr2.every(i1 => tr1.some(i2 => i1.alpha == i2.alpha && i1.target == i2.target)));
    }
    /**
     * 使用子集构造法由NFA构造此DFA
     * @param nfa 子集构造法所使用的NFA
     */
    static fromNFA(nfa) {
        let res = new DFA();
        if (nfa.startStates.length === 0)
            return res;
        // 设置第一个开始状态
        let stateSets = [nfa.epsilonClosure(nfa.startStates)];
        res._alphabet = nfa.alphabet;
        res._startStates = [new FA_1.State()];
        res._transformAdjList = [[]];
        stateSets[0].forEach(s => {
            if (nfa.acceptStates.includes(s)) {
                let action = res._acceptActionMap.get(res._startStates[0]);
                let compare = nfa.acceptActionMap.get(s);
                if (action && action.code !== compare.code) {
                    if (action.order > compare.order) {
                        // 优先级不足，替换
                        res._acceptActionMap.set(res._startStates[0], compare);
                    }
                }
                else if (!action) {
                    // 没有重复
                    res._acceptStates = [res._startStates[0]];
                    res._acceptActionMap.set(res._startStates[0], nfa.acceptActionMap.get(s));
                }
            }
        });
        res._states = [res._startStates[0]];
        // 遍历设置DFA中第i个状态读入第alpha个字母时的转换
        for (let i = 0; i < res._states.length; i++) {
            let anyTargetState = -1; // 由any出边指向的状态
            for (let alpha = 0; alpha < res._alphabet.length; alpha++) {
                let newStateSet = nfa.epsilonClosure(nfa.move(stateSets[i], alpha));
                if (newStateSet.length < 1)
                    continue;
                let j = 0;
                for (; j < stateSets.length; j++) {
                    if (stateSets[j].every(s => newStateSet.includes(s)) &&
                        newStateSet.every(s => stateSets[j].includes(s)))
                        break; // 与已有的状态集合相同
                }
                if (j == stateSets.length) {
                    // 与已有的状态集合均不相同，因此新建一个状态
                    stateSets.push(newStateSet);
                    let newState = new FA_1.State();
                    res._states.push(newState);
                    res._transformAdjList.push([]);
                    newStateSet.forEach(s => {
                        if (nfa.acceptStates.includes(s)) {
                            let action = res._acceptActionMap.get(newState);
                            let compare = nfa.acceptActionMap.get(s);
                            if (action && action.code !== compare.code) {
                                if (action.order > compare.order) {
                                    // 优先级不足，替换
                                    res._acceptActionMap.set(newState, compare);
                                }
                            }
                            else if (!action) {
                                res._acceptStates.push(newState);
                                res._acceptActionMap.set(newState, compare);
                            }
                        }
                    });
                }
                if (res._alphabet[alpha] == FA_1.getSpAlpha(FA_1.SpAlpha.ANY)) {
                    res._transformAdjList[i].push({ alpha: FA_1.SpAlpha.ANY, target: j });
                    anyTargetState = j;
                }
                else {
                    res._transformAdjList[i].push({ alpha, target: j });
                }
            }
            if (anyTargetState != -1) {
                for (let index = 0; index < res._transformAdjList[i].length; index++) {
                    if (res._transformAdjList[i][index].target == anyTargetState)
                        res._transformAdjList[i].splice(index--, 1);
                }
                if (res._transformAdjList[i].length < 1)
                    res._transformAdjList[i].push({
                        alpha: FA_1.SpAlpha.ANY,
                        target: anyTargetState,
                    });
                else
                    res._transformAdjList[i].push({
                        alpha: FA_1.SpAlpha.OTHER,
                        target: anyTargetState,
                    });
            }
        }
        return res;
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
            candidates = []; // DFS辅助数组，记录历史状态
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
                    newState && !candidates.includes(newState) && candidates.push(newState);
                }
                if (!candidates.length) {
                    break; // 没有可选的进一步状态了
                }
                else {
                    currentState = candidates.pop(); // 选一个可选的进一步状态
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
