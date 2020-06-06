import { Regex } from './seulex/core/Regex'
import { YaccParser } from './seuyacc/core/YaccParser'
import { NFA } from './seulex/core/NFA'
import { DFA } from './seulex/core/DFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { LR1Analyzer } from './seuyacc/core/LR1'
import { visualizeGOTOGraph, visualizeACTIONGOTOTable } from './seuyacc/core/Visualizer'

let tik = new Date().getTime()
let yp = new YaccParser('example\\Test\\YaccTest2.y')
let lr1 = new LR1Analyzer(yp,true)
let dfa = lr1.dfa
visualizeGOTOGraph(dfa, lr1)
visualizeACTIONGOTOTable(lr1)
let tok = new Date().getTime()
console.log(`Time: ${tok - tik} ms.`)
