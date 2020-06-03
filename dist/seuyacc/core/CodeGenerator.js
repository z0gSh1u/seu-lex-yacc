"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 生成Token编号供Lex使用
 */
function generateYTABH(yaccParser) {
    function _generateTokenId() {
        let res = ``;
        for (let i = 0; i < yaccParser.tokenDecl.length; i++)
            res += `#define ${yaccParser.tokenDecl[i]} ${i + 1}\n`;
        return res;
    }
    let res = `
  #ifndef Y_TAB_H_
  #define Y_TAB_H_
  ${_generateTokenId()}
  #endif
  `;
    return res;
}
exports.generateYTABH = generateYTABH;
/**
 * 生成语法分析器
 */
function generateYTABC(yaccParser, analyzer) {
    function _generateStructs() {
        return `
    struct _seulex_stack {
      struct _seulex_node* head;
      int size;
    }
    `;
    }
}
exports.generateYTABC = generateYTABC;
