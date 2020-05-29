/* eslint-disable @typescript-eslint/member-delimiter-style */
/**
 * 语法相关定义
 * by Withod
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

/**
 * 文法符号类型枚举
 */
export enum SymbolType {
  NONTERMINAL = 0, // 非终结符
  OPERATOR = 1, // 运算符
  TOKEN = 2, // token
  OTHER = 3, // 其他字符
}

/**
  * 产生式中文法符号的表示
  */
export type GrammarSymbol = {
  type: SymbolType // 符号的类型
  index: number // 符号在对应类型数组中的下标
}

/**
 * 产生式类
 */
export class Producer {
  private _lhs: GrammarSymbol
  private _rhs: GrammarSymbol[]
  private _action: string
  constructor(lhs: GrammarSymbol, rhs: GrammarSymbol[], action: string) {
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

