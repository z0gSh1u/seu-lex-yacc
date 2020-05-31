/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * 自动机可视化工具
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

import fs from 'fs'
import path from 'path'
import * as childProcess from 'child_process'

/**
 * 可视化自动机
 * @param viewNow 是否立即打开浏览器查看
 */
// TODO:
export function visualizeFA(viewNow = true) {
  let dumpObject: {
    nodes: {
      label: string
      color: string
    }[]
    edges: {
      source: string
      target: string
      name: string
      label: string
    }[]
  } = { nodes: [], edges: [] }
  // 计算布局并导出
  let dagreJSON = JSON.stringify(dumpObject, null, 2)
  const VisualizerPath = path.join(__dirname, '../../../enhance/Visualizer')
  const shape = 'circle'
  fs.writeFileSync(
    path.join(VisualizerPath, './data.js'),
    `window._seulex_shape = '${shape}'; let data = ${dagreJSON}`
  )
  // 启动浏览器显示
  viewNow && childProcess.exec(`start ${path.join(VisualizerPath, './index.html')} `)
}
