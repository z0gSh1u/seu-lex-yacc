"use strict";
/**
 * 正则表达式相关代码
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
/**
 * 正则表达式类
 */
class Regex {
    constructor(regex) {
        this._raw = regex;
        this._procRangeEscape();
        this._procRange();
        this._addDots();
        this._toPostfix();
    }
    get raw() {
        return this._raw;
    }
    get escapeExpanded() {
        return this._escapeExpanded;
    }
    get rangeExpanded() {
        return this._rangeExpanded;
    }
    get dotAdded() {
        return this._dotAdded;
    }
    get postFix() {
        return this._postFix;
    }
    /**
     * 把表示【多种字符】的转义字符转为方框范围形式，如\d->[0-9]
     */
    _procRangeEscape() {
        const quoteRanges = utils_1.getMatchedRanges(utils_1.PATTERN_INSIDEQUOTE_NOTSLASH, this._raw);
        const rangeRanges = utils_1.getMatchedRanges(utils_1.PATTERN_RANGE_NOTSLASH, this._raw);
        function shouldNot(i) {
            // 在引号间和range框中的不处理
            return utils_1.inRange(quoteRanges, i) || utils_1.inRange(rangeRanges, i);
        }
        this._escapeExpanded = this._raw;
        for (let i = 0; i < this._escapeExpanded.length - 1; i++) {
            if (shouldNot(i))
                continue;
            if (this._escapeExpanded[i] === '\\' && this._escapeExpanded[i + 1] !== '\\') {
                let slashBefore = 0;
                for (let j = i; j >= 0; j--)
                    if (this._escapeExpanded[j] === '\\')
                        slashBefore += 1;
                    else
                        break; // 向前找反斜杠，\\\x可以，但\\\\x不行，即奇数个才是对x的转义
                if (slashBefore % 2 !== 0) {
                    let escapeCharacter = this._escapeExpanded[i + 1];
                    utils_1.assert(utils_1.inStr(escapeCharacter, utils_1.SUPPORTED_ESCAPE), 'This escape character is not supported.');
                    if (utils_1.inStr(escapeCharacter, 'ds')) {
                        let expanded;
                        switch (escapeCharacter) {
                            case 'd':
                                expanded = '[0-9]';
                                break;
                            case 's':
                                expanded = '[" "\\t\\r\\n]';
                                break;
                        }
                        this._escapeExpanded =
                            this._escapeExpanded.substring(0, i) +
                                expanded +
                                this._escapeExpanded.substring(i + 2);
                    }
                }
            }
        }
    }
    /**
     * 展开正则里的方框范围，填充rangeExpanded
     */
    _procRange() {
        const quoteRanges = utils_1.getMatchedRanges(utils_1.PATTERN_INSIDEQUOTE_NOTSLASH, this._escapeExpanded);
        const rangeRanges = utils_1.getMatchedRanges(utils_1.PATTERN_RANGE_NOTSLASH, this._escapeExpanded);
        function shouldNot(i) {
            // 在引号间中的不处理
            return utils_1.inRange(quoteRanges, i) && !utils_1.inRange(rangeRanges, i);
        }
        let bracketRanges = utils_1.getMatchedRanges(utils_1.PATTERN_RANGE_NOTSLASH, this._escapeExpanded); // 真方框覆盖区间（闭区间）
        // 检查是否有[]重叠的情况
        let axis = Array(this._escapeExpanded.length).fill(0);
        bracketRanges.forEach(range => {
            for (let i = range[0]; i <= range[1]; i++) {
                utils_1.assert(axis[i] <= 0, 'Some bracket range intersects.');
                axis[i] === 0 && (axis[i] = 1);
            }
        });
        // 开始具体展开
        let replacement = [], conjugate = false;
        bracketRanges.forEach(range => {
            let content = this._escapeExpanded.substring(range[0] + 1, range[1]); // 去掉方框
            if (shouldNot(range[0]) || shouldNot(range[1])) {
                replacement.push(`[${content}]`);
                return;
            }
            // 处理[^]
            if (content[0] == '^') {
                conjugate = true;
                content = content.substring(1);
            }
            // 处理范围对
            const PATTERN_PAIR = /\S-\S/g; // 匹配x-x对
            let waitForExpand = [], // [lChar, rChar][]
            expanded = [];
            content = content.replace(PATTERN_PAIR, pair => {
                waitForExpand.push([pair[0], pair[2]]);
                return '';
            }); // 至此，content是剩余的不成对的单独字符
            function linspace(left, right) {
                utils_1.assert(left.charCodeAt(0) <= right.charCodeAt(0), 'Range left is greater than range right.');
                return new Array(right.charCodeAt(0) - left.charCodeAt(0) + 1)
                    .fill('')
                    .map((_, i) => String.fromCharCode(left.charCodeAt(0) + i));
            }
            waitForExpand.forEach(lrPair => {
                expanded.push(...linspace(...lrPair));
            });
            // 处理剩余单独字符中的转义字符
            let foundEscape = true;
            while (foundEscape) {
                foundEscape = false;
                for (let i = 0; i < content.length - 1; i++)
                    if (content[i] === '\\') {
                        expanded.push('\\' + content[i + 1]);
                        content = content.substring(0, i) + content.substring(i + 2);
                        foundEscape = true;
                        break;
                    }
            }
            if (content.includes('" "')) {
                content = content.replace(/\" \"/g, '');
                expanded.push(' ');
            }
            // 处理剩余的非转义的普通单独字符
            expanded.push(...content.split(''));
            expanded = [...new Set(expanded)]; // 去重
            if (conjugate) {
                let conjugateExpanded = [];
                for (let ascii = utils_1.ASCII_MIN; ascii <= utils_1.ASCII_MAX; ascii++) {
                    const char = String.fromCharCode(ascii)[0];
                    if (!expanded.includes(char) && utils_1.inStr(char, `\\[]*?+()|".`))
                        conjugateExpanded.push(`\\${char}`);
                    else {
                        if (!expanded.includes(`\\${char}`) && `trn`.includes(char))
                            conjugateExpanded.push(`\\${char}`);
                        if (!expanded.includes(char))
                            conjugateExpanded.push(char);
                    }
                }
                expanded = [...conjugateExpanded];
            }
            replacement.push(`(${expanded.join('|')})`); // 重构成(...|...)形式
        });
        // 替换，形成展开结果
        let ptr = 0;
        this._rangeExpanded = this._escapeExpanded.replace(utils_1.PATTERN_RANGE_NOTSLASH, () => replacement[ptr++]);
    }
    /**
     * 加点处理
     * 不用点号而是用数组表示连缀关系，彻底避免冲突。我们将这称为隐式加点
     */
    _addDots() {
        let res = [], // 加点结果
        part = '', inQuote = false; // 当前是否在括号中
        const quoteRanges = utils_1.getMatchedRanges(utils_1.PATTERN_INSIDEQUOTE_NOTSLASH, this._rangeExpanded);
        for (let i = 0; i < this._rangeExpanded.length; i++) {
            // 当前、后一字符
            let c = this._rangeExpanded[i], next = i === this._rangeExpanded.length - 1 ? null : this._rangeExpanded[i + 1];
            // 先考虑有引号的情况
            if (quoteRanges.some(range => i === range[1]) && inQuote) {
                // 到达右引号，退出引号
                inQuote = false;
                res.push(`"${part.substring(0, part.length)}"`); // “xxx”
                part = '';
            }
            else if (utils_1.inRange(quoteRanges, i)) {
                // 在引号中，且不是右引号
                if (!inQuote)
                    inQuote = true;
                // 正在引号中，首次不做是为了去掉左引号
                else
                    part += c;
            }
            else {
                // 非引号内的一般情况
                part += c;
                let slashBefore = 0; // 用于判断当前字符是不是转义字符
                for (let j = i - 1; j >= 0; j--) {
                    if (this._rangeExpanded[j] === '\\')
                        slashBefore += 1;
                    else
                        break;
                }
                let shouldNotAddDot = // 不加点的情况，参考慕课 https://www.icourse163.org/learn/SEU-1003566002 ，并做了修正
                 (c === '\\' && slashBefore % 2 === 0) || // 当前字符为定义的转义字符
                    i === this._rangeExpanded.length - 1 || // 当前字符为最后一个字符
                    (utils_1.inStr(c, '|(') && (i === 0 || slashBefore % 2 === 0)) || // 当前字符为非转义的操作符|(
                    (next && utils_1.inStr(next, '|)*+?]')); // 下一个字符是操作符或右括号
                if (!shouldNotAddDot) {
                    res.push(part);
                    part = '';
                }
            }
        }
        !!part && res.push(part); // 还有剩就直接放进去
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
            if (raw[i].match(/".+"/))
                // 引号中的内容，不处理特殊符号，直接拼接
                for (let j = 1; j < raw[i].length - 1; j++) {
                    if (utils_1.inStr(raw[i][j], '?*+.()|[]\\'))
                        // 因为去掉了引号，故其中的特殊字符要转义
                        parts.push(`\\`, `${raw[i][j]}`, '[dot]');
                    else if (raw[i][j].trim() === '')
                        // 处理纯空格
                        parts.push(...Array(raw[i][j].length).fill('[space]'), '[dot]');
                    else
                        parts.push(raw[i][j], '[dot]');
                }
            else
                parts.push(...raw[i].split(''), '[dot]'); // 非引号内内容，需要处理特殊符号，先保留，下面开始处理
        }
        parts.splice(parts.length - 1, 1); // 去掉最后一个多加的[dot]
        parts = parts.map(v => (v.trim().length === 0 ? '[space]' : v));
        let waitingEscape = false;
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i].trim();
            if (waitingEscape) {
                res.push(`${part[0]}`);
                waitingEscape = false;
                continue;
            }
            if (part.length === 0) {
                continue; // 当前是空格，就跳过。该策略不会影响空格识别，因为空格已被转化为[space]
            }
            else if (part[0] === '|') {
                while (stack.length && utils_1.inStr(stack[stack.length - 1], '.*'))
                    res.push(stack.pop()); // 优先级更低的是.*，全部弹出。数组模拟栈，栈顶是数组尾部
                stack.push('|'); // 弹完了加上本身
            }
            else if (part === '[dot]') {
                // 首先确保是连接符而不是任意字符点，优先级更低的是.，全部弹出
                while (stack.length && stack[stack.length - 1] === '[dot]')
                    res.push(stack.pop());
                stack.push('[dot]'); // 弹完了加上本身
            }
            else if (part[0] === '*') {
                res.push('*'); // 没有优先级更低的了，没必要入栈，直接加到后面即可
            }
            else if (part[0] === '+') {
                res.push('+');
            }
            else if (part[0] === '?') {
                res.push('?');
            }
            else if (part[0] === '(') {
                stack.push('('); // 处理括号，利用栈
            }
            else if (part[0] === ')') {
                while (stack.length && !utils_1.inStr(stack[stack.length - 1], '('))
                    res.push(stack.pop()); // 一直弹到(，即把括号内容全部弹光
                stack.pop(); // 弹掉(
            }
            else if (part[0] === '\\') {
                res.push(part[0]);
                waitingEscape = true;
            }
            else {
                res.push(part);
            }
        }
        // 处理栈内剩余
        while (stack.length)
            res.push(stack.pop());
        this._postFix = res.join(' ');
    }
}
exports.Regex = Regex;
