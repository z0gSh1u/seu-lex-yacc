import { Regex } from './seulex/core/Regex'
import { NFA } from './seulex/core/NFA'
import { visualizeFA } from './seulex/core/Visualizer'

console.log(new Regex('AB[C-F][A-Ca-c_]').rangeExpanded)
console.log(new Regex('[A-Ca-cdef]').rangeExpanded)
console.log(new Regex(`Hello"[x-z]"`).rangeExpanded)
console.log(new Regex('Hello\\"[x-z]\\"').rangeExpanded)
