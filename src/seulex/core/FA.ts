/* eslint-disable @typescript-eslint/member-delimiter-style */

/**
 * FA（有限状态自动机）及状态、转换的声明
 * by z0gSh1u
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
  ANY = -2, // . (any character)
}

/**
 * 将特殊字符下标转为字符描述
 */
export function getSpAlpha(alpha: number) {
  switch (alpha) {
    case -1:
      return 'ε'
    case -2:
      return '[any]'
  }
  return ''
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
   * 获得从该状态出发的所有一步转移
   * @param state 出发状态
   * @param epsilonOnly 是否只考虑epsilon转移，默认false
   */
  protected getTransforms(state: State, epsilonOnly = false) {
    let res = this._transformAdjList[this._states.indexOf(state)]
    if (epsilonOnly) return res.filter((v) => v.alpha === -1)
    else return res
  }
  /**
   * 设置从该状态出发的所有一步转移
   */
  protected setTransforms(state: State, transfroms: Transform[]) {
    this._transformAdjList[this._states.indexOf(state)] = transfroms
  }
}
