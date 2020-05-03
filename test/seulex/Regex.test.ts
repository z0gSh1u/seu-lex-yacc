import { Regex } from '../../src/seulex/core/Regex'

test('Regex To Postfix', () => {
  let regex = new Regex('ab.c+(de)?g|f')
  let okRegex = regex.postFix
  expect(okRegex).toBe('something')
})