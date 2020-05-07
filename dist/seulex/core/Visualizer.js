"use strict";
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-use-before-define */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 自动机可视化工具
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */
const dagre = __importStar(require("dagre"));
const fs_1 = __importDefault(require("fs"));
const childProcess = __importStar(require("child_process"));
/**
 * 可视化自动机
 * @param viewNow 是否立即打开浏览器查看
 */
function visualizeFA(fa, viewNow = true) {
    let g = new dagre.graphlib.Graph().setGraph({});
    // 设置点
    for (let i = 0; i < fa.states.length; i++) {
        g.setNode(i.toString(), {
            label: i.toString(),
        });
    }
    // 设置边
    for (let i = 0; i < fa.transformAdjList.length; i++) {
        let transforms = fa.transformAdjList[i];
        for (let j = 0; j < transforms.length; j++) {
            g.setEdge(i.toString(), transforms[j].target.toString(), {
                label: transforms[j].alpha === -1
                    ? 'epsilon'
                    : fa.alphabet[transforms[j].alpha],
            });
        }
    }
    /**
     * 重构graphlib导出的JSON以适应可视化工具
     */
    function formatGraphlibJSON(content) {
        let jsonObject = JSON.parse(content);
        // @ts-ignore
        jsonObject['nodes'] = jsonObject['nodes'].map((node) => {
            return {
                label: node.value.label,
                x: node.value.x,
                y: node.value.y,
                // 给开始、接收态指定特别的样式
                color: fa.startStates.includes(fa.states[parseInt(node.value.label)])
                    ? 'skyblue'
                    : fa.acceptStates.includes(fa.states[parseInt(node.value.label)])
                        ? '#00DB00'
                        : '#fff',
            };
        });
        // @ts-ignore
        jsonObject['edges'] = jsonObject['edges'].map((edge) => {
            return {
                source: edge.v,
                target: edge.w,
                label: edge.value.label,
            };
        });
        return JSON.stringify(jsonObject, null, 2);
    }
    // 计算布局并导出
    dagre.layout(g);
    let dagreJSON = formatGraphlibJSON(JSON.stringify(dagre.graphlib.json.write(g), null, 2));
    fs_1.default.writeFileSync('enhance\\Visualizer\\data.js', `let data = ${dagreJSON}`);
    // 启动浏览器显示
    viewNow && childProcess.exec(`start enhance\\Visualizer\\index.html`);
}
exports.visualizeFA = visualizeFA;
