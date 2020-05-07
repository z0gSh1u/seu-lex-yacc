import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'

let re = new Regex('B+')
//console.log(re.dotRaw)
//console.log(re.postFix)
let nfa = NFA.fromRegex(new Regex('B'))
let nfa2 = NFA.fromRegex(new Regex('B'))
nfa2.kleene()
//console.log(nfa.transformAdjList)
//visualizeFA(NFA.fromRegex(re))
NFA.fromRegex(re)