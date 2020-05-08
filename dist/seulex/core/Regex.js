"use strict";
/**
 * 正则表达式相关
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: 怎么处理" "和转义字符？
const utils_1 = require("../../utils");
/**
 * 正则表达式类
 */
class Regex {
    constructor(regex) {
        this._raw = regex;
        // TODO:
        this._expandRange(); // 展开range
        // 处理转义字符\d\n
        // 处理" "
        // 处理.
        this._addDots(); // 加点
        this._toPostfix(); // 转后缀
    }
    get raw() {
        return this._raw;
    }
    get dotRaw() {
        return this._dotRaw;
    }
    get postFix() {
        return this._postFix;
    }
    get rangeExpanded() {
        return this._rangeExpanded;
    }
    /**
     * 展开方框range
     */
    _expandRange() {
        // TODO: 下面的正则其实不是很严格
        const PATTERN_INSIDEQUOTE_NOTSLASH = /([^\\]|^)(\"[^\"]*[^\\]\")/g; // 在非转义引号之间内容，$0为带引号匹配结果
        const PATTERN_RANGE_NOTSLASH = /(?=[^\\]|^)\[(([^\[\]]+)[^\\])\]/g; // 非转义[]定义的的range，$0为带大括号匹配结果
        let quoteRanges = [], // 真引号覆盖区间（闭区间）
        bracketRanges = [], // 真方框覆盖区间（闭区间）
        result;
        while ((result = PATTERN_INSIDEQUOTE_NOTSLASH.exec(this._raw)) != null) {
            result = result;
            quoteRanges.push([result.index, result.index + result[0].length - 1]);
        }
        while ((result = PATTERN_RANGE_NOTSLASH.exec(this._raw)) != null) {
            result = result;
            bracketRanges.push([result.index, result.index + result[0].length - 1]);
        }
        let replacement = [];
        bracketRanges.forEach((range) => {
            // 检查方括号不在引号内才展开
            if (!utils_1.inRange(quoteRanges, range[0]) && !utils_1.inRange(quoteRanges, range[1])) {
                let content = this._raw.substring(range[0] + 1, range[1]); // 去掉方框
                const PATTERN_PAIR = /\S-\S/g;
                let waitExpand = [], expanded = [];
                content = content.replace(PATTERN_PAIR, (pair) => {
                    waitExpand.push([pair[0], pair[2]]);
                    return '';
                }); // 剩余单独字符
                /**
                 * 从left到right生成之间所有字符（闭区间）
                 */
                function generateRange(left, right) {
                    utils_1.assert(left.charCodeAt(0) <= right.charCodeAt(0), 'Range left is greater than range right.');
                    return new Array(right.charCodeAt(0) - left.charCodeAt(0) + 1)
                        .fill('')
                        .map((_, i) => String.fromCharCode(left.charCodeAt(0) + i));
                }
                waitExpand.forEach((lrPair) => {
                    expanded.push(...generateRange(...lrPair));
                });
                // 处理剩余的单独字符
                expanded.push(...content.split(''));
                // 去重
                expanded = [...new Set(expanded)];
                // 形成(...|...)形式
                replacement.push(`(${expanded.join('|')})`);
            }
            else {
                // 否则保留
                replacement.push(this._raw.substring(range[0], range[1] + 1));
            }
        });
        // 替换
        let ptr = 0;
        this._rangeExpanded = this._raw.replace(PATTERN_RANGE_NOTSLASH, () => replacement[ptr++]);
    }
    /**
     * 加点处理
     * 恢复省略的连接符号，如abc本应为a.b.c
     */
    _addDots() {
        // TODO: 加点会不会与代表任意字符的.号冲突？
        let res = '' + this._rangeExpanded[0];
        for (let i = 1; i < this._rangeExpanded.length; i++) {
            // 前中后三个位置的字符
            let curCh = this._rangeExpanded[i], prevCh = this._rangeExpanded[i - 1];
            //  nextCh = i < this._rangeExpanded.length - 2 ? this._rangeExpanded[i + 1] : null
            // 不加点的情况
            // TODO: 加点策略有些问题，去哪里可以找到完整的加点算法描述？
            // let shouldNotAddDot =
            //   curCh === '\\' || // 当前字符为定义的转义字符
            //   (inStr(curCh, '(|') && prevCh !== '\\') || // 当前字符为非转义的(和|
            //   i === this._rangeExpanded.length - 1 || // 当前字符为正规表达式最后一个字符
            //   (nextCh && inStr(curCh, '|)*')) // 当前字符的后一个字符为|)*
            // if (!shouldNotAddDot && isAlpha(curCh)) {
            //   res += '.'
            // }
            let shouldAddDot = (curCh === '(' && utils_1.isAlpha(prevCh)) ||
                (!utils_1.inStr(prevCh, '(|') && utils_1.isAlpha(curCh)) ||
                (curCh === '(' && utils_1.inStr(prevCh, '+*?'));
            shouldAddDot && (res += '.');
            res += curCh;
        }
        this._dotRaw = res;
    }
    /**
     * 将中缀正则表达式转换为后缀正则表达式
     */
    _toPostfix() {
        let res = [], // 转换结果
        stack = [], // 转换过程用到的栈
        raw = this._dotRaw, // 加点结果
        parts = utils_1.splitAndKeep(raw, '().|*?+ '); // 分离特殊符号
        // 注意，需要输入特殊符号本身时，用的是反斜杠转义，而不是引号引起
        // 因此该策略不会影响引号内内容识别
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i].trim();
            if (part.length === 0) {
                // 当前是空格等，就跳过
                // 该策略不会影响空格识别，因为空格被要求输入为" "
                continue;
            }
            else if (part[0] === '|') {
                // 优先级更低的是.*，全部弹出
                // 数组模拟栈，栈顶是数组尾部
                while (!!stack.length && utils_1.inStr(stack[stack.length - 1], '.*')) {
                    res.push(stack.pop());
                }
                stack.push('|'); // 弹完了加上本身
            }
            else if (part[0] === '.') {
                // 优先级更低的是.，全部弹出
                while (!!stack.length && utils_1.inStr(stack[stack.length - 1], '.')) {
                    res.push(stack.pop());
                }
                stack.push('.'); // 弹完了加上本身
            }
            else if (part[0] === '*') {
                // 没有优先级更低的了，没必要入栈，直接加到后面即可
                res.push('*');
            }
            else if (part[0] === '+') {
                res.push('+');
            }
            else if (part[0] === '?') {
                res.push('?');
            }
            else if (part[0] === '(') {
                // 处理括号，利用栈
                stack.push('(');
            }
            else if (part[0] === ')') {
                // 一直弹到(，即把括号内容全部弹光
                while (!!stack.length && !utils_1.inStr(stack[stack.length - 1], '(')) {
                    res.push(stack.pop());
                }
                stack.pop(); // 弹掉(
            }
            else {
                // 其他情况
                res.push(part);
            }
        }
        // 处理栈内剩余
        while (!!stack.length) {
            res.push(stack.pop());
        }
        this._postFix = res.join(' ');
    }
}
exports.Regex = Regex;
