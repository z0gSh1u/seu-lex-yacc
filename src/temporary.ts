import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { DFA } from './seulex/core/DFA'

let re = new Regex(`t" "m`)
let re2= new Regex(`hoy+s`)
let re3= new Regex(`wt?f`)
let re4= new Regex(`g|sty`)
let re5= new Regex(`dd*up`)
console.log(re.raw)
console.log(re.escapeExpanded)
console.log(re.rangeExpanded)
console.log(re.dotAdded)
console.log(re.postFix)
let nfa = NFA.parallelAll(NFA.fromRegex(re),NFA.fromRegex(re2),NFA.fromRegex(re3),NFA.fromRegex(re4),NFA.fromRegex(re5))
visualizeFA(nfa)
console.log(nfa.alphabet)
