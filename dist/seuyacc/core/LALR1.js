"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("./Grammar");
function lrdfa_to_lalrdfa(lr1) {
    //{核的内容，包含这个核的状态号的数组}
    let coreArr = [];
    for (let i = 0; i < lr1.dfa.states.length; i++) {
        let LRstate = lr1.dfa.states[i];
        let core = LRstate.items[0];
        let isHad = false; //检查这个核是不是已有了
        for (let j = 0; j < coreArr.length; j++) {
            if (coreArr[j].first == core) {
                isHad = true;
                coreArr[j].second.push(i); //把这个核的状态号合并
            }
        }
        if (!isHad) { //这种核的还没遇到过，那么就新建一个这种核的索引
            let newArr = { first: core, second: [i] };
            coreArr.push(newArr);
        }
    }
    //LALR1构建
    let count = 0;
    let LALR1 = new Grammar_1.LR1DFA(lr1.dfa.startStateId);
    let LALRStates = [];
    LALRStates.length = coreArr.length;
    for (let i = 0; i < coreArr.length; i++) {
        /*
        这里假设我们已经合并完了同心项，左边一列是合并后（前）的项集，
        右边一列是用索引表示的、每个项集在项集族对应的数组下标
        因为用的是索引，所以左右能一一对应
        LALR.states(∪ of LR.states)------coreArray.second
        J0(I0)---------------------------[0]
        J1(I1 ∪ I2 ∪ I4)----------------[1,2,4]
        J2(I3 ∪ I5)---------------------[3,5]
        */
        for (let j = 0; j < lr1.dfa.states.length; j++) { //相同核的状态取并集
            if (coreArr[i].second.includes(j)) {
                LALRStates[i].items.concat(lr1.dfa.states[j].items.filter(x => !LALRStates[i].items.includes(x)));
            }
        }
        LALR1.addState(LALRStates[i]);
        for (let k = 0; k < lr1.dfa.adjList[i].length; k++) { //构建新的adjust矩阵
            if (lr1.dfa.adjList[i][k] != null) {
                let tempTo = lr1.dfa.adjList[i][k].to;
                let tempAlpha = lr1.dfa.adjList[i][k].alpha;
                for (let x = 0; x < coreArr.length; x++) {
                    if (coreArr[x].second.includes(tempTo)) {
                        let newTo = x;
                        LALR1.link(i, newTo, tempAlpha);
                        break;
                    }
                }
            }
        }
    }
    return LALR1;
}
exports.lrdfa_to_lalrdfa = lrdfa_to_lalrdfa;
