/**
 * Yacc源文件 (.y）解析器
 * by Withod
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

import fs from 'fs'
import { assert, inStr, stringCook } from '../../utils'
import { Producer, SymbolType, GrammarSymbol } from './Grammar'

/**
 * .y文件解析器
 */
export class YaccParser {
  private _filePath!: string
  private _rawContent!: string
  private _splitContent!: string[]

  private _copyPart!: string // {% %}之间的
  private _infoPart!: string // 各种%xxx
  private _producerPart!: string // 主体部分，各种产生式
  private _userCodePart!: string // 最后的用户代码部分

  private _tokens!: string[] // 定义的tokens（lex送来的）
  private _operators!: string[] // 定义的运算符
  private _isRightAssociative!: boolean[] // 运算符是否为右结合，false表示为左结合
  private _nonterminals!: string[] // 定义的非终结符
  private _others!: string[] // 未事先定义的字符
  private _producers!: Producer[] // 定义的产生式
  private _startSymbol!: number // 开始符号，未指定会自动分配第一个
  private _symbols!: string[][] // 定义的符号
  // 第0行存储非终结符，第1行存储运算符，第2行存储tokens

  get producers() {
    return this._producers
  }

  get tokens() {
    return this._tokens
  }

  get operators() {
    return this._operators
  }

  get startSymbol() {
    return this._startSymbol
  }

  constructor(filePath: string) {
    this._symbols = [this._nonterminals, this._operators, this.tokens, this._others]
    this._tokens.push('$') // tokens0号位存储结束符
    this._filePath = filePath
    this._rawContent = fs
      .readFileSync(this._filePath)
      .toString()
      .replace(/\r\n/g, '\n') // 统一使用LF，没有CR
    this._splitContent = this._rawContent.split('\n')
    this._fillText()
    this._parseInfo()
    this._parseProducers()
  }

  /**
   * 分析信息部分
   */
  private _parseInfo() {
    this._operators = []
    this._tokens = []
    this._startSymbol = -1
    this._infoPart.split('\n').forEach((line) => {
      if (!line.trim()) return
      let words = line.split(/\s/)
      switch (words[0]) {
        case '%token':
          for (let i = 1; i < words.length; i++)
            !this._tokens.includes(words[i]) && this._tokens.push(words[i])
          break
        case '%left':
        case '%right':
          let isRight = words[0] == '%right'
          for (let i = 1; i < words.length; i++) {
            let opt = words[i]
            if (opt[0] == '\'') {
              assert(opt[opt.length-1] == '\'', `Open Quote: ${opt}`)
              opt = stringCook(opt.substring(1, opt.length-1))
            }
            let isRepetitive = this._operators.some((x) => x == opt)
            assert(!isRepetitive, `Operator redefined: ${opt}`)
            this._operators.push(opt)
            this._isRightAssociative.push(isRight)
          }
          break
        case '%start':
          for (let i = 1; i < words.length; i++) {
            assert(this._startSymbol < 0, `Start symbol redefined: ${words[i]}`)
            let index = this._nonterminals.indexOf(words[i])
            assert(index != -1, `Unknown symbol: ${words[i]}`)
            this._startSymbol = index
          }
          break
        default:
          assert(false, `Unknown declaration: ${words[0]}`)
      }
    })
    this._operators.reverse()
    this._isRightAssociative.reverse()
  }

  private _parseProducers() {
    let parseState = 0 // 解析过程所处的状态
    // 0：等待产生式左侧，1：正在读取产生式左侧，1.5：等冒号，2：正在读取产生式右侧非动作部分，3：正在读取动作部分，4：动作部分读取完成
    let buffer = "" // 字符缓存区
    let bslash = false // 是否转义
    let quot = false // 是否在引号中
    let producerLhs = "" // 产生式左侧缓存区
    let producerRhs: GrammarSymbol[] = [] // 产生式右侧缓存区
    let action = "" // 动作缓存区
    let braceLevel = 0 // 读取动作时处于第几层花括号内
    this._producers = []
    for (let char of this._producerPart) {
      if (parseState == 0) {
        // 正在等待产生式左侧
        if (char.trim()) {
          assert(char != ':', `Non-terminal can't be empty`)
          buffer += char
          parseState = 1
        }
      } else if (parseState == 1) {
        // 正在读取产生式左侧
        if (!char.trim() || char === ':') {
          // 产生式左侧读取完成
          producerLhs = buffer
          buffer = ''
          parseState = char === ':' ? 2 : 1.5
        } else {
          // 还在读
          buffer += char
          assert(/^\w+$/.test(char), `Invalid non-terminal: ${buffer}`)
        }
      } else if (parseState == 1.5) {
        // 等标志着开始产生式右边的冒号
        if (char == ':') parseState = 2
        else assert(!char.trim(), `Expect colon after ${producerLhs}`)
      } else if (parseState == 2) {
        // 在读产生式右侧非动作部分
        if (quot) {
          // 在引号内
          buffer += char
          if (char === '\\') {
            bslash = !bslash
          } else if (!bslash && char === "'") {
            assert(
              buffer.length <= 3 || (buffer.length == 4 && buffer[1] === '\\'),
              `Multiple characters between quotes: ${buffer}`
            )
            assert(buffer.length > 2, `No character beteween quotes: ${buffer}`)
            quot = false
            buffer = buffer.substring(1, buffer.length-1)
            // if (this._operators.includes(buffer))
            // producerRhs.push(buffer)
            // TODO: 对产生式右侧符号的处理需要修改以适应新的结构
            buffer = ''
          } else {
            bslash = false
          }
        } else if (!char.trim() || inStr(char, `;|{'`)) {
          // 完成一个符号的读取
          if (buffer.length) {
            // producerRhs.push(buffer)
            // TODO: 对产生式右侧符号的处理需要修改以适应新的结构
            buffer = ''
          }
          if (char === '{') {
            parseState = 3
            bslash = false
            quot = false
            braceLevel = 1
          } else if (char === "'") {
            buffer += char
            quot = true
          }
        } else buffer += char // 尚在读取
      } else if (parseState == 3) {
        // 正在读取动作部分
        if (quot) {
          // 在引号内
          action += char
          if (!bslash && inStr(char, `"'`)) quot = false
          else if (char === '\\') bslash = !bslash
          else bslash = false
        } else if (char === '}') {
          if (--braceLevel == 0) {
            // 动作部分读取完成
            quot = false
            bslash = false
            parseState = 4
          } else action += char
        } else if (inStr(char, `"'`)) {
          // 进入引号
          action += char
          quot = true
        } else {
          action += char
          if (char == '{') braceLevel++
        }
      } else if (parseState == 4 && char.trim() && char != '|' && char != ';') {
        assert(false, 'New producer before the previous ends.')
      }
      if ((parseState == 2 || parseState == 4) && inStr(char, `;|`)) {
        // 判断是否为新的非终结符
        if (!this._nonterminals.includes(producerLhs)) this._nonterminals.push(producerLhs)
        // 完成一条产生式
        this._producers.push(new Producer(
          {type: SymbolType.NONTERMINAL, index: this._nonterminals.indexOf(producerLhs)},
          [],//TODO
          action
        ))
        producerRhs = []
        action = ''
        if (char === '|') {
          // 仍使用当前的产生式左侧
          parseState = 2
        } else {
          parseState = 0
          producerLhs = ''
        }
      }
    }
    if (this._startSymbol == -1 && this._producers.length) {
      this._startSymbol = 0
    } else if (this._startSymbol >= 0) {
      assert(this._startSymbol < this._nonterminals.length, `Invalid start: ${this._startSymbol}`)
    }
  }

  /**
   * 填充各部分文本
   */
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
