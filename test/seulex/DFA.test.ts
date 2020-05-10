import { Regex } from '../../src/seulex/core/Regex'
import { NFA } from '../../src/seulex/core/NFA'
import { DFA } from '../../src/seulex/core/DFA'
import { visualizeFA } from '../../src/seulex/core/Visualizer'

test('DFA constructed by NFA', () => {
  visualizeFA(new DFA(NFA.fromRegex(new Regex('(A|B)*ABB'))))
  expect(new DFA(NFA.fromRegex(new Regex('AB(C|D)*EFG'))).test('ABCDCDCCCEFG')).toBeTruthy()
  expect(new DFA(NFA.fromRegex(new Regex('AB(C|D)*EFG'))).test('ABEFG')).toBeTruthy()
  expect(new DFA(NFA.fromRegex(new Regex('AB(C|D)*EFG'))).test('ABCCEQQ')).toBeFalsy()
})
