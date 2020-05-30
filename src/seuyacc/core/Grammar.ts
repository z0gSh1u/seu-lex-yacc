/* eslint-disable @typescript-eslint/member-delimiter-style */
/**
 * 语法相关定义
 * by Withod
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

export interface Token {
  name: string
  literal: string
}
export const SpToken = {
  END: { name: '[END]', literal: '' },
}

// either tokenName or literal
export interface Operator {
  tokenName?: string
  literal?: string
  assoc: 'left' | 'right' | 'non'
  precedence: number // bigger higher
}

export class YaccParserProducer {
  private _lhs: string
  private _rhs: string[]
  private _actions: string[]
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

/**
 * Single
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
}
