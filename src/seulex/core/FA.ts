/* eslint-disable @typescript-eslint/member-delimiter-style */

/**
 * FA（有限状态自动机）及状态、转换的声明
 * by z0gSh1u & Twileon
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

/**
 * 自动机状态
 */
export class State {
  private _uuid: symbol // 每个状态给一个全局唯一ID
  constructor(uuid?: symbol) {
    this._uuid = uuid || Symbol()
  }
  // 判断两个状态是不是一样的
  same(another: State) {
    return this._uuid === another._uuid
  }
  static same(one: State, another: State) {
    return one._uuid === another._uuid
  }
}

/**
 * 自动机状态转换
 */
export type Transform = {
  alpha: number // 边上的字母（转换的条件）在this._alphabets中的下标，特殊下标见enum SpAlpha
  target: number // 目标状态在this._states中的下标
}

/**
 * 特殊字符枚举
 */
export enum SpAlpha {
  EPSILON = -1, // ε
  ANY = -2, // . (any character, except \n, not ε)
  OTHER = -3, // other character not mentioned
}

/**
 * 将特殊字符下标转为字符描述
 */
export function getSpAlpha(alpha: number) {
  const table = { '-1': '[ε]', '-2': '[any]', '-3': '[other]' }
  // @ts-ignore
  return table[alpha] || ''
}

/**
 * 有限状态自动机
 */
export class FiniteAutomata {
  protected _alphabet!: string[] // 字母表
  protected _states!: State[] // 全部状态
  protected _startStates!: State[] // 初始状态
  protected _acceptStates!: State[] // 接收状态
  protected _transformAdjList!: Transform[][] // 状态转移邻接链表
  get startStates() {
    return this._startStates
  }
  get acceptStates() {
    return this._acceptStates
  }
  get states() {
    return this._states
  }
  get alphabet() {
    return this._alphabet
  }
  get transformAdjList() {
    return this._transformAdjList
  }

  /**
   * 获得从该状态出发的所有一步转移（不自动扩展）
   * @param state 出发状态
   * @param spAlpha 如果定义，则只考虑该列表中的字母的转移
   */
  protected getTransforms(state: State, spAlpha?: number[]) {
    let res = this._transformAdjList[this._states.indexOf(state)]
    if (spAlpha) return res.filter((v) => spAlpha.includes(v.alpha))
    else return res
  }

  /**
   * 设置从该状态出发的所有一步转移
   */

  protected setTransforms(state: State, transfroms: Transform[]) {
    this._transformAdjList[this._states.indexOf(state)] = transfroms
  }

  /**
   * 深拷贝FA，State的Symbol生成新的，与原FA互不影响）
   */
  static copy(fa: FiniteAutomata) {
    let res = new FiniteAutomata()
    res._states = []
    res._startStates = []
    res._acceptStates = []
    for (let i = 0; i < fa._states.length; i++) {
      if (fa._startStates.includes(fa._states[i])) {
        let newState = new State()
        res._startStates.push(newState)
        res._states[i] = newState
      } else if (fa._acceptStates.includes(fa._states[i])) {
        let newState = new State()
        res._acceptStates.push(newState)
        res._states[i] = newState
      } else {
        res._states[i] = new State()
      }
    }
    res._alphabet = [...fa._alphabet]
    res._transformAdjList = JSON.parse(JSON.stringify(fa._transformAdjList))
    return res
  }
}
