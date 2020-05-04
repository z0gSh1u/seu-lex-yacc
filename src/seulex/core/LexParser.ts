/* eslint-disable @typescript-eslint/camelcase */
/**
 * .lex文件解析器
 */

import fs from 'fs'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { assert, splitAndKeep } from '../../utils'

export class LexParser {
  // .lex文件内容
  private _filePath!: string
  private _rawContent!: string
  private _splitContent!: string[]
  // .lex文件的四部分
  private _copyPart!: string
  private _regexAliasPart!: string
  private _actionPart!: string
  private _cCodePart!: string
  // 解析结果
  private _regexAliases!: { [key: string]: string }
  private _actions!: { [key: string]: string }

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
    this._fillParts()
    this._analyse()
  }

  /**
   * 填充解析结果
   */
  private _analyse() {
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
    // 分析规则与动作部分
    let regex_part = "" // 读取的正则部分
    let action_part = "" // 读取的动作部分
    let reading_regex = true // 是否正在读取正则
    let waiting_or = false // 是否正在等待正则间的或运算符
    let regexs: string[] = [] // 别名展开后的正则列表
    let quot = false // 是否在引号内
    let bslash = false // 是否转义
    let brace_layer = 0 // 读取动作时处于第几层花括号内
    this._actionPart.split("").forEach(c => {
      if (reading_regex) { // 正在读取正则
        if (waiting_or) { // 正在等待正则间的或运算符
          if (c.trim()) { // 非空白字符
            waiting_or = false
            if (c != '|') {
              reading_regex = false
            }
          }
        } else {
          if (!quot && !c.trim() && regex_part != "") { // 正则读取完毕
            let ptr = 0
            bslash = false
            for (; ptr < regex_part.length; ptr++) { // 寻找正则别名的开头{
              let char = regex_part.charAt(ptr)
              if (!quot && !bslash && char == '{') { // 开始读取别名
                let ptr2 = ptr + 1
                let alias = ""
                for (; ptr2 < regex_part.length; ptr2++) { // 寻找别名的结尾}
                  char = regex_part.charAt(ptr2)
                  if (char == '}') { // 完成读取别名
                    break
                  }
                  alias += char
                }
                assert(ptr2 < regex_part.length, `Missing right brace at the end of alias: ${alias}`)
                if (this._regexAliases.hasOwnProperty(alias)) {
                  regex_part = regex_part.substring(0, ptr) + '(' + this._regexAliases[alias] + ')' + regex_part.substring(ptr2 + 1)
                  ptr--
                } else {
                  ptr = ptr2
                }
              } else if (char == '\\') {
                bslash = !bslash
              } else if (!bslash && char == '\"') {
                quot = !quot
              } else {
                bslash = false
              }
            }
            assert(!this._actions.hasOwnProperty(regex_part), `Regex re-definition found: ${regex_part}`)
            regexs.push(regex_part)
            regex_part = ""
            bslash = false
            quot = false
            waiting_or = true // 开始等待正则间的或运算符
          } else {
            regex_part += c.trim() ? c : (regex_part == "" ? '' : ' ')
            if (c == '\\') {
              bslash = !bslash
            } else if (c == '\"' && !bslash) {
              quot = !quot
            } else {
              bslash = false
            }
          }
        }
      }
      if (!reading_regex) { // 正在读取动作
        action_part += c.trim() ? c : ' '
        if (!quot && brace_layer == 0 && c == ';' || !quot && c == '}' && brace_layer == 1) { // 动作读取完毕
          regexs.forEach(regex => {
            this._actions[regex] = action_part
          })
          regexs = []
          bslash = false
          quot = false
          brace_layer = 0
          action_part = ""
          reading_regex = true // 开始读取正则
        } else {
          if (c == '\\') {
            bslash = !bslash
          } else if (!bslash && (c == '\'' || c == '\"')) {
            quot = !quot
          } else if (!quot && c == '{') {
            brace_layer++
          } else if (!quot && c == '}') {
            brace_layer = Math.max(0, brace_layer - 1)
          } else {
            bslash = false
          }
        }
      }
    })
  }

  /**
   * 解析出四部分
   */
  private _fillParts() {
    this._splitContent = this._rawContent.split('\n')
    let copyPartStart = -1,
      copyPartEnd = -1,
      twoPercent: number[] = []
    // 寻找分界符位置
    this._splitContent.forEach((v, i) => {
      switch (v.trimRight()) { // 要求左侧顶格
        case '%{':
          assert(copyPartStart === -1, 'Bad .lex structure. Duplicate %{.')
          copyPartStart = i
          break
        case '%}':
          assert(copyPartEnd === -1, 'Bad .lex structure. Duplicate %}.')
          copyPartEnd = i
          break
        case '%%':
          assert(twoPercent.length < 2, 'Bad .lex structure. Duplicate %%.')
          twoPercent.push(i)
          break
      }
    })
    assert(twoPercent.length === 2, 'Bad .lex structure. No enough %%.')
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
}
