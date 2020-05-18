/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * DFA（确定有限状态自动机）
 * by Withod, Twileon & z0gSh1u
 * 2020-05 @ https://github.com/Withod/seu-lex-yacc
 */

import { FiniteAutomata, State, SpAlpha, getSpAlpha } from './FA'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NFA } from './NFA'

/**
 * 确定有限状态自动机
 */
export class DFA extends FiniteAutomata {
  private _acceptActionMap: Map<State, string>

  /**
   * 利用子集构造法通过一个NFA构造DFA；或者构造一个空DFA
   */
  constructor() {
    super()
    this._startStates = [] // 开始状态
    this._acceptStates = [] // 接收状态
    this._states = [] // 全部状态
    this._alphabet = [] // 字母表
    this._transformAdjList = [] // 状态转移矩阵
    this._acceptActionMap = new Map() // 接收态对应的动作
  }

  get acceptActionMap() {
    return this._acceptActionMap
  }

  /**
   * 原地最小化当前DFA。如果alphabet包含[any]则不处理
   * 龙书 算法3.39
   */
  minimize() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let that = this
    // 暂不考虑有any的情况（即有other）下的最小化，过于复杂
    if (this._alphabet.includes('[any]')) return
    // TODO:
  }

  /**
   * 使用子集构造法由NFA构造此DFA
   * @param nfa 子集构造法所使用的NFA
   */
  static fromNFA(nfa: NFA) {
    let res = new DFA()
    if (nfa.startStates.length === 0) return res
    // 设置第一个开始状态
    let stateSets: State[][] = [nfa.epsilonClosure(nfa.startStates)]
    res._alphabet = nfa.alphabet
    res._startStates = [new State()]
    res._acceptStates = [res._startStates[0]]
    res._transformAdjList = [[]]
    if (stateSets[0].some((s) => nfa.acceptStates.includes(s)))
      res._acceptStates = [res._startStates[0]]
    res._states = [res._startStates[0]]
    // 遍历设置DFA中第i个状态读入第alpha个字母时的转换
    for (let i = 0; i < res._states.length; i++) {
      let anyTargetState = -1 // 由any出边指向的状态
      for (let alpha = 0; alpha < res._alphabet.length; alpha++) {
        let newStateSet = nfa.epsilonClosure(nfa.move(stateSets[i], alpha))
        if (newStateSet.length < 1) continue
        let j = 0
        for (; j < stateSets.length; j++) {
          if (
            stateSets[j].every((s) => newStateSet.includes(s)) &&
            newStateSet.every((s) => stateSets[j].includes(s))
          )
            break // 与已有的状态集合相同
        }
        if (j == stateSets.length) {
          // 与已有的状态集合均不相同，因此新建一个状态
          stateSets.push(newStateSet)
          let newState = new State()
          res._states.push(newState)
          res._transformAdjList.push([])
          if (newStateSet.some((s) => nfa.acceptStates.includes(s)))
            res._acceptStates.push(newState)
        }
        if (res._alphabet[alpha] == getSpAlpha(SpAlpha.ANY)) {
          res._transformAdjList[i].push({ alpha: SpAlpha.ANY, target: j })
          anyTargetState = j
        } else {
          res._transformAdjList[i].push({ alpha, target: j })
        }
      }
      if (anyTargetState != -1) {
        for (let index = 0; index < res._transformAdjList[i].length; index++) {
          if (res._transformAdjList[i][index].target == anyTargetState)
            res._transformAdjList[i].splice(index--, 1)
        }
        if (res._transformAdjList[i].length < 1)
          res._transformAdjList[i].push({
            alpha: SpAlpha.ANY,
            target: anyTargetState,
          })
        else
          res._transformAdjList[i].push({
            alpha: SpAlpha.OTHER,
            target: anyTargetState,
          })
      }
    }
    return res
  }

  /**
   * 尝试用DFA识别字符串
   * @param str 待识别字符串
   */
  test(str: string) {
    let sentence = str.split('')
    // 试验每一个开始状态
    for (let startState of this._startStates) {
      let currentState = startState, // 本轮深搜当前状态
        matchedWordCount = 0, // 符合的字符数
        candidates: State[] = [] // DFS辅助数组，记录历史状态
      while (matchedWordCount <= sentence.length) {
        if (
          // 目前匹配了全句
          matchedWordCount === sentence.length &&
          // 并且目前已经到达接收态
          this.hasReachedAccept(currentState)
        ) {
          return true
        } else if (matchedWordCount === sentence.length) {
          // 全部匹配完成但是未到达接收态，说明应换一个开始状态再次试验
          break
        } else if (
          !this._alphabet.includes(sentence[matchedWordCount]) &&
          !this._alphabet.includes(getSpAlpha(SpAlpha.ANY))
        ) {
          // 字母表不存在该字符，并且该自动机没有any转移
          // 注：此时matchedWordCount一定小于sentence.length，不用担心越界
          return false
        } else {
          // 剩余情况则向外推进，继续搜索
          let newState = this.expand(
            currentState,
            this._alphabet.indexOf(sentence[matchedWordCount])
          )
          matchedWordCount += 1
          newState &&
            !candidates.includes(newState) &&
            candidates.push(newState)
        }
        if (!candidates.length) {
          break // 没有可选的进一步状态了
        } else {
          currentState = candidates.pop() as State // 选一个可选的进一步状态
        }
      }
    }
    return false
  }

  /**
   * 返回从当前状态收到一个字母后能到达的所有状态
   * @param state 当前状态
   * @param alpha 字母在字母表的下标
   * @returns `结果状态`
   */
  expand(state: State, alpha: number) {
    let transforms = this.getTransforms(state),
      otherTarget = -1
    for (let transform of transforms) {
      if (
        transform.alpha === alpha ||
        (transform.alpha === SpAlpha.ANY && this._alphabet[alpha] !== '\n')
      ) {
        return this._states[transform.target]
      } else if (transform.alpha === SpAlpha.OTHER) {
        otherTarget = transform.target
      }
    }
    return otherTarget == -1 ? null : this._states[otherTarget]
  }

  /**
   * 把`from`中的每个状态到`to`状态用字母alpha建立边
   * @param alpha 字母在字母表的下标
   */
  link(from: State[], to: State, alpha: number) {
    for (let i = 0; i < from.length; i++) {
      let transforms = this.getTransforms(from[i])
      transforms.push({
        alpha,
        target: this._states.indexOf(to),
      })
      this.setTransforms(from[i], transforms)
    }
  }

  /**
   * 检测该状态是否为接收状态
   */
  hasReachedAccept(currentState: State) {
    return this._acceptStates.indexOf(currentState) !== -1
  }
}
