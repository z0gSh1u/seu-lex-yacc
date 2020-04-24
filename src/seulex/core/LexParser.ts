import os from 'os'
import fs from 'fs'
import path from 'path'
import { assert } from '../../utils'

export class LexParser {
  // .lex file
  private _filePath!: string
  private _rawContent!: string
  // Four parts of .lex file
  private _copyPart!: string
  private _regexAliasPart!: string
  private _actionPart!: string
  private _cCodePart!: string
  // Reformed data
  private _regexAlias!: { [key: string]: string }
  private _action!: { [key: string]: string }

  constructor(filePath: string) {
    this._filePath = filePath
    this._rawContent = fs
      .readFileSync(filePath)
      .toString()
      .replace('\r\n', '\n')
    this._splitParts()
  }

  private _splitParts() {
    let pattern: RegExp

    // split copyPart
    pattern = new RegExp(/^%{\s*$/g)
    let copyPartStartMatch = pattern.exec(this._rawContent)
    assert(copyPartStartMatch, 'Bad .lex structure. {% not found.')
    assert(!pattern.exec(this._rawContent), 'Bad .lex structure. Duplicate {%.')
    let copyPartStartPos = copyPartStartMatch?.index as number
    pattern = new RegExp(/^%{\s*$/g)
    let copyPartEndMatch = pattern.exec(this._rawContent)
    assert(copyPartEndMatch, 'Bad .lex structure. %} not found.')
    assert(!pattern.exec(this._rawContent), 'Bad .lex structure. Duplicate %}.')
    let copyPartEndPos = copyPartStartMatch?.index as number
    this._copyPart = this._rawContent
      .substring(copyPartStartPos + 2, copyPartEndPos as number)
      .trim()

    // split cCodePart
    pattern = new RegExp(/^%%\s+$/g)
    let twoPercentMatch1 = pattern.exec(this._rawContent)
    let twoPercentMatch2 = pattern.exec(this._rawContent)
    assert(
      twoPercentMatch1 && twoPercentMatch2,
      'Bad .lex structure. No enough %%.'
    )
    let twoPercentPos1 = twoPercentMatch1?.index as number
    let twoPercentPos2 = twoPercentMatch2?.index as number
    assert(!pattern.exec(this._rawContent), 'Bad .lex structure. Duplicate %%.')
    this._cCodePart = this._rawContent.substring(twoPercentPos2 + 2).trim()
    // split actionPart
    this._actionPart = this._rawContent
      .substring(twoPercentPos1 + 2, twoPercentPos2)
      .trim()
    // split regexAliasPart
    this._regexAliasPart = this._rawContent
      .substring(0, twoPercentPos1)
      .trim()
      .replace(/^%{$.*^%}$/, '')
  }
}
