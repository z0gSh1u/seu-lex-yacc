import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'

// let re = new Regex(`ABC?"h.e?+a*"...\\"`)
let re = new Regex(`AB+(CD)?(D|E)*..F`)
console.log(re.dotAdded)
console.log(re.rangeExpanded)
console.log(re.postFix)
let nfa = NFA.fromRegex(re)
visualizeFA(nfa)
// console.log(nfa.transformAdjList)
