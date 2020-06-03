/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * LR语法分析
 * by Withod, z0gSh1u
 * 2020-05 @ https://github.com/Withod/seu-lex-yacc
 */

import { YaccParser } from './YaccParser'
import {
  LR1Producer,
  YaccParserProducer,
  SpSymbol,
  LR1DFA,
  LR1Item,
  LR1State,
  YaccParserOperator,
} from './Grammar'
import { assert, cookString, ASCII_MIN, ASCII_MAX } from '../../utils'

export type GrammarSymbol = {
  type: 'ascii' | 'token' | 'nonterminal' | 'sptoken'
  content: string
}

export class LR1Analyzer {
  private _symbols: GrammarSymbol[]
  private _operators: YaccParserOperator[]
  private _producers: LR1Producer[]
  private _startSymbol!: number
  private _dfa!: LR1DFA

  constructor(yaccParser: YaccParser) {
    this._symbols = []
    this._producers = []
    this._operators = [...yaccParser.operatorDecl]
    this._distributeId(yaccParser)
    this._convertProducer(yaccParser.producers)
    this.constructLR1DFA()
  }

  get symbols() {
    return this._symbols
  }
  get dfa() {
    return this._dfa
  }
  get producers() {
    return this._producers
  }

  /**
   * 为文法符号（终结符、非终结符、特殊符号）分配编号
   * @test pass
   */
  private _distributeId(yaccParser: YaccParser) {
    // 处理方式参考《Flex与Bison》P165
    // 0~127 ASCII文字符号编号
    // 128~X Token编号
    // X+1~Y 非终结符编号
    // Y+1~Y+3 特殊符号
    for (let i = 0; i < 128; i++)
      this._symbols.push({ type: 'ascii', content: String.fromCharCode(i) })
    // 标记一下ASCII中的不可打印字符
    for (let i = 0; i < ASCII_MIN; i++)
      this._symbols[i] = { type: 'ascii', content: '[UNPRINTABLE]' }
    this._symbols[ASCII_MAX + 1] = { type: 'ascii', content: '[UNPRINTABLE]' }
    for (let token of yaccParser.tokenDecl) this._symbols.push({ type: 'token', content: token })
    for (let nonTerminal of yaccParser.nonTerminals)
      this._symbols.push({ type: 'nonterminal', content: nonTerminal })
    for (let spSymbol of Object.values(SpSymbol)) this._symbols.push(spSymbol)
    this._startSymbol = this._getSymbolId({ type: 'nonterminal', content: yaccParser.startSymbol })
    assert(this._startSymbol != -1, 'LR1 startSymbol unset.')
    console.log(this._startSymbol)
  }

  /**
   * 获取编号后的符号的编号
   */
  _getSymbolId(grammarSymbol: {
    type?: 'ascii' | 'token' | 'nonterminal' | 'sptoken'
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
   * 判断符号是否是某个类型
   */
  private _symbolTypeIs(id: number, type: 'ascii' | 'token' | 'nonterminal' | 'sptoken') {
    return this._symbols[id].type === type
  }

  getSymbolString(id: number) {
    return this._symbolTypeIs(id, 'ascii')
      ? `'${this._symbols[id].content}'`
      : this._symbols[id].content
  }

  formatPrintProducer(producer: LR1Producer) {
    let lhs = this._symbols[producer.lhs].content
    let rhs = ``
    for (let r of producer.rhs) rhs += this.getSymbolString(r) + ' '
    return lhs + ' -> ' + rhs
  }

  /**
   * 求取FIRST集
   */
  FIRST(symbols: number[]): number[] {
    if (!symbols.length) return [this._getSymbolId(SpSymbol.EPSILON)]
    let ret: number[] = []
    if (!this._symbolTypeIs(symbols[0], 'nonterminal')) ret.push(symbols[0])
    else {
      // TODO: 在存在直接或间接左递归的情况下会进入死循环，需要解决办法
      this._producersOf(symbols[0]).forEach(producer => {
        this.FIRST(producer.rhs).forEach(symbol => {
          if (!ret.includes(symbol)) ret.push(symbol)
        })
      })
    }
    if (ret.includes(this._getSymbolId(SpSymbol.EPSILON))) {
      this.FIRST(symbols.slice(1)).forEach(symbol => {
        if (!ret.includes(symbol)) ret.push(symbol)
      })
    }
    return ret
  }

  /**
   * 求取FOLLOW集
   */
  private FOLLOW(nonterminal: number): number[] {
    let ret: number[] = []
    let epsilon = this._getSymbolId(SpSymbol.EPSILON)
    if (nonterminal == this._startSymbol) ret.push(this._getSymbolId(SpSymbol.END))
    for (let producer of this._producers) {
      for (let i = 0; i < producer.rhs.length; i++) {
        if (producer.rhs[i] == nonterminal) {
          let first = this.FIRST(producer.rhs.slice(i + 1))
          first.forEach(symbol => {
            if (symbol != epsilon && !ret.includes(symbol)) ret.push(symbol)
          })
          if (first.includes(epsilon) && nonterminal != producer.lhs) {
            this.FOLLOW(producer.lhs).forEach(symbol => {
              if (!ret.includes(symbol)) ret.push(symbol)
            })
          }
        }
      }
    }
    return ret
  }

  /**
   * 获取指定非终结符为左侧的所有产生式
   */
  private _producersOf(nonterminal: number) {
    let ret = []
    for (let producer of this._producers) if (producer.lhs == nonterminal) ret.push(producer)
    return ret
  }

  /**
   * 将产生式转换为单条存储的、数字->数字[]形式
   * @test pass
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
          let tmp = char[0],
            id
          if (/'.+'/.test(char[0])) {
            tmp = char[0].substring(1, char[0].length - 1)
            if (tmp[0] == '\\') tmp = cookString(tmp)
            id = this._getSymbolId({ type: 'ascii', content: tmp })
          } else {
            let a = this._getSymbolId({ type: 'nonterminal', content: tmp }),
              b = this._getSymbolId({ type: 'token', content: tmp })
            id = id ? id : a != -1 ? a : b != -1 ? b : -1
          }
          assert(id != -1, 'symbol not found in symbols. This error should never occur.')
          rhs.push(id)
        }
        this._producers.push(new LR1Producer(lhs, rhs, stringProducer.actions[index]))
      }
    }
  }

  constructLR1DFA() {
    // 将C初始化为 {CLOSURE}({|S'->S, $|})
    let initProducer = this._producersOf(this._startSymbol)[0]
    let I0 = this.CLOSURE(
      new LR1State([
        new LR1Item(
          initProducer,
          this._producers.indexOf(initProducer),
          this._getSymbolId(SpSymbol.END)
        ),
      ])
    )
    // 初始化自动机
    let dfa = new LR1DFA(0)
    dfa.addState(I0)
    let stack = [0]
    while (stack.length) {
      let I = dfa.states[stack.pop() as number] // for C中的每个项集I
      for (let X = 0; X < this._symbols.length; X++) {
        //for 每个文法符号X
        let gotoIX = this.GOTO(I, X)
        if (gotoIX.items.length === 0) continue // gotoIX要非空
        const sameStateCheck = dfa.states.findIndex(x => LR1State.same(x, gotoIX)) // 存在一致状态要处理
        if (sameStateCheck !== -1) {
          dfa.link(dfa.states.indexOf(I), sameStateCheck, X)
        } else {
          // 新建状态并连接
          dfa.addState(gotoIX)
          dfa.link(dfa.states.indexOf(I), dfa.states.length - 1, X)
          stack.push(dfa.states.length - 1)
        }
      }
    }
    this._dfa = dfa
  }

  /**
   * 求取GOTO(I, X)
   * 见龙书算法4.53
   */
  private GOTO(I: LR1State, X: number) {
    let J = new LR1State([])
    for (let item of I.items) {
      // for I中的每一个项
      if (item.dotAtLast()) continue
      if (this._producers[item.producer].rhs[item.dotPosition] === X) {
        J.addItem(LR1Item.copy(item, true))
      }
    }
    return this.CLOSURE(J)
  }

  /**
   * 求取CLOSURE(I)（I为某状态）
   * 见龙书算法4.53
   */
  private CLOSURE(I: LR1State) {
    let res = LR1State.copy(I)
    let allItemsOfI = [...I.items] // for I中的每一个项
    while (allItemsOfI.length) {
      let oneItemOfI = allItemsOfI.pop() as LR1Item
      if (oneItemOfI.dotAtLast()) continue // 点号到最后，不能扩展
      let currentSymbol = this._producers[oneItemOfI.producer].rhs[oneItemOfI.dotPosition]
      if (!this._symbolTypeIs(currentSymbol, 'nonterminal')) continue // 非终结符打头才有CLOSURE
      let extendProducers = []
      for (let producerInG of this._producers) // for G'中的每个产生式
        producerInG.lhs === currentSymbol && extendProducers.push(producerInG) // 左手边是当前符号的，就可以作为扩展用
      let lookahead = oneItemOfI.lookahead
      for (let extendProducer of extendProducers) {
        // 求取新的展望符号
        let newLookaheads = this.FIRST(
          this._producers[oneItemOfI.producer].rhs.slice(oneItemOfI.dotPosition)
        )
        // 存在epsilon作为FIRST符，可以用它“闪过”
        if (newLookaheads.includes(this._getSymbolId(SpSymbol.EPSILON))) {
          newLookaheads = newLookaheads.filter(v => v != this._getSymbolId(SpSymbol.EPSILON))
          !newLookaheads.includes(lookahead) && newLookaheads.push(lookahead) // 闪过，用旧的展望符号
        }
        // for FIRST(βa)中的每个终结符号b
        for (let lookahead of newLookaheads) {
          // TODO: 这里可能为同一产生式生成多个item
          let newItem = new LR1Item(
            extendProducer,
            this._producers.indexOf(extendProducer),
            lookahead
          )
          if (I.items.some(item => LR1Item.same(item, newItem))) continue // 重复的情况不再添加，避免出现一样的Item
          allItemsOfI.push(newItem) // 继续扩展
          res.addItem(newItem)
        }
      }
    }
    return res
  }

  toACTIONGOTOTable() {
    type ACTIONCell = {
      type: 'shift' | 'reduce' | 'acc'
      meet: number
      data: number // state or producer
    }
    let ACTIONTable: ACTIONCell[][] = [],
      GOTOTable: number[][] = []
    for (let i = 0; i < this._dfa.states.length; i++) {
      let ACTION: ACTIONCell[] = [],
        GOTO: number[] = []
      for (let j = 0; j < this._dfa.adjList[i].length; j++) {
        let edge = this._dfa.adjList[i][j]
        // 处理SHIFT
        // GOTO表指示的是非终结符
        if (this._symbolTypeIs(edge.alpha, 'nonterminal')) {
          GOTO.push(edge.to)
        } else {
          ACTION.push({ type: 'shift', meet: edge.alpha, data: edge.to })
        }
      }
      for (let j = 0; j < this._dfa.states[j].items.length; j++) {
        let item = this._dfa.states[j].items[j]
        if (item.dotAtLast()) {
          // 点到最后才可能规约
          let lookahead = item.lookahead
          if (lookahead === this._getSymbolId(SpSymbol.END)) {
            // almost finish
          } else {
            let conflictPos = -1
            // 解决移进-规约冲突
            for (let cell of ACTION) {
              if (cell.type === 'shift' && cell.meet === lookahead) {
              }
            }
          }
        }
      }

      ACTIONTable.push(ACTION)
      GOTOTable.push(GOTO)
    }
  }
}
