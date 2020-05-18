import { Regex } from '../../src/seulex/core/Regex'
import { NFA } from '../../src/seulex/core/NFA'
import { DFA } from '../../src/seulex/core/DFA'

test('DFA constructed by NFA', () => {
  // expect(new DFA(NFA.fromRegex(new Regex('AB(C|D)*EFG'))).test('ABCDCDCCCEFG')).toBeTruthy()
  // expect(new DFA(NFA.fromRegex(new Regex('AB(C|D)*EFG'))).test('ABEFG')).toBeTruthy()
  // expect(new DFA(NFA.fromRegex(new Regex('AB(C|D)*EFG'))).test('ABCCEQQ')).toBeFalsy()
  let dfa = DFA.fromNFA(NFA.fromRegex(new Regex('AB?.C')))
  expect(dfa.test('ABAC')).toBeTruthy()
  expect(dfa.test('ABCC')).toBeTruthy()
  expect(dfa.test('ABBC')).toBeTruthy()
  expect(dfa.test('ABC')).toBeTruthy()
  expect(dfa.test('AAC')).toBeTruthy()
  expect(dfa.test('ACC')).toBeTruthy()
  expect(dfa.test('AABC')).toBeFalsy()
})
