import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { DFA } from './seulex/core/DFA'

let re = new Regex(`t" "m`)
let re2 = new Regex(`hoy+s`)
visualizeFA(NFA.fromRegex(re))
