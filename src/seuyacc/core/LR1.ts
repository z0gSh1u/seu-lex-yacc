/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * LR语法分析表
 * by Withod, z0gSh1u
 * 2020-05 @ https://github.com/Withod/seu-lex-yacc
 */

import { YaccParser } from './YaccParser'
import { LR1Producer, YaccParserProducer } from './Grammar'
import { assert, cookString, ASCII_MIN, ASCII_MAX } from '../../utils'

type GrammarSymbol = {
  type: 'ascii' | 'token' | 'nonterminal'
  content: string
}

/**
 *             LR1DFA
 *  LR1ItemSet
 *  _________
 * |         |
 * | LR1Item |
 * | LR1Item | -----> ...
 * | ...     |
 * |_________|
 */

/**
 * LR1项目
 */
export class LR1Item {
  private _producer: LR1Producer
  private _dotPosition: number // 点号位置，规定0号位为最左（所有符号之前）位置
  // Symbols:  a b c
  // DotPos:  0 1 2 3
  private _lookAheads: number[] // 展望符
}
/**
 * LR1项目集（LR1自动机状态）
 */
export class LR1ItemSet {
  private _stateId: number
  private _edges: { target: number; token: number }[]
  private _items: LR1Item[]
}
/**
 * LR1项目集族（LR1自动机）
 */
export class LR1DFA {
  private _startStateId: number
  private _states: LR1ItemSet[]
}

export class LR1Analyzer {
  private _symbols: GrammarSymbol[]
  private _symbolRange: [number, number, number, number]
  private _producers: LR1Producer[]
  private _startSymbol!: number

  get symbols() {
    return this._symbols
  }

  constructor(yaccParser: YaccParser) {
    this._symbols = []
    // @ts-ignore
    this._symbolRange = []
    this._producers = []
    this._distributeId(yaccParser)
    this._convertProducer(yaccParser.producers)
  }

  /**
   * 为符号分配编号
   */
  private _distributeId(yaccParser: YaccParser) {
    // 处理方式参考《Flex与Bison》P165
    // 0~127 ASCII，文字符号编号
    // 128~X Token编号
    // X+1~Y 非终结符编号
    for (let i = 0; i < 128; i++)
      this._symbols.push({ type: 'ascii', content: String.fromCharCode(i) })
    // 标记一下ASCII中的不可打印字符
    for (let i = 0; i < ASCII_MIN; i++)
      this._symbols[i] = { type: 'ascii', content: '[UNPRINTABLE]' }
    this._symbols[ASCII_MAX + 1] = { type: 'ascii', content: '[UNPRINTABLE]' }
    this._symbolRange.push(0, 128)
    for (let token of yaccParser.tokenDecl) this._symbols.push({ type: 'token', content: token })
    this._symbolRange.push(this._symbols.length)
    for (let nonTerminal of yaccParser.nonTerminals)
      this._symbols.push({ type: 'nonterminal', content: nonTerminal })
    this._symbolRange.push(this._symbols.length)
    this._startSymbol = this._getSymbolId({ content: yaccParser.startSymbol })
    assert(this._startSymbol, 'LR1 startSymbol unset.')
  }

  /**
   * 获取编号后的符号的编号
   */
  private _getSymbolId(grammarSymbol: {
    type?: 'ascii' | 'token' | 'nonterminal'
    content: string
  }) {
    for (let i = 0; i < this._symbols.length; i++)
      if (
        (!grammarSymbol.type ? true : this._symbols[i].type === grammarSymbol.type) &&
        this._symbols[i].content === grammarSymbol.content
      )
        return i
    return -1
  }

  /**
   * 将产生式转换为单条存储的、数字->数字[]形式
   */
  private _convertProducer(stringProducers: YaccParserProducer[]) {
    for (let stringProducer of stringProducers) {
      let lhs = this._getSymbolId({ type: 'nonterminal', content: stringProducer.lhs })
      assert(lhs != -1, 'lhs not found in symbols. This error should never occur.')
      for (let [index, right] of stringProducer.rhs.entries()) {
        let rhs = [],
          PATTERN = new RegExp(/(' '|[^ ]+)/g),
          char
        while ((char = PATTERN.exec(right))) {
          let tmp = char[0]
          if (/'.+'/.test(char[0])) {
            tmp = char[0].substring(1, char[0].length - 1)
            if (tmp[0] == '\\') tmp = cookString(tmp)
          }
          let id = this._getSymbolId({ content: tmp })
          rhs.push(id)
        }
        this._producers.push(new LR1Producer(lhs, rhs, stringProducer.actions[index]))
      }
    }
  }

  private epsilonClosure(states: LR1Item[]) {
    let stack = [...states] // 深搜辅助栈
    
  }

  private firstSet() {
    return
  }
}
