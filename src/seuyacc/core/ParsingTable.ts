/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * LR语法分析表
 * by Withod
 * 2020-05 @ https://github.com/Withod/seu-lex-yacc
 */

export type Action = {
  type: number // 行动种类，0：移进，1：归约，2：接受
  target: number // 行动的目标，移进到状态i或者用第i个产生式归约
}

export class ParsingTable {
  private actionChart: Action[][] // ACTION部分，这个结构已经不适用现在的想法(没法用一个数字表示终结符了)所以就当不存在
  private gotoChart: number[][] // GOTO部分，第i行第j列表示在第i个状态接收到第j个非终结符后要转移到的状态
}