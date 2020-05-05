import { Regex } from '../../src/seulex/core/Regex'
import { NFA } from '../../src/seulex/core/NFA'

test('NFA constructed by Regex', () => {
  expect(
    NFA.fromRegex(new Regex('AB(C|D)*EFG')).test('ABCDCDCCCEFG')
  ).toBeTruthy()
  expect(NFA.fromRegex(new Regex('AB(C|D)*EFG')).test('ABEFG')).toBeTruthy()
  expect(NFA.fromRegex(new Regex('AB(C|D)*EFG')).test('ABCCEQQ')).toBeFalsy()
})
