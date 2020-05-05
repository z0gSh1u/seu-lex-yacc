import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'

let re = new Regex('A*B*(CD)*')
console.log(re.dotRaw)
console.log(re.postFix)
let nfa = NFA.fromRegex(re)
visualizeFA(nfa)