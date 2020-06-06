"use strict";
/**
 * seuyacc CLI 工具
 * 使用：
 *    node <path_to_project>/dist/seuyacc/cli.js [yacc_file] [options]
 *    [options]:
 * github.com/z0gSh1u/seu-lex-yacc
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const YaccParser_1 = require("./core/YaccParser");
const LR1_1 = require("./core/LR1");
const CodeGenerator_1 = require("./core/CodeGenerator");
const beautify_1 = require("../../enhance/beautify");
const gcc_1 = require("../../enhance/gcc");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const args = require('minimist')(process.argv.slice(2));
// args looks like { _: [ 'example/md.l' ], v: true }
const tik = new Date().getTime();
if (args._.length === 0) {
    utils_1.stdoutPrint(`Missing argument [yacc_file].\n`);
}
else if (args._.length !== 1) {
    utils_1.stdoutPrint(`Too many arguments or .y file not specified.\n`);
}
else {
    utils_1.stdoutPrint(`[ Running... ]\n`);
    // 构建LR1并生成代码
    let finalCode = '';
    try {
        utils_1.stdoutPrint(`[ Parsing .y file... ]\n`);
        let yaccParser = new YaccParser_1.YaccParser(path_1.default.resolve('./', args._[0]));
        utils_1.stdoutPrint(`[ Building LR1... ]\n`);
        let lr1 = new LR1_1.LR1Analyzer(yaccParser);
        utils_1.stdoutPrint(`[ Generating code... ]\n`);
        finalCode = CodeGenerator_1.generateYTABC(yaccParser, lr1);
        utils_1.stdoutPrint(`[ Main work done! Start post-processing... ]\n`);
    }
    catch (e) {
        console.error(e);
    }
    // 后处理
    args.p && (finalCode = beautify_1.beautifyCCode(finalCode));
    // 输出c文件
    fs_1.default.writeFileSync(path_1.default.resolve('./', 'example/yy.seuyacc.c'), finalCode);
    // 调用GGC
    args.c && gcc_1.callGCC(path_1.default.resolve('./', 'example/yy.seuyacc.c'), args.c.length ? args.c.toString() : '');
}
utils_1.stdoutPrint(`[ All work done! ]\n`);
const tok = new Date().getTime();
utils_1.stdoutPrint(`[ Time consumed: ${tok - tik} ms. ]\n`);
