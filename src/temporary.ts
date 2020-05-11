import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'
import { DFA } from './seulex/core/DFA'

let re = new Regex(`tell" "me`)
console.log(re.raw)
console.log(re.escapeExpanded)
console.log(re.rangeExpanded)
console.log(re.dotAdded)
console.log(re.postFix)
let nfa = NFA.fromRegex(re)
visualizeFA(nfa)
console.log(nfa.alphabet)
