/**
 * .lex文件解析器
 */

import fs from 'fs'
import { assert } from '../../utils'

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
    // TODO: 分析规则与动作部分
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
      switch (
        v.trimRight() // 要求左侧顶格
      ) {
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
