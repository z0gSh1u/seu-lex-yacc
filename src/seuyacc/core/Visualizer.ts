/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * 可视化工具
 * by z0gSh1u
 * 2020-05 @ https://github.com/z0gSh1u/seu-lex-yacc
 */

import fs from 'fs'
import path from 'path'
import * as childProcess from 'child_process'
import { LR1DFA } from './Grammar'
import { LR1Analyzer } from './LR1'

/**
 * 可视化GOTO图（LR1DFA）
 */
export function visualizeGOTOGraph(lr1dfa: LR1DFA, lr1Analyzer: LR1Analyzer, viewNow = true) {
  let dumpObject: {
    nodes: {
      key: string
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
  // 设置点（项目集）
  for (let i = 0; i < lr1dfa.states.length; i++) {
    let stateString = `I${i}\n=======\n`
    for (let item of lr1dfa.states[i].items) {
      stateString += lr1Analyzer.getSymbolById(item.producer.lhs).content
      stateString += ' -> '
      let j = 0
      for (; j < item.producer.rhs.length; j++) {
        if (j == item.dotPosition) stateString += '●'
        stateString += lr1Analyzer.getSymbolById(item.producer.rhs[j]).content + ' '
      }
      if (j == item.dotPosition)
        stateString = stateString.substring(0, stateString.length - 1) + '●'
      stateString += ' § '
      stateString += lr1Analyzer.getSymbolById(item.lookahead).content
      stateString += '\n'
    }
    dumpObject.nodes.push({ key: `K${i}`, label: stateString.trim(), color: '#FFFFFF' })
  }
  // 设置边（迁移）
  for (let i = 0; i < lr1dfa.states.length; i++) {
    lr1dfa.adjList[i].forEach(x => {
      dumpObject.edges.push({
        source: `K${i}`,
        target: `K${x.to}`,
        name: `K${i}_${x.to}`,
        label: lr1Analyzer.getSymbolById(x.alpha).content,
      })
    })
  }
  let dagreJSON = JSON.stringify(dumpObject, null, 2)
  const VisualizerPath = path.join(__dirname, '../../../enhance/Visualizer')
  const shape = 'rect'
  fs.writeFileSync(
    path.join(VisualizerPath, './data.js'),
    `window._seulex_shape = '${shape}'; let data = ${dagreJSON}`
  )
  // 启动浏览器显示
  viewNow && childProcess.exec(`start ${path.join(VisualizerPath, './index.html')} `)
}
