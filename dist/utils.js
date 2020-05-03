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
function stdoutPrint(content) {
    process.stdout.write(content);
}
exports.stdoutPrint = stdoutPrint;
function inStr(ch, str) {
    return str.indexOf(ch) !== -1;
}
exports.inStr = inStr;
function splitAndKeep(str, delims) {
    let res = [], part = '';
    for (let i = 0; i < str.length; i++) {
        if (inStr(str[i], delims)) {
            part.length !== 0 && res.push(part);
            part = '';
            res.push(str[i]);
        }
        else {
            part += str[i];
        }
    }
    part.length !== 0 && res.push(part);
    return res;
}
exports.splitAndKeep = splitAndKeep;
