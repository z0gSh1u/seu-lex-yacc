/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * GOTO图
 * by Withod
 * 2020-05 @ https://github.com/Withod/seu-lex-yacc
 */

import { GrammarSymbol } from "./Grammar";

export type Term = {
  producerIndex: number // 产生式的下标
  dotPos: number // 点的位置，i表示在产生式右侧第i个符号左侧
  lookForward: GrammarSymbol[] // 向前看符号
}

export class GotoGraph {
  private _termSets: Term[][] // 项集们
  private _transformAdjList: [] // 项集间转移的矩阵，这个结构已经不适用现在的想法(没法用一个数字表示文法符号了)所以就当不存在
}