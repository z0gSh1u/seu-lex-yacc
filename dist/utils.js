"use strict";
/**
 * 工具函数
 * by z0gSh1u, Withod
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ASCII打印字符范围
exports.ASCII_MIN = 32;
exports.ASCII_MAX = 126;
// lex支持的转义
exports.SUPPORTED_ESCAPE = `dstrn\\[]*?+()|".`;
// ========= lex用到的正则 =========
// 在非转义引号之间内容，$0为带引号匹配结果
exports.PATTERN_INSIDEQUOTE_NOTSLASH = /(?=[^\\]|^)(\"[^\"]*[^\\]\")/g;
// 非转义[]定义的的range，$0为带大括号匹配结果
exports.PATTERN_RANGE_NOTSLASH = /(?=[^\\]|^)\[(([^\[\]]+)[^\\])\]/g;
// ========= yacc用到的正则 =========
exports.PATTERN_BLOCK_PRODUCER = /(\w+)\s*\n\s+:(\s+(.+?)({[\s\S]*?})?\n)(\s+\|\s+(.+?)({[\s\S]*?})?\n)*\s+;/g;
// $1为LHS，$3为首个RHS，$4为动作代码（带大括号）
exports.PATTERN_INITIAL_PRODUCER = /(\w+)\n\s+:(\s+(.+?)({[\s\S]*?})?\n)/g;
// $2为RHS，$3为动作代码（带大括号）
exports.PATTERN_CONTINUED_PRODUCER = /(\s+\|\s+(.+?)({[\s\S]*?})?\n)/g;
// 末尾匹配
exports.PATTERN_ENDOF_PRODUCER = /\s+;/g;
// 转义抠除
exports.ESCAPE_REVERSE = {
    '\\n': '\n',
    '\\t': '\t',
    '\\r': '\r',
    '\\(': '(',
    '\\)': ')',
    '\\[': '[',
    '\\]': ']',
    '\\+': '+',
    '\\-': '-',
    '\\*': '*',
    '\\?': '?',
    '\\"': '"',
    '\\.': '.',
    "\\'": "'",
    '\\|': '|',
    '\\\\': '\\',
};
// 转义添加
exports.ESCAPE_CONVERT = (function () {
    let ret = {};
    const keys = Object.keys(exports.ESCAPE_REVERSE);
    const vals = Object.values(exports.ESCAPE_REVERSE);
    for (let i in vals)
        ret[vals[i]] = keys[i];
    return ret;
})();
// 去除转义斜杠，相当于String.raw的逆方法
function cookString(str) {
    let ret = '';
    let bslash = false;
    str.split('').forEach(c => {
        if (bslash) {
            let char = '\\' + c;
            ret += exports.ESCAPE_REVERSE.hasOwnProperty(char) ? exports.ESCAPE_REVERSE[char] : char;
            bslash = false;
        }
        else if (c == '\\')
            bslash = true;
        else
            ret += c;
    });
    return ret;
}
exports.cookString = cookString;
/**
 * Ensure `condition`. Else throw Error `hint`.
 */
function assert(condition, hint) {
    if (!condition) {
        throw new Error(hint);
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
 * Return true if target is in some range of `ranges` (closed).
 * @param ranges [l, r][]
 */
function inRange(ranges, target) {
    return ranges.some(range => target >= range[0] && target <= range[1]);
}
exports.inRange = inRange;
/**
 * Return all ranges (closed) of matches.
 * @param regex a RegExp with note `g`
 */
function getMatchedRanges(regex, str, resultGroup = 0) {
    let result, ranges = [];
    while ((result = regex.exec(str)) != null) {
        result = result;
        ranges.push([result.index, result.index + result[resultGroup].length - 1]);
    }
    return ranges;
}
exports.getMatchedRanges = getMatchedRanges;
/**
 * Split a string using any delim (1 character) in delims.
 * Return split array with delim remained.
 */
function splitAndKeep(str, delims) {
    let res = [], part = '';
    for (let i = 0; i < str.length; i++) {
        if (inStr(str[i], delims)) {
            !!part && res.push(part);
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
