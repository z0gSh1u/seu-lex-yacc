import { YaccParser } from './YaccParser'
import { LR1Analyzer } from './LR1'

/**
 * 生成Token编号供Lex使用
 */
export function generateYTABH(yaccParser: YaccParser) {
  function _generateTokenId() {
    let res = ``
    for (let i = 0; i < yaccParser.tokenDecl.length; i++)
      res += `#define ${yaccParser.tokenDecl[i]} ${i + 1}\n`
    return res
  }
  let res = `
  #ifndef Y_TAB_H_
  #define Y_TAB_H_
  ${_generateTokenId()}
  #endif
  `
  return res
}

/**
 * 生成语法分析器
 */
export function generateYTABC(yaccParser: YaccParser, analyzer: LR1Analyzer) {
  function _generateStructs() {
    return `
    struct _seulex_stack {
      struct _seulex_node* head;
      int size;
    }
    `
  }
}
