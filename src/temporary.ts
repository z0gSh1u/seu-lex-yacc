import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'

let re = new Regex(`AB?[c-fo]+qp*`)
console.log(re.rangeExpanded)
console.log(re.dotRaw)
visualizeFA(NFA.fromRegex(re))
