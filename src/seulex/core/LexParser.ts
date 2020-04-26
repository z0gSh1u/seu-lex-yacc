import os from 'os'
import fs from 'fs'
import path from 'path'
import { assert } from '../../utils'

export class LexParser {
  // .lex file
  private _filePath!: string
  private _rawContent!: string
  private _splitContent!: string[]
  // Four parts of .lex file
  private _copyPart!: string
  private _regexAliasPart!: string
  private _actionPart!: string
  private _cCodePart!: string
  // Reformed data
  public _regexAliases!: { [key: string]: string }
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
    this._fillingParts()
    this._analyse()
  }

  private _analyse() {
    // 分析正则别名
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
    // TODO: 分析规则与动作

  }

  private _fillingParts() {
    this._splitContent = this._rawContent.split('\n')
    let copyPartStart = -1,
      copyPartEnd = -1,
      twoPercent: number[] = []
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
    this._cCodePart = this._splitContent.slice(twoPercent[1] + 1).join('\n')
    this._copyPart = this._splitContent
      .slice(copyPartStart + 1, copyPartEnd)
      .join('\n')
    this._actionPart = this._splitContent
      .slice(twoPercent[0] + 1, twoPercent[1])
      .join('\n')
    this._regexAliasPart =
      this._splitContent.slice(0, copyPartStart).join('\n') +
      this._splitContent.slice(copyPartEnd + 1, twoPercent[0]).join('\n')
  }
}
