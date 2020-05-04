import { Regex } from './seulex/core/Regex'

let re = new Regex('AB(C|D)*EFG')

console.log(re.dotRaw)
console.log(re.postFix)


let nfa = re.constructNFA()

console.log(nfa.test('ABCDCDCCCEFG'.split('')))

