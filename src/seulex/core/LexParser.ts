/**
 * .l文件解析器
 * by z0gSh1u & Withod
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

import fs from 'fs'
import { assert } from '../../utils'

/**
 * .l文件解析器
 * 用于解析出.l文件的各个部分
 */
export class LexParser {
  // .l文件内容
  private _filePath!: string // 文件路径
  private _rawContent!: string // 文件原生数据
  private _splitContent!: string[] // 内容按行分割
  // .l文件的四部分（文本）
  private _copyPart!: string // 直接复制部分
  private _regexAliasPart!: string // 正则别名部分，允许分布在文件%{前或是%%之间两种位置
  private _actionPart!: string // 正则-动作部分
  private _cCodePart!: string // C代码部分
  // 解析结果
  private _regexAliases!: { [key: string]: string } // 正则别名->正则内容
  private _actions!: { [key: string]: string } // 正则内容->动作，支持{}、单行无{}、无动作;、或|算符

  get copyPart() {
    return this._copyPart
  }
  get cCodePart() {
    return this._cCodePart
  }
  get regexAliases() {
    return this._regexAliases
  }
  get actions() {
    return this._actions
  }

  constructor(filePath: string) {
    this._filePath = filePath
    this._rawContent = fs
      .readFileSync(this._filePath)
      .toString()
      .replace(/\r\n/g, '\n') // 换行一律LF，没有CR
    this._regexAliases = {}
    this._actions = {}
    this._fillText()
    this._fillResult()
  }

  /**
   * 解析出四部分的文本
   */
  private _fillText() {
    this._splitContent = this._rawContent.split('\n')
    let copyPartStart = -1,
      copyPartEnd = -1,
      twoPercent: number[] = []
    // 寻找分界符位置
    this._splitContent.forEach((v, i) => {
      switch (
        v.trimRight() // 要求左侧顶格
      ) {
        case '%{':
          assert(copyPartStart === -1, 'Bad .l structure. Duplicate %{.')
          copyPartStart = i
          break
        case '%}':
          assert(copyPartEnd === -1, 'Bad .l structure. Duplicate %}.')
          copyPartEnd = i
          break
        case '%%':
          assert(twoPercent.length < 2, 'Bad .l structure. Duplicate %%.')
          twoPercent.push(i)
          break
      }
    })
    assert(copyPartStart !== -1, 'Bad .l structure. {% not found.')
    assert(copyPartEnd !== -1, 'Bad .l structure. %} not found.')
    assert(twoPercent.length === 2, 'Bad .l structure. No enough %%.')
    // 最末尾的C代码部分
    this._cCodePart = this._splitContent.slice(twoPercent[1] + 1).join('\n')
    // 开头的直接复制部分
    this._copyPart = this._splitContent
      .slice(copyPartStart + 1, copyPartEnd)
      .join('\n')
    // 中间的正则-动作部分
    this._actionPart = this._splitContent
      .slice(twoPercent[0] + 1, twoPercent[1])
      .join('\n')
    // 剩余的是正则别名部分
    this._regexAliasPart =
      this._splitContent.slice(0, copyPartStart).join('\n') +
      this._splitContent.slice(copyPartEnd + 1, twoPercent[0]).join('\n')
  }

  /**
   * 填充解析结果
   */
  private _fillResult() {
    // 分析正则别名部分
    this._regexAliasPart.split('\n').forEach((v) => {
      if (v.trim() !== '') {
        v = v.trim()
        let spaceTest = /\s+/.exec(v)
        assert(spaceTest, `Invalid regex alias line: ${v}`)
        let alias = v.substring(0, spaceTest?.index as number)
        assert(
          (spaceTest?.index as number) < v.length - 1,
          `Invalid regex alias line: ${v}`
        )
        let regex = v.substring(spaceTest?.index as number).trimLeft()
        assert(
          !(alias in this._regexAliases),
          `Regex alias re-definition found: ${v}`
        )
        this._regexAliases[alias] = regex
      }
    })
    // 分析规则与动作部分，并作别名展开
    let regexPart = '', // 读取的正则部分
      actionPart = '', // 读取的动作部分
      regexes: string[] = [], // 别名展开后的正则列表
      isReadingRegex = true, // 是否正在读取正则
      isWaitingOr = false, // 是否正在等待正则间的“或”运算符
      isInQuote = false, // 是否在引号内
      isSlash = false, // 是否转义
      braceLevel = 0 // 读取动作时处于第几层花括号内
    this._actionPart.split('').forEach((c) => {
      if (isReadingRegex) {
        // 正在读取正则
        if (isWaitingOr) {
          // 正在等待正则间的或运算符
          if (c.trim()) {
            // 非空白字符
            isWaitingOr = false
            if (c != '|') isReadingRegex = false
          }
        } else {
          if (!isInQuote && !c.trim() && regexPart != '') {
            // 正则读取完毕
            let ptr1 = 0
            isSlash = false
            for (; ptr1 < regexPart.length; ptr1++) {
              // 寻找正则别名的开头{
              let char = regexPart.charAt(ptr1)
              if (!isInQuote && !isSlash && char == '{') {
                // 开始读取别名
                let ptr2 = ptr1 + 1,
                  alias = ''
                for (; ptr2 < regexPart.length; ptr2++) {
                  // 寻找别名的结尾}
                  char = regexPart.charAt(ptr2)
                  if (char == '}') break // 完成读取别名
                  alias += char
                }
                assert(
                  ptr2 < regexPart.length,
                  `Missing right brace at the end of alias: ${alias}`
                )
                if (alias in this._regexAliases) {
                  regexPart =
                    regexPart.substring(0, ptr1) +
                    '(' +
                    this._regexAliases[alias] +
                    ')' +
                    regexPart.substring(ptr2 + 1)
                  ptr1 -= 1
                } else ptr1 = ptr2
              } else if (char == '\\') isSlash = !isSlash
              else if (!isSlash && char == '"') isInQuote = !isInQuote
              else isSlash = false
            }
            assert(
              !this._actions.hasOwnProperty(regexPart),
              `Regex re-definition found: ${regexPart}`
            )
            regexes.push(regexPart)
            regexPart = ''
            isSlash = false
            isInQuote = false
            isWaitingOr = true // 开始等待正则间的或运算符
          } else {
            regexPart += c.trim() ? c : regexPart == '' ? '' : ' '
            if (c == '\\') isSlash = !isSlash
            else if (c == '"' && !isSlash) isInQuote = !isInQuote
            else isSlash = false
          }
        }
      }
      if (!isReadingRegex) {
        // 正在读取动作
        actionPart += c.trim() ? c : ' '
        if (
          (!isInQuote && braceLevel == 0 && c == ';') ||
          (!isInQuote && c == '}' && braceLevel == 1)
        ) {
          // 动作读取完毕
          regexes.forEach((regex) => {
            this._actions[regex] = actionPart
          })
          regexes = []
          isSlash = false
          isInQuote = false
          braceLevel = 0
          actionPart = ''
          isReadingRegex = true // 开始读取正则
        } else {
          if (c == '\\') isSlash = !isSlash
          else if (!isSlash && (c == "'" || c == '"')) isInQuote = !isInQuote
          else if (!isInQuote && c == '{') braceLevel += 1
          else if (!isInQuote && c == '}')
            braceLevel = Math.max(0, braceLevel - 1)
          else isSlash = false
        }
      }
    })
  }
}
