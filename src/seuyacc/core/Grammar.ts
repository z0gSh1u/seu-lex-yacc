/* eslint-disable @typescript-eslint/member-delimiter-style */

import { GrammarSymbol } from './LR1'

/**
 * 语法相关定义
 * by Withod, z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

/**
 * 特殊Symnpl
 */
export const SpSymbol = {
  END: { type: 'sptoken', content: '[END]' } as GrammarSymbol,
  EPSILON: { type: 'sptoken', content: '[EPSILON]' } as GrammarSymbol,
}

// ===================== YaccParser相关 =====================

/**
 * YaccParser在头部读出的运算符，tokenName或literal填一项
 * @example %left '+' ADD_OP
 */
export interface YaccParserOperator {
  tokenName?: string
  literal?: string
  assoc: 'left' | 'right' | 'non'
  precedence: number // bigger higher
}

/**
 * YaccParser读出的产生式
 */
export class YaccParserProducer {
  private _lhs: string
  private _rhs: string[]
  private _actions: string[] // 与rhs一一对应
  get lhs() {
    return this._lhs
  }
  get rhs() {
    return this._rhs
  }
  get actions() {
    return this._actions
  }
  constructor(lhs: string, rhs: string[], actions: string[]) {
    this._lhs = lhs
    this._rhs = [...rhs]
    this._actions = [...actions]
  }
}

// ===================== LR1相关 =====================

/**
 *              LR1DFA
 *  LR1ItemSet
 *  _________
 * |         |
 * | LR1Item |
 * | LR1Item | -----> ...
 * | ...     |
 * |_________|
 */

/**
 * LR1单条产生式
 * lhs->rhs {action}
 */
export class LR1Producer {
  private _lhs: number
  private _rhs: number[]
  private _action: string
  constructor(lhs: number, rhs: number[], action = '') {
    this._lhs = lhs
    this._rhs = [...rhs]
    this._action = action
  }
  get lhs() {
    return this._lhs
  }
  get rhs() {
    return this._rhs
  }
  get action() {
    return this._action
  }
}

/**
 * LR1项目
 * A->a, $就是一条项目
 * 将多个终结符的，拆分成不同的项目，每个项目只有一个终结符
 */
export class LR1Item {
  private _producer: LR1Producer
  private _dotPosition: number // producer.rhs的点号位置，规定0号位为最左（所有符号之前）位置
  private _lookahead: number // 展望符（非终结符）
  get producer() {
    return this._producer
  }
  get dotPosition() {
    return this._dotPosition
  }
  get lookahead() {
    return this._lookahead
  }
  constructor(producer: LR1Producer, lookahead: number, dotPosition = 0) {
    this._producer = producer
    this._lookahead = lookahead
    this._dotPosition = dotPosition
  }
  /**
   * 检测点号是否到达尾部
   */
  dotAtLast() {
    return this._dotPosition === this._producer.rhs.length
  }
  /**
   * 向后挪动点号
   */
  dotGo() {
    this._dotPosition += 1
  }
  static copy(item: LR1Item, go = false) {
    return new LR1Item(item._producer, item._lookahead, item._dotPosition + (go ? 1 : 0))
  }
  static sameItem(i1: LR1Item, i2: LR1Item) {
    return (
      i1._dotPosition === i2._dotPosition &&
      i1._lookahead === i2._lookahead &&
      i1._producer.lhs === i2._producer.lhs &&
      JSON.stringify(i1._producer.rhs) === JSON.stringify(i2._producer.rhs)
    )
  }
}

/**
 * LR1项目集（LR1自动机状态）
 */
export class LR1State {
  private _items: LR1Item[]
  constructor(items: LR1Item[]) {
    this._items = [...items]
  }
  get items() {
    return this._items
  }
  addItem(item: LR1Item) {
    this._items.push(item)
  }
  static copy(state: LR1State) {
    return new LR1State(state._items.map(x => LR1Item.copy(x)))
  }
  static sameState(s1: LR1State, s2: LR1State) {
    return s1._items.every(x => s2._items.some(y => LR1Item.sameItem(x, y)))
  }
}

/**
 * LR1项目集族（LR1自动机）
 */
export class LR1DFA {
  private _startStateId: number
  private _states: LR1State[]
  private _adjList: { to: number; alpha: number }[][]
  addState(state: LR1State) {
    this._states.push(state)
    this._adjList.push([])
  }
  link(from: number, to: number, alpha: number) {
    this._adjList[from].push({ to, alpha })
  }
  get startStateId() {
    return this._startStateId
  }
  get states() {
    return this._states
  }
  get adjList() {
    return this._adjList
  }
  constructor(startStateId: number) {
    this._startStateId = startStateId
    this._states = []
    this._adjList = []
  }
}
