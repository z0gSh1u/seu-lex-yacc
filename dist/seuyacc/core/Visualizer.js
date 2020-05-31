"use strict";
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-use-before-define */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 自动机可视化工具
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const childProcess = __importStar(require("child_process"));
/**
 * 可视化自动机
 * @param viewNow 是否立即打开浏览器查看
 */
// TODO:
function visualizeFA(viewNow = true) {
    let dumpObject = { nodes: [], edges: [] };
    // 计算布局并导出
    let dagreJSON = JSON.stringify(dumpObject, null, 2);
    const VisualizerPath = path_1.default.join(__dirname, '../../../enhance/Visualizer');
    const shape = 'circle';
    fs_1.default.writeFileSync(path_1.default.join(VisualizerPath, './data.js'), `window._seulex_shape = '${shape}'; let data = ${dagreJSON}`);
    // 启动浏览器显示
    viewNow && childProcess.exec(`start ${path_1.default.join(VisualizerPath, './index.html')} `);
}
exports.visualizeFA = visualizeFA;
