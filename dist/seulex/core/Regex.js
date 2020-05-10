"use strict";
/**
 * 正则表达式相关
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: 怎么处理转义字符？考虑支持\n、\s和\d。
const utils_1 = require("../../utils");
/**
 * 正则表达式类
 */
class Regex {
    constructor(regex) {
        this._raw = regex;
        // 展开range范围，支持[a-z]、[A-Za-f]、[0-9abc]等各种刁钻形式
        // TODO: _expandRange对[[]]这种嵌套形式不报错
        this._expandRange();
        // 隐式加点
        this._addDots();
        // 转后缀
        this._toPostfix();
    }
    get raw() {
        return this._raw;
    }
    get dotAdded() {
        return this._dotAdded;
    }
    get postFix() {
        return this._postFix;
    }
    get rangeExpanded() {
        return this._rangeExpanded;
    }
    /**
     * 展开正则里的方框range，填充rangeExpanded
     */
    _expandRange() {
        // 注：下面的正则其实不是很严格
        const PATTERN_INSIDEQUOTE_NOTSLASH = /(?=[^\\]|^)(\"[^\"]*[^\\]\")/g; // 在非转义引号之间内容，$0为带引号匹配结果
        const PATTERN_RANGE_NOTSLASH = /(?=[^\\]|^)\[(([^\[\]]+)[^\\])\]/g; // 非转义[]定义的的range，$0为带大括号匹配结果
        let quoteRanges = [], // 真引号覆盖区间（闭区间）
        bracketRanges = []; // 真方框覆盖区间（闭区间）
        quoteRanges = utils_1.getMatchedRanges(PATTERN_INSIDEQUOTE_NOTSLASH, this._raw);
        bracketRanges = utils_1.getMatchedRanges(PATTERN_RANGE_NOTSLASH, this._raw);
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
     * （隐式）加点处理
     * 恢复省略的连接符号，如abc本应为a.b.c
     */
    _addDots() {
        // 使用数组而非点号表示连接关系，从而避免表示任意字符的点号与加点的点号冲突
        const PATTERN_INSIDEQUOTE_NOTSLASH = /(?=[^\\]|^)(\"[^\"]*[^\\]\")/g; // 在非转义引号之间内容，$0为带引号匹配结果
        let res = [], // 加点结果
        part = '', quoteRanges = utils_1.getMatchedRanges(PATTERN_INSIDEQUOTE_NOTSLASH, this._rangeExpanded), // 真引号范围
        inQuote = false; // 当前是否在括号中
        for (let i = 0; i < this._rangeExpanded.length; i++) {
            // 当前、前一、后一字符
            let c = this._rangeExpanded[i], prev = i === 0 ? null : this._rangeExpanded[i - 1], next = i === this._rangeExpanded.length - 1
                ? null
                : this._rangeExpanded[i + 1];
            // 先考虑有引号的情况
            if (quoteRanges.some((range) => i === range[1]) && inQuote) {
                // 到达右引号，退出引号
                inQuote = false;
                res.push(`"${part.substring(0, part.length)}"`); // “xxx”
                part = '';
            }
            else if (utils_1.inRange(quoteRanges, i)) {
                // 在引号中，且不是右引号
                if (!inQuote) {
                    inQuote = true;
                }
                else {
                    // 正在引号中，首次不做是为了去掉左引号
                    part += c;
                }
            }
            else {
                // 非引号内的一般情况
                part += c;
                let shouldNotAddDot = // 不加点的情况
                 c === '\\' || // 当前字符为定义的转义字符
                    i === this._rangeExpanded.length - 1 || // 当前字符为最后一个字符
                    (utils_1.inStr(c, '|(') && (i === 0 || prev !== '\\')) || // 当前字符为非转义的操作符|(
                    (next && utils_1.inStr(next, '|)*+?')); // 下一个字符是操作符或右括号
                if (!shouldNotAddDot) {
                    res.push(part);
                    part = '';
                }
            }
        }
        !!part && res.push(part); // 还有剩就放进去
        this._dotAdded = res;
    }
    /**
     * 将中缀正则表达式转换为后缀正则表达式
     */
    _toPostfix() {
        let res = [], // 转换结果
        stack = [], // 转换过程用到的栈
        raw = this._dotAdded, // 隐式加点结果
        parts = [];
        for (let i = 0; i < raw.length; i++) {
            if (raw[i].match(/".+"/)) {
                // 引号内容，不处理特殊符号，直接加点拼接
                // TODO: 引号里面带空格无法处理
                for (let j = 1; j < raw[i].length - 1; j++) {
                    parts.push(utils_1.inStr(raw[i][j], '?*+.()|[]') ? `\\ ${raw[i][j]}` : raw[i][j], '[dot]');
                }
            }
            else {
                // 非引号内内容，需要处理特殊符号
                parts.push(...raw[i].split(''), '[dot]'); // 伪装加点并记录下标，为了避免与.号冲突
            }
        }
        parts.splice(parts.length - 1, 1); // 去掉最后一个多加的[dot]
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
            else if (part === '[dot]') {
                // 首先确保是连接符而不是任意字符点，优先级更低的是.，全部弹出
                // TODO: 有没有可能哪个倒霉孩子给栈里整一个[dot]字符串？
                while (!!stack.length && stack[stack.length - 1] === '[dot]') {
                    res.push(stack.pop());
                }
                stack.push('[dot]'); // 弹完了加上本身
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
