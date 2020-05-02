import { FiniteAutomata, State } from './FA'

/**
 * 非确定有限状态自动机
 */
export class NFA extends FiniteAutomata {
  /**
   * 构造一个形如`->0 --a--> [1]`的NFA（两个状态，之间用初始字母连接）
   */
  constructor(initAlpha?: string) {
    super()
    this._startStates = initAlpha ? [new State()] : [] // 开始状态
    this._acceptStates = initAlpha ? [new State()] : [] // 接收状态
    this._states = [...this._startStates, ...this._acceptStates] // 全部状态
    this._alphabet = initAlpha ? [initAlpha] : [] // 字母表
    this._transformMatrix = initAlpha // 状态转移矩阵
      ? [[{ alpha: 0, target: 1 }]]
      : [[]] // TODO: or []?
  }

  /**
   * 尝试识别字符串
   * @param sentence 待识别字符串，请打散成char[]
   */
  test(sentence: string[]) {
    // 试验每一个开始状态
    for (let startState of this._startStates) {
      let currentState = startState, // 本轮深搜当前状态
        matchedWordCount = 0, // 符合的字符数
        history: State[] = [] // DFS辅助数组，记录历史状态
      while (matchedWordCount <= sentence.length) {
        if (
          // 目前匹配了全句
          matchedWordCount === sentence.length &&
          // 并且目前已经到达接收态
          this.hasReachedAcceptStates(currentState)
        ) {
          return true
        } else if (matchedWordCount === sentence.length) {
          // 全部匹配完成但是未到达接收态，说明应换一个开始状态再次试验
          break
        } else {
          if (this._alphabet.indexOf(sentence[matchedWordCount]) === -1) {
            // 字母表不存在该字符
            return false
          } else {
            let isWordRecognized = this.expand(
              currentState,
              matchedWordCount,
              history
            )
            if (isWordRecognized) {
              matchedWordCount += 1
            }
          }
        }
        if (!history.length) {
          break
        } else {
          currentState = history.pop() as State
        }
      }
    }
    return false
  }

  expand(state: State, alpha: number, stack: State[]) {
    let stateRow = this._transformMatrix[this._states.indexOf(state)]
    let states: State[] = []
    let isWordRecognized = false
    for (let transfrom of stateRow) {
      if (transfrom.alpha === alpha) {
        states.push(this._startStates[transfrom.target])
        isWordRecognized = true
      } else if (transfrom.alpha === -1) {
        states.push(this._states[transfrom.target])
      }
    }
    for (let curState of states) {
      if (stack.indexOf(curState) === -1) {
        stack.push(curState)
      }
    }
    return isWordRecognized
  }

  /**
   * 检测当前是否到达接收状态（考虑了epsilon边）
   */
  hasReachedAcceptStates(currentState: State) {
    // 不考虑epsilon边
    if (this._acceptStates.indexOf(currentState) !== -1) {
      return true
    }
    // 考虑epsilon边，尝试向外扩展
    let stack = [currentState] // 深搜辅助栈
    while (!!stack.length) {
      for (let transform of this.getTransforms(stack.pop() as State, true)) {
        // 遍历所有epsilon转移
        let targetState = this._states[transform.target]
        // 如果到达接收状态就返回真
        if (this._acceptStates.includes(targetState)) return true
        // 否则放入栈等待进一步扩展
        else if (stack.indexOf(targetState)) stack.push(targetState)
      }
    }
    return false
  }

  static merge(nfa1: NFA, nfa2: NFA) {
    let newNFA = new NFA()
    newNFA._startStates = Object.assign(nfa1._startStates)
  }
}
