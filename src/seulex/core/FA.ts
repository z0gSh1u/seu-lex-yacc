/* eslint-disable @typescript-eslint/member-delimiter-style */

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
  alpha: number // 边上的字母（转换的条件）在this._alphabets中的下标。用-1表示epsilon转换
  target: number // 目标状态在this._states中的下标
}

/**
 * 有限状态自动机
 */
export class FiniteAutomata {
  protected _alphabet!: string[] // 字母表
  protected _states!: State[] // 全部状态
  protected _startStates!: State[] // 初始状态
  protected _acceptStates!: State[] // 接收状态
  protected _transformMatrix!: Transform[][] // 状态转移邻接链表
  /**
   * 获得从该状态出发的所有一步转移
   * @param state 出发状态
   * @param epsilonOnly 是否只考虑epsilon转移，默认false
   */
  protected getTransforms(state: State, epsilonOnly = false) {
    let res = this._transformMatrix[this._states.indexOf(state)]
    if (epsilonOnly) return res.filter((v) => v.alpha === -1)
    else return res
  }
  protected setTransforms(state: State, transfroms: Transform[]) {
    this._transformMatrix[this._states.indexOf(state)] = transfroms
  }
}
