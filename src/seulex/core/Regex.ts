/**
 * 正则表达式相关代码
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

import { inStr, inRange, assert, getMatchedRanges } from '../../utils'
import { LexParser } from './LexParser'

/**
 * 正则表达式类
 */
export class Regex {
  private _raw: string // STEP 0 - 最原始的正则表达式（只在LexParser做了别名展开）
  private _escapeExpanded!: string // STEP 1 - 做了转义展开后的正则表达式
  private _rangeExpanded!: string // STEP 2 - 做了range展开后的正则表达式
  private _dotAdded!: string[] // STEP 3 - 加点后的正则表达式
  private _postFix!: string // STEP 4- 后缀形式的正则表达式
  private _actionCode!: string // 该正则表达式对应的动作代码

  constructor(regex: string) {
    this._raw = regex
    // 展开转义\d和\s
    this._expandEscape()
    // 展开range范围，支持[a-z]、[A-Za-f]、[0-9abc]等各种刁钻形式
    this._expandRange()
    // 隐式加点
    this._addDots()
    // 转后缀
    this._toPostfix()
  }

  get raw() {
    return this._raw
  }
  get escapeExpanded() {
    return this._escapeExpanded
  }
  get dotAdded() {
    return this._dotAdded
  }
  get postFix() {
    return this._postFix
  }
  get rangeExpanded() {
    return this._rangeExpanded
  }
  get actionCode() {
    return this._actionCode
  }
  set actionCode(code: string) {
    this._actionCode = code
  }

  /**
   * 某些表示【多种字符】的转义字符，如\d、\s，在该阶段转换为方框范围形式
   */
  private _expandEscape() {
    const PATTERN_INSIDEQUOTE_NOTSLASH = /(?=[^\\]|^)(\"[^\"]*[^\\]\")/g // 在非转义引号之间内容，$0为带引号匹配结果
    let quoteRanges: [number, number][] = [] // 真引号覆盖区间（闭区间）
    this._escapeExpanded = this._raw
    for (let i = 0; i < this._escapeExpanded.length - 1; i++) {
      quoteRanges = getMatchedRanges(
        PATTERN_INSIDEQUOTE_NOTSLASH,
        this._escapeExpanded
      ) // 每轮都要重算，因为会改变_escapeExpanded
      if (inRange(quoteRanges, i)) continue // 在真引号内的统统不处理
      if (this._escapeExpanded[i] === '\\') {
        let slashBefore = 0
        if (this._escapeExpanded[i + 1] !== '\\') {
          // 不是\\的情况，而是\x
          for (let j = i; j >= 0; j--)
            if (this._escapeExpanded[j] === '\\') slashBefore += 1
            else break
          if (slashBefore % 2 !== 0) {
            // 例如\\\x是可以的，但\\\\x是不可以的
            let escapeCharacter = this._escapeExpanded[i + 1]
            assert(
              inStr(escapeCharacter, 'dstrn\\[]*?+()|"'),
              'This escape character is not supported.'
            )
            if (inStr(escapeCharacter, 'ds')) {
              // 该阶段只处理这两个（\d、\s），剩下的不代表多种字符的转义交给后级处理
              let expanded
              switch (escapeCharacter) {
                case 'd':
                  expanded = '[0-9]'
                  break
                case 's':
                  expanded = '[\\t\\r\\n]'
                  break
              }
              this._escapeExpanded =
                this._escapeExpanded.substring(0, i) +
                expanded +
                this._escapeExpanded.substring(i + 2)
            }
          }
        }
      }
    }
  }

  /**
   * 展开正则里的方框范围，填充rangeExpanded
   */
  private _expandRange() {
    const PATTERN_INSIDEQUOTE_NOTSLASH = /(?=[^\\]|^)(\"[^\"]*[^\\]\")/g // 在非转义引号之间内容，$0为带引号匹配结果
    const PATTERN_RANGE_NOTSLASH = /(?=[^\\]|^)\[(([^\[\]]+)[^\\])\]/g // 非转义[]定义的的range，$0为带大括号匹配结果
    let quoteRanges: [number, number][] = [], // 真引号覆盖区间（闭区间）
      bracketRanges: [number, number][] = [] // 真方框覆盖区间（闭区间）
    quoteRanges = getMatchedRanges(
      PATTERN_INSIDEQUOTE_NOTSLASH,
      this._escapeExpanded
    )
    bracketRanges = getMatchedRanges(
      PATTERN_RANGE_NOTSLASH,
      this._escapeExpanded
    )
    // 检查是否有[]重叠的情况
    let axis = Array(this._escapeExpanded.length).fill(0)
    quoteRanges.forEach((range) => {
      for (let i = range[0]; i <= range[1]; i++) axis[i] = -1
    })
    bracketRanges.forEach((range) => {
      for (let i = range[0]; i < range[1]; i++) {
        assert(axis[i] <= 0, 'Some bracket range intersects.')
        axis[i] === 0 && (axis[i] = 1)
      }
    })
    // 开始具体展开
    let replacement: string[] = []
    bracketRanges.forEach((range) => {
      // 检查方括号不在真引号内才展开
      if (!inRange(quoteRanges, range[0]) && !inRange(quoteRanges, range[1])) {
        let content = this._escapeExpanded.substring(range[0] + 1, range[1]) // 去掉方框
        const PATTERN_PAIR = /\S-\S/g // 匹配x-x对
        let waitExpand: [string, string][] = [], // [lChar, rChar][]
          expanded = []
        content = content.replace(PATTERN_PAIR, (pair) => {
          waitExpand.push([pair[0], pair[2]])
          return ''
        }) // content是剩余的不成对的单独字符
        /**
         * 从left到right生成之间所有字符（闭区间）
         */
        function generateRange(left: string, right: string) {
          assert(
            left.charCodeAt(0) <= right.charCodeAt(0),
            'Range left is greater than range right.'
          )
          return new Array(right.charCodeAt(0) - left.charCodeAt(0) + 1)
            .fill('')
            .map((_, i) => String.fromCharCode(left.charCodeAt(0) + i))
        }
        waitExpand.forEach((lrPair) => {
          expanded.push(...generateRange(...lrPair))
        })
        // 处理剩余单独字符中的转义字符
        while (true) {
          let foundEscape = false
          // 一轮一轮扫描，直到不再发现
          for (let i = 0; i < content.length - 1; i++)
            if (content[i] === '\\') {
              expanded.push(content[i] + content[i + 1])
              content = content.substring(0, i) + content.substring(i + 2)
              foundEscape = true
              break
            }
          if (!foundEscape) break
        }
        // 处理剩余的非转移的普通单独字符
        expanded.push(...content.split(''))
        expanded = [...new Set(expanded)] // 去重
        replacement.push(`(${expanded.join('|')})`) // 重构成(...|...)形式
      } else {
        // 在真引号中的保留
        replacement.push(this._escapeExpanded.substring(range[0], range[1] + 1))
      }
    })
    // 替换，形成展开结果
    let ptr = 0
    this._rangeExpanded = this._escapeExpanded.replace(
      PATTERN_RANGE_NOTSLASH,
      () => replacement[ptr++]
    )
  }

  /**
   * 加点处理
   * 恢复省略的连接符号，如abc本应为a.b.c
   * 不用点号而是用数组表示连缀关系，彻底避免冲突。我们将这称为隐式加点
   */
  private _addDots() {
    const PATTERN_INSIDEQUOTE_NOTSLASH = /(?=[^\\]|^)(\"[^\"]*[^\\]\")/g // 在非转义引号之间内容，$0为带引号匹配结果
    let res: string[] = [], // 加点结果
      part = '',
      quoteRanges = getMatchedRanges(
        PATTERN_INSIDEQUOTE_NOTSLASH,
        this._rangeExpanded
      ), // 真引号范围
      inQuote = false // 当前是否在括号中
    for (let i = 0; i < this._rangeExpanded.length; i++) {
      // 当前、前一、后一字符
      let c = this._rangeExpanded[i],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        prev = i === 0 ? null : this._rangeExpanded[i - 1],
        next =
          i === this._rangeExpanded.length - 1
            ? null
            : this._rangeExpanded[i + 1]
      // 先考虑有引号的情况
      if (quoteRanges.some((range) => i === range[1]) && inQuote) {
        // 到达右引号，退出引号
        inQuote = false
        res.push(`"${part.substring(0, part.length)}"`) // “xxx”
        part = ''
      } else if (inRange(quoteRanges, i)) {
        // 在引号中，且不是右引号
        if (!inQuote) inQuote = true
        // 正在引号中，首次不做是为了去掉左引号
        else part += c
      } else {
        // 非引号内的一般情况
        part += c
        let slashBefore = 0 // 用于判断当前字符是不是转义字符
        for (let j = i - 1; j >= 0; j--) {
          if (this._rangeExpanded[j] === '\\') slashBefore += 1
          else break
        }
        let shouldNotAddDot = // 不加点的情况，参考慕课 https://www.icourse163.org/learn/SEU-1003566002 ，并做了修正
          (c === '\\' && slashBefore % 2 === 0) || // 当前字符为定义的转义字符
          i === this._rangeExpanded.length - 1 || // 当前字符为最后一个字符
          (inStr(c, '|(') && (i === 0 || slashBefore % 2 === 0)) || // 当前字符为非转义的操作符|(
          (next && inStr(next as string, '|)*+?')) // 下一个字符是操作符或右括号
        if (!shouldNotAddDot) {
          res.push(part)
          part = ''
        }
      }
    }
    !!part && res.push(part) // 还有剩就直接放进去
    this._dotAdded = res
  }

  /**
   * 将中缀正则表达式转换为后缀正则表达式
   */
  private _toPostfix() {
    let res = [], // 转换结果
      stack: string[] = [], // 转换过程用到的栈
      raw = this._dotAdded, // 隐式加点结果
      parts: string[] = []
    for (let i = 0; i < raw.length; i++) {
      if (raw[i].match(/".+"/))
        // 引号中的内容，不处理特殊符号，直接拼接
        for (let j = 1; j < raw[i].length - 1; j++) {
          if (inStr(raw[i][j], '?*+.()|[]\\'))
            // 因为去掉了引号，故其中的特殊字符要转义
            parts.push(`\\ ${raw[i][j]}`, '[dot]')
          else if (raw[i][j].trim() === '')
            // 处理纯空格
            parts.push(...Array(raw[i][j].length).fill('[space]'), '[dot]')
          else parts.push(raw[i][j], '[dot]')
        }
      else parts.push(...raw[i].split(''), '[dot]') // 非引号内内容，需要处理特殊符号，先保留，下面开始处理
    }
    parts.splice(parts.length - 1, 1) // 去掉最后一个多加的[dot]
    // 注意，需要输入特殊符号本身时，用的是反斜杠转义，而不是引号引起，因此该策略不会影响引号内内容识别
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i].trim()
      if (part.length === 0) {
        continue // 当前是空格等，就跳过。该策略不会影响空格识别，因为空格被要求输入为" "
      } else if (part[0] === '|') {
        while (!!stack.length && inStr(stack[stack.length - 1], '.*'))
          res.push(stack.pop()) // 优先级更低的是.*，全部弹出。数组模拟栈，栈顶是数组尾部
        stack.push('|') // 弹完了加上本身
      } else if (part === '[dot]') {
        // 首先确保是连接符而不是任意字符点，优先级更低的是.，全部弹出
        while (!!stack.length && stack[stack.length - 1] === '[dot]')
          res.push(stack.pop())
        stack.push('[dot]') // 弹完了加上本身
      } else if (part[0] === '*') {
        res.push('*') // 没有优先级更低的了，没必要入栈，直接加到后面即可
      } else if (part[0] === '+') {
        res.push('+')
      } else if (part[0] === '?') {
        res.push('?')
      } else if (part[0] === '(') {
        stack.push('(') // 处理括号，利用栈
      } else if (part[0] === ')') {
        while (!!stack.length && !inStr(stack[stack.length - 1], '('))
          res.push(stack.pop()) // 一直弹到(，即把括号内容全部弹光
        stack.pop() // 弹掉(
      } else {
        res.push(part) // 其他情况
      }
    }
    // 处理栈内剩余
    while (!!stack.length) res.push(stack.pop())
    this._postFix = res.join(' ')
  }

  /**
   * 借助LexParser填充正则对应代码
   */
  fillActionCode(lexParser: LexParser) {
    this._actionCode = lexParser.actions[this._raw].trim()
    if (this._actionCode === ';') {
      this._actionCode = '' // 单独分号表示什么都不做
    } else if (this._actionCode[0] === '{') { // 去掉大括号
      this._actionCode = this._actionCode.substring(
        1,
        this._actionCode.length - 2
      )
    }
  }
}
