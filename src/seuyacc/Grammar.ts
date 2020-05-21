/**
 * 语法相关定义
 * by Withod
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

/**
 * 产生式类
 */
export class Producer {
  private _lhs: string
  private _rhs: string[]
  private _action: string
  constructor(lhs: string, rhs: string[], action: string) {
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
 * 操作符类
 */
export class Operator {
  private _name: string
  private _isRight: boolean // 运算符是否为右结合，false表示为左结合
  constructor(name: string, isRight: boolean) {
    this._name = name
    this._isRight = isRight
  }
  get name() {
    return this._name
  }
  get isRight() {
    return this._isRight
  }
}
