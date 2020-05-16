"use strict";
/**
 * seulex CLI 工具
 * 使用：
 *    bin/seulex.cmd [lex_file] [options]
 *    [options]:
 *      -p: 美化生成的C代码。
 *      -c: 在生成代码后自动调用gcc编译。如果需要补充gcc参数，请使用"-c <supplement>"（保留引号）。
 *      -v: 可视化最终DFA。
 * github.com/z0gSh1u/seu-lex-yacc
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const CodeGenerator_1 = require("./core/CodeGenerator");
const LexParser_1 = require("./core/LexParser");
const beautify_1 = require("../../enhance/beautify");
const gcc_1 = require("../../enhance/gcc");
const Visualizer_1 = require("./core/Visualizer");
const DFA_1 = require("./core/DFA");
const NFA_1 = require("./core/NFA");
const Regex_1 = require("./core/Regex");
// eslint-disable-next-line @typescript-eslint/no-var-requires
let args = require('minimist')(process.argv.slice(2));
// args looks like { _: [ 'example/md.l' ], v: true }
if (args._.length === 0) {
    utils_1.stdoutPrint(`Missing argument [lex_file].\n`);
}
else if (args._.length !== 1) {
    utils_1.stdoutPrint(`Too many arguments or .l file not specified.\n`);
}
else {
    utils_1.stdoutPrint(`[ Running... ]\n`);
    // 构建最终DFA
    const lexParser = new LexParser_1.LexParser(path_1.default.join(__dirname, args._[0]));
    let atomNFAs = [];
    for (let key in lexParser.actions)
        atomNFAs.push(NFA_1.NFA.fromRegex(new Regex_1.Regex(key)));
    let dfa = new DFA_1.DFA(NFA_1.NFA.parallelAll(...atomNFAs));
    // 代码生成
    let finalCode = CodeGenerator_1.generateCode(lexParser, dfa);
    // 后处理
    args.p && (finalCode = beautify_1.beautifyCCode(finalCode));
    // 输出c文件
    fs_1.default.writeFileSync(path_1.default.join('./', 'yy.seulex.c'), finalCode);
    // 调用GGC
    args.c &&
        gcc_1.callGCC(path_1.default.join('./', 'yy.seulex.c'), args.c.length ? args.c.toString() : '');
    // 可视化DFA
    args.v && Visualizer_1.visualizeFA(dfa);
}
//# sourceMappingURL=cli.js.map