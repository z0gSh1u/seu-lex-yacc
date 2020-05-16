import fs from 'fs'
import { assert } from '../utils'
import { Producer } from './Grammar'



export class YaccParser {
  private _filePath!: string
  private _rawContent!: string
  private _splitContent!: string[]

  private _copyPart!: string // {% %}之间的
  private _infoPart!: string // 各种%xxx
  private _producerPart!: string // 主体部分，各种产生式
  private _userCodePart!: string // 最后的用户代码部分

  private _alphabet!: string[]
  private _producers!: Producer[]

  get producers() {
    return this._producers
  }

  constructor(filePath: string) {
    this._filePath = filePath
    this._rawContent = fs
      .readFileSync(this._filePath)
      .toString()
      .replace(/\r\n/g, '\n')
    this._splitContent = this._rawContent.split('\n')
    this._fillText()
    this._parseProducers()
  }

  private _parseProducers() {
    const lines = this._producerPart.split('\n')
    let insideOne = false
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      if (line.trimLeft() === line) {
        // 顶格
        assert(!insideOne, 'New producer before the previous ends.')
        insideOne = true
        line = line.trim()
        if (!this._alphabet.includes(line)) {
          this._alphabet.push(line)
        }
        while ((line = lines[++i].trim()) !== ';') {
          let lineSplit = line.split(/\s/)
        }
      }
    }
  }

  private _fillText() {
    let copyPartStart = -1,
      copyPartEnd = -1,
      twoPercent: number[] = []
    // 寻找分界符位置
    this._splitContent.forEach((v, i) => {
      switch (
        v.trimRight() // 要求左侧顶格
      ) {
        case '%{':
          assert(copyPartStart === -1, 'Bad .y structure. Duplicate %{.')
          copyPartStart = i
          break
        case '%}':
          assert(copyPartEnd === -1, 'Bad .y structure. Duplicate %}.')
          copyPartEnd = i
          break
        case '%%':
          assert(twoPercent.length < 2, 'Bad .y structure. Duplicate %%.')
          twoPercent.push(i)
          break
      }
    })
    assert(copyPartStart !== -1, 'Bad .y structure. {% not found.')
    assert(copyPartEnd !== -1, 'Bad .y structure. %} not found.')
    assert(twoPercent.length === 2, 'Bad .y structure. No enough %%.')
    // 最末尾的C代码部分
    this._userCodePart = this._splitContent.slice(twoPercent[1] + 1).join('\n')
    // 开头的直接复制部分
    this._copyPart = this._splitContent
      .slice(copyPartStart + 1, copyPartEnd)
      .join('\n')
    // 中间的规则部分
    this._producerPart = this._splitContent
      .slice(twoPercent[0] + 1, twoPercent[1])
      .join('\n')
    // 剩余的是信息部分
    this._infoPart =
      this._splitContent.slice(0, copyPartStart).join('\n') +
      this._splitContent.slice(copyPartEnd + 1, twoPercent[0]).join('\n')
  }
}
