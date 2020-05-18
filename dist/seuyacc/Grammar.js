"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 产生式类
 */
class Producer {
    constructor(lhs, rhs) {
        this._lhs = lhs;
        this._rhs = [...rhs];
    }
    get lhs() {
        return this._lhs;
    }
    get rhs() {
        return this._rhs;
    }
}
exports.Producer = Producer;
