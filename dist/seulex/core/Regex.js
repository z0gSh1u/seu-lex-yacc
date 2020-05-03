"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
/**
 * 正则表达式类
 */
class Regex {
    constructor(regex) {
        this._raw = regex;
    }
    /**
     * 加点处理
     * 恢复省略的连接符号，如abc本应为a.b.c
     * https://www.icourse163.org/learn/SEU-1003566002#/learn/content?type=detail&id=1214746334
     */
    _addDots() {
        // TODO: 加点会不会与代表任意字符的.号冲突？
        let res = this._raw[0];
        for (let i = 1; i < this._raw.length; i++) {
            let curCh = this._raw[i], prevCh = this._raw[i - 1], nextCh = i < this._raw.length - 2 ? this._raw[i + 1] : null;
            let shouldNotAddDot = curCh === '\\' || // 当前字符为定义的转义字符
                (utils_1.inStr(curCh, '(|') && prevCh !== '\\') || // 当前字符为非转义的(和|
                i === this._raw.length - 1 || // 当前字符为正规表达式最后一个字符
                (nextCh && utils_1.inStr(curCh, '|)*')); // 当前字符的后一个字符为|)*
            !shouldNotAddDot && (res += '.');
            res += curCh;
        }
        this._dotRaw = res;
    }
    /**
     * 将中缀正则表达式转换为后缀正则表达式
     * https://www.icourse163.org/learn/SEU-1003566002#/learn/content?type=detail&id=1214746334
     */
    toPostfix() {
        let res = '', stack = [], raw = this._dotRaw, parts = utils_1.splitAndKeep(raw, '().|*');
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i].trim();
            if (part.length === 0) {
                // 该策略不会影响空格识别，因为空格被要求输入为" "
                continue;
            }
            else if (part[0] === '|') {
                // TODO: 继续逻辑
            }
        }
    }
}
exports.Regex = Regex;
