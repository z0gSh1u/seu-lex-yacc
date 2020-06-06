"use strict";
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-use-before-define */
Object.defineProperty(exports, "__esModule", { value: true });
const FA_1 = require("./FA");
const utils_1 = require("../../utils");
let lexParser;
let dfa;
/**
 * 根据.l文件解析器和最终DFA生成C代码
 */
function generateCode(_lexParser, _dfa) {
    ;
    (lexParser = _lexParser), (dfa = _dfa);
    utils_1.assert(dfa.startStates.length === 1, 'Too many DFA start states.');
    let finalCode = `  
  // ===========================================
  // |  Lexer generated by seulex              |
  // |  Visit github.com/z0gSh1u/seu-lex-yacc  |
  // ===========================================
  #define DEBUG_MODE 0
  // * ============== copyPart ================
  `;
    finalCode += lexParser.copyPart; // 用户直接复制部分
    finalCode += `
  // * ========== seulex generation ============
  `;
    finalCode += genPresetContent(); // seulex预置变量
    finalCode += genTransformMatrix(); // 状态转移矩阵
    finalCode += genSwitchCase(); // 状态与switch代号对应关系
    finalCode += genYYLEX(); // yylex函数
    finalCode += genYYLESSYYMORE(); // yyless和yymore
    finalCode += `
  // * ============== cCodePart ===============
  `;
    finalCode += lexParser.cCodePart; // 用户代码段部分
    return finalCode;
}
exports.generateCode = generateCode;
function genPresetContent() {
    // 关于这些变量的具体说明请参考文档
    return `
  #include <stdio.h>
  #include <stdlib.h>
  #include <string.h>
  #include "yy.tab.h"
  #define ECHO fprintf(yyout,"%s\\n",yytext);
  int yylineno = 1, yyleng = 0;
  FILE *yyin = NULL, *yyout = NULL;
  char yytext[1024] = {0};
  char _cur_buf[1024] = {0};
  int _cur_char = 0;
  const int _init_state = ${dfa.states.indexOf(dfa.startStates[0])};
  int _cur_state = _init_state, _cur_ptr = 0, _cur_buf_ptr = 0, _lat_acc_state = -1, _lat_acc_ptr = 0;
  int yywrap();
  `;
}
function genTransformMatrix() {
    // 128是ASCII码的数量，mat[i][k]表示在i状态收到k字符后转移到的状态
    let res = `const int _trans_mat[${dfa.states.length}][128] = {`;
    for (let i = 0; i < dfa.transformAdjList.length; i++) {
        let targets = Array(128).fill(-1); // -1表示没有此转移
        let othersTarget = -1; // 仍未设置转移的字符应转移到的状态
        for (let transform of dfa.transformAdjList[i]) {
            if (transform.alpha == FA_1.SpAlpha.OTHER || transform.alpha == FA_1.SpAlpha.ANY)
                othersTarget = transform.target;
            else
                targets[dfa.alphabet[transform.alpha].charCodeAt(0)] = transform.target;
        }
        // 设置other字符
        if (othersTarget != -1)
            for (let alpha in targets)
                if (targets[alpha] == -1)
                    targets[alpha] = othersTarget;
        res += targets.join(',') + ',';
    }
    res = res.substring(0, res.length - 1) + '};'; // 去掉多余的逗号
    // 格式化相关
    let formatRes = '', commaCount = 0;
    for (let i = 0; i < res.length; i++) {
        formatRes += res[i];
        if (res[i] === ',')
            commaCount += 1;
        if (res[i] === ',' && commaCount === 100) {
            commaCount = 0;
            formatRes += '\n';
        }
    }
    return formatRes + '\n';
}
function genSwitchCase() {
    // arr[j]=x(x>=0)表示是接收态，x是case编号，=-1表示不是接收态
    let res = `const int _swi_case[${dfa.states.length}] = {`;
    for (let i = 0; i < dfa.states.length; i++)
        if (dfa.acceptStates.includes(dfa.states[i]))
            res += `${i},`;
        else
            res += '-1,';
    res = res.substring(0, res.length - 1) + '};';
    return res;
}
function genYYLESSYYMORE() {
    return `
    void yyless(int n) {
      int delta = strlen(yytext) - n;
      fseek(yyin, -delta, SEEK_CUR);
      FILE *yyinCopy = yyin;
      while (delta--) fgetc(yyinCopy) == '\\n' && yylineno--;
    }
    void yymore() {
      char old[1024];
      strcpy(old, yytext);
      yylex();
      strcpy(yytext, strcat(old, yytext));
    }
  `;
}
function genYYLEX() {
    return `
    int yylex() {
      int rollbackLines = 0;
      if (yyout == NULL) yyout = stdout;
      if (_cur_char == EOF) {
        ${_('yywrap支持')}
        if (yywrap() == 1) return 0;
        else {
          yylineno = 1;
          yyleng = 0;
          memset(yytext, 0, sizeof(_cur_buf));
          memset(_cur_buf, 0, sizeof(_cur_buf));
          _cur_char = 0;
          _cur_state = _init_state, _cur_ptr = 0, _cur_buf_ptr = 0;
          _lat_acc_state = -1, _lat_acc_ptr = 0;
        }
      }
      ${_('不断进行状态转移')}
      while (_cur_state != -1) {
        _cur_char = fgetc(yyin); 
        if (DEBUG_MODE) printf("** YYLEX: ** %c | %d\\n", _cur_char, _cur_char);
        _cur_ptr++;
        if (_cur_char == '\\n') yylineno++, rollbackLines++;
        _cur_buf[_cur_buf_ptr++] = _cur_char;
        ${_('进行状态转移')}
        _cur_state = _trans_mat[_cur_state][_cur_char];
        ${_('如果到了接收状态，暂时记录下来，继续跑看看有没有更长的')}
        ${_('在这里记录的永远是当前看到的最长的；同长度情况下永远是最早出现的，因为后出现的不会覆盖')}
        if (_swi_case[_cur_state] != -1) {
          _lat_acc_state = _cur_state;
          _lat_acc_ptr = _cur_ptr - 1;
          rollbackLines = 0;
        }
      }
      ${_('把失败的多余匹配全部回退')}
      if (_lat_acc_state != -1) {
        fseek(yyin, _lat_acc_ptr - _cur_ptr + 1, SEEK_CUR);
        yylineno -= rollbackLines;
        _cur_ptr = _lat_acc_ptr;
        _cur_state = 0;
        _cur_buf[_cur_buf_ptr - 1] = '\\0';
        memset(yytext, 0, sizeof(yytext));
        yyleng = strlen(_cur_buf);
        strcpy(yytext, _cur_buf);
        memset(_cur_buf, 0, sizeof(_cur_buf));
        _cur_buf_ptr = 0;
        int _lat_acc_state_bak = _lat_acc_state;
        _lat_acc_state = -1;
        _lat_acc_ptr = 0;
        switch (_swi_case[_lat_acc_state_bak]) {
          ${genSwitchAction()}
        }
      } else return -1; // error
      return 0;
    }
  `;
}
function genSwitchAction() {
    var _a;
    // 生成各接收态下的动作
    let res = '';
    for (let state of dfa.acceptStates) {
        let index = dfa.states.indexOf(state);
        res += `
  case ${index}:
    ${(_a = dfa.acceptActionMap.get(state)) === null || _a === void 0 ? void 0 : _a.code}
    break;`;
    }
    res += `
  default:
    break;`;
    return res;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _(comment) {
    return '';
}
