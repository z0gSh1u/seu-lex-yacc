/**
 * 产生式类
 */
export class Producer {
  private _lhs: number
  private _rhs: number[]
  constructor(lhs: number, rhs: number[]) {
    this._lhs = lhs
    this._rhs = [...rhs]
  }
  get lhs() {
    return this._lhs
  }
  get rhs() {
    return this._rhs
  }
}