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
const FA_1 = require("./FA");
const fs_1 = __importDefault(require("fs"));
const childProcess = __importStar(require("child_process"));
/**
 * 可视化自动机
 * @param viewNow 是否立即打开浏览器查看
 */
function visualizeFA(fa, viewNow = true) {
    let dumpObject = { nodes: [], edges: [] };
    // 设置点
    for (let i = 0; i < fa.states.length; i++) {
        dumpObject.nodes.push({
            label: i.toString(),
            color: fa.startStates.includes(fa.states[i])
                ? '#46A3FF'
                : fa.acceptStates.includes(fa.states[i])
                    ? '#00DB00'
                    : '#FFFFFF',
        });
    }
    // 设置边
    // TODO: 支持多边
    for (let i = 0; i < fa.transformAdjList.length; i++) {
        let transforms = fa.transformAdjList[i];
        for (let j = 0; j < transforms.length; j++) {
            dumpObject.edges.push({
                source: i.toString(),
                target: transforms[j].target.toString(),
                name: `${i}_${j}`,
                label: transforms[j].alpha < 0
                    ? FA_1.getSpAlpha(transforms[j].alpha)
                    : fa.alphabet[transforms[j].alpha],
            });
        }
    }
    // 计算布局并导出
    let dagreJSON = JSON.stringify(dumpObject, null, 2);
    fs_1.default.writeFileSync('enhance\\Visualizer\\data.js', `let data = ${dagreJSON}`);
    // 启动浏览器显示
    viewNow && childProcess.exec(`start enhance\\Visualizer\\index.html`);
}
exports.visualizeFA = visualizeFA;
