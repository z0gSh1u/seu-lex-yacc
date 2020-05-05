/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * 自动机可视化工具
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

import * as dagre from 'dagre'
import { FiniteAutomata } from './FA'
import fs from 'fs'
import * as childProcess from 'child_process'

/**
 * 可视化自动机
 * @param viewNow 是否立即打开浏览器查看
 */
export function visualizeFA(fa: FiniteAutomata, viewNow = true) {
  let g = new dagre.graphlib.Graph().setGraph({})
  // 设置点
  for (let i = 0; i < fa.states.length; i++) {
    g.setNode(i.toString(), {
      label: i.toString(),
    })
  }
  // 设置边
  for (let i = 0; i < fa.transformAdjList.length; i++) {
    let transforms = fa.transformAdjList[i]
    for (let j = 0; j < transforms.length; j++) {
      g.setEdge(i.toString(), transforms[j].target.toString(), {
        label:
          transforms[j].alpha === -1
            ? 'epsilon'
            : fa.alphabet[transforms[j].alpha],
      })
    }
  }
  /**
   * 重构graphlib导出的JSON以适应可视化工具
   */
  function formatGraphlibJSON(content: unknown) {
    let jsonObject = JSON.parse(content as string)
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
      }
    })
    // @ts-ignore
    jsonObject['edges'] = jsonObject['edges'].map((edge) => {
      return {
        source: edge.v,
        target: edge.w,
        label: edge.value.label,
      }
    })
    return JSON.stringify(jsonObject, null, 2)
  }
  // 计算布局并导出
  dagre.layout(g)
  let dagreJSON = formatGraphlibJSON(
    JSON.stringify(dagre.graphlib.json.write(g), null, 2)
  )
  fs.writeFileSync('enhance\\Visualizer\\data.js', `let data = ${dagreJSON}`)
  // 启动浏览器显示
  viewNow && childProcess.exec(`start enhance\\Visualizer\\index.html`)
}
