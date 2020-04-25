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
    this._splitContent = this._rawContent.split('\n')
    let copyPartStart = -1,
      copyPartEnd = -1
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
      }
    })
  }
}
