"use strict";
/* eslint-disable @typescript-eslint/no-use-before-define */
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("./Grammar");
/**
 * 生成Token编号供Lex使用
 */
function generateYTABH(analyzer) {
    function _generateTokenId() {
        let res = ``;
        for (let i = 0; i < analyzer.symbols.length; i++)
            if (analyzer.symbols[i].type == 'sptoken' || analyzer.symbols[i].type == 'token')
                res += `#define ${analyzer.symbols[i].content} ${i}\n`;
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
function genPresetContent(analyzer) {
    return `
  #include <stdio.h>
  #include <stdlib.h>
  #include <string.h>
  #define STACK_LIMIT 1000
  #define SYMBOL_CHART_LIMIT 10000
  #define SYMBOL_ATTR_LIMIT 10000
  #define STATE_STACK_LIMIT 10000
  #define YACC_NOTHING -1
  #define YACC_ACCEPT -42
  ${genExceptions()}
  ${genExtern()}
  int stateStack[STACK_LIMIT];
  int stateStackSize = 0;
  int debugMode = 0;
  int EOFIndex = ${analyzer._getSymbolId(Grammar_1.SpSymbol.END)};
  char *symbolAttr[SYMBOL_ATTR_LIMIT];
  int symbolAttrSize = 0;
  char *curAttr = NULL;
  FILE *treeout = NULL;
  ${genSymbolChartClass()}
  ${genNode()}
  ${genFunctions()}
  `;
}
function genExceptions() {
    return `
  void ArrayUpperBoundExceeded(void) {
    printf("Array upper bound exceeded!");
  }
  void ArrayLowerBoundExceeded(void) {
    printf("Array lower bound exceeded!");
  }
  void SomethingRedefined(void) {
    printf("Something redefined!");
  }
  void SyntaxError(void) {
    printf("Syntax error!");
  }
  void throw(void (*func)(void)) {
    atexit(func);
    exit(EXIT_FAILURE);
  }
  `;
}
function genExtern() {
    return `
  extern FILE *yyin;
  extern char yytext[];
  extern int yylex();
  extern FILE *yyout;
  `;
}
function genSymbolChartClass() {
    return `
  struct SymbolChart {
    int symbolNum;
    char *name[SYMBOL_CHART_LIMIT];
    char *value[SYMBOL_CHART_LIMIT];
  }symbolChart = {.symbolNum = 0};
  char *variable(char *name) {
    for (int i = 0; i < symbolChart.symbolNum; i++) {
      if (strcmp(name, symbolChart.name[i]) == 0)
        return symbolChart.value[i];
    }
    return NULL;
  }
  void createVariable(char *name, char *value) {
    if (symbolChart.symbolNum >= SYMBOL_CHART_LIMIT) throw(ArrayUpperBoundExceeded);
    if (variable(name) != NULL) throw(SomethingRedefined);
    symbolChart.name[symbolChart.symbolNum] = (char *)malloc(strlen(name) * sizeof(char));
    symbolChart.value[symbolChart.symbolNum] = (char *)malloc(strlen(value) * sizeof(char));
    strcpy(symbolChart.name[symbolChart.symbolNum], name);
    strcpy(symbolChart.value[symbolChart.symbolNum], value);
    symbolChart.symbolNum++;
  }
  `;
}
function genNode() {
    return `
  struct Node {
    char *yytext;
    struct Node *children[SYMBOL_CHART_LIMIT];
    int childNum;
  }*nodes[SYMBOL_CHART_LIMIT];
  int nodeNum = 0;
  void reduceNode(int num) {
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    newNode->childNum = num;
    newNode->yytext = (char *)malloc(sizeof(char) * strlen(curAttr));
    strcpy(newNode->yytext, curAttr);
    for (int i = 1; i <= num; i++) {
      newNode->children[num-i] = nodes[nodeNum-i];
      nodes[nodeNum-i] = NULL;
    }
    nodeNum = nodeNum - num;
    nodes[nodeNum++] = newNode;
  }
  `;
}
function genFunctions() {
    return `
  void updateSymbolAttr(int popNum) {
    char *temp = (char *)malloc(sizeof(char) * strlen(curAttr));
    strcpy(temp, curAttr);
    while (popNum--) {
      if (symbolAttrSize == 0) throw(ArrayLowerBoundExceeded);
      free(symbolAttr[--symbolAttrSize]);
    }
    if (symbolAttrSize >= SYMBOL_ATTR_LIMIT) throw(ArrayUpperBoundExceeded);
    symbolAttr[symbolAttrSize] = (char *)malloc(strlen(temp) * sizeof(char));
    strcpy(symbolAttr[symbolAttrSize++], temp);
  }
  int stateStackPop(int popNum) {
    while (popNum--) {
      if (stateStackSize == 0) throw(ArrayLowerBoundExceeded);
      stateStackSize--;
    }
    if (stateStackSize == 0) return YACC_NOTHING;
    else return stateStack[stateStackSize - 1];
  }
  void stateStackPush(int state) {
    if (stateStackSize >= STATE_STACK_LIMIT) throw(ArrayUpperBoundExceeded);
    stateStack[stateStackSize++] = state;
  }
  `;
}
function genTable(analyzer) {
    let code = `
  struct TableCell {
    int action;
    int target;
  };
  struct TableCell table[${analyzer.dfa.states.length}][${analyzer.symbols.length}] = {`;
    for (let state = 0; state < analyzer.dfa.states.length; state++) {
        let nonCnt = 0;
        let nonnonCnt = 0;
        for (let symbol = 0; symbol < analyzer.symbols.length; symbol++) {
            let action = -1;
            let target = 0;
            if (analyzer.symbols[symbol].type == 'nonterminal') {
                action = 1;
                target = analyzer.GOTOTable[state][nonCnt++];
            }
            else {
                switch (analyzer.ACTIONTable[state][nonnonCnt].type) {
                    case 'shift':
                        action = 2;
                        target = analyzer.ACTIONTable[state][nonnonCnt].data;
                        break;
                    case 'reduce':
                        action = 3;
                        target = analyzer.ACTIONTable[state][nonnonCnt].data;
                        break;
                    case 'acc':
                        action = 4;
                        break;
                    default:
                        action = 0;
                }
                nonnonCnt++;
            }
            code += `(struct TableCell){${action}, ${target}},`;
        }
    }
    code = code.substr(0, code.length - 1);
    code += `};
  `;
    return code;
}
function genDealWithFunction(analyzer) {
    let code = `
  int dealWith(int symbol) {
    if (stateStackSize < 1) throw(ArrayLowerBoundExceeded);
    if (debugMode) printf("Received symbol no.%d\\n", symbol);
    int state = stateStack[stateStackSize - 1];
    struct TableCell cell = table[state][symbol];
    switch(cell.action) {
      case 0:
        return YACC_NOTHING;
      case 4:
        return YACC_ACCEPT;
      case 1:
        if (debugMode) printf("Go to state %d\\n", cell.target);
        stateStackPush(cell.target);
        return YACC_NOTHING;
      case 2:
        stateStackPush(cell.target);
        if (debugMode) printf("Shift to state %d\\n", cell.target);
        curAttr = yytext;
        nodes[nodeNum] = (struct Node *)malloc(sizeof(struct Node));
        nodes[nodeNum]->yytext = (char *)malloc(sizeof(char) * strlen(curAttr));
        strcpy(nodes[nodeNum]->yytext, curAttr);
        nodes[nodeNum]->childNum = 0;
        nodeNum++;
        updateSymbolAttr(0);
        return YACC_NOTHING;
      case 3:
        if (debugMode) printf("Reduce by producer %d\\n", cell.target);
        switch (cell.target) {
          `;
    for (let index in analyzer.producers) {
        let producer = analyzer.producers[index];
        code += `case ${index}:
      curAttr = (char *)malloc(1024 * sizeof(char));
      ${actionCodeModified(producer.action, producer.rhs.length)}
      stateStackPop(${producer.rhs.length});
      reduceNode(${producer.rhs.length});
      updateSymbolAttr(${producer.rhs.length});
      dealWith(${producer.lhs});
      return symbol;
    `;
    }
    code += `
        }
      default:
        return symbol;
    }
    return YACC_NOTHING;
  }
  `;
    return code;
}
function actionCodeModified(action, producerLen) {
    let bslash = false, inSQuot = false, inDQuot = false, dollar = false, buffer = '', ret = '';
    action.split('').forEach(c => {
        if (dollar) {
            if (c == '$')
                (ret += 'curAttr'), (dollar = false);
            else if (c.charCodeAt(0) >= '0'.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0))
                buffer += c;
            else {
                let num = parseInt(buffer);
                if (num < 1 || num > producerLen)
                    ret += '$' + buffer;
                else
                    ret += `symbolAttr[symbolAttrSize-${producerLen - num + 1}]`;
                ret += c;
                dollar = false;
                buffer = '';
            }
        }
        else {
            if (!inSQuot && !inDQuot && !dollar && c == '$')
                dollar = true;
            else if (!inDQuot && !bslash && c == "'")
                inSQuot = !inSQuot;
            else if (!inSQuot && !bslash && c == '"')
                inDQuot = !inDQuot;
            else if (c == '\\')
                bslash = !bslash;
            else
                bslash = false;
            if (c != '$')
                ret += c;
        }
    });
    return ret;
}
function genPrintTree() {
    return `
  void printTree(struct Node *curNode, int depth) {
    if (curNode == NULL) return;
    for (int i = 0; i < depth * 2; i++)
      fprintf(treeout, "%c", ' ');
    fprintf(treeout, "%s", curNode->yytext);
    if (curNode->childNum < 1) return;
    fprintf(treeout, "{\\n");
    for (int i = 0;i < curNode->childNum; i++) {
      printTree(curNode->children[i], depth+1);
      if (i+1 < curNode->childNum)
        fprintf(treeout, ",");
      fprintf(treeout, "\\n");
    }
    for (int i = 0; i < depth * 2; i++)
      fprintf(treeout, "%c", ' ');
    fprintf(treeout, "}");
  }
  `;
}
function genYaccParse(analyzer) {
    return `
  int yyparse() {
    if (yyout == NULL) yyout = stdout;
    int token;
    stateStackPush(${analyzer.dfa.startStateId});
    while (token != YACC_ACCEPT && (token = yylex())) {
      do {
        token = dealWith(token);
      } while (token >= 0);
    }
    if (token == 0) {
      token = EOFIndex;
      do {
        token = dealWith(token);
      } while (token >= 0);
    }
    strcpy(yytext, curAttr);
    if (token == YACC_ACCEPT) {
      treeout = fopen("yacc.tree", "w");
      printTree(nodes[0], 0);
      fclose(treeout);
      return 0;
    }
    else return 1;
  }
  `;
}
/**
 * 生成语法分析器
 */
function generateYTABC(yaccParser, analyzer) {
    let finalCode = `  
  // ===========================================
  // |  YTABC generated by seuyacc             |
  // |  Visit github.com/z0gSh1u/seu-lex-yacc  |
  // ===========================================
  #define DEBUG_MODE 0
  // * ============== copyPart ================
  `;
    finalCode += yaccParser.copyPart; // 用户之间复制部分
    finalCode += `
  // * ========== seuyacc generation ============
  `;
    finalCode += genPresetContent(analyzer);
    finalCode += genTable(analyzer);
    finalCode += genDealWithFunction(analyzer);
    finalCode += genPrintTree();
    finalCode += genYaccParse(analyzer);
    finalCode += yaccParser.userCodePart;
    return finalCode;
}
exports.generateYTABC = generateYTABC;
