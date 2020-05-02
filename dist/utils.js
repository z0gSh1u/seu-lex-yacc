"use strict";
// 工具函数
// by z0gSh1u @ 2020-05
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
/**
 * Print directly to stdout.
 */
function stdoutPrint(content) {
    process.stdout.write(content);
}
exports.stdoutPrint = stdoutPrint;
/**
 * Return true if ch can be found in str.
 */
function inStr(ch, str) {
    return str.indexOf(ch) !== -1;
}
exports.inStr = inStr;
/**
 * Split a string using any delim in delims.
 * Return split array with delim remained.
 */
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
/**
 * Return true if ch is an English character.
 */
function isAlpha(ch) {
    return ch.length === 1 && !!ch.match(/[A-Za-z]/);
}
exports.isAlpha = isAlpha;
