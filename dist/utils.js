"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Ensure `condition`. Else throw `hint`.
 */
function assert(condition, hint) {
    if (!condition) {
        throw hint;
    }
}
exports.assert = assert;
