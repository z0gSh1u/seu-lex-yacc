import { Regex } from '../../src/seulex/core/Regex'

test('Regex Adddot', () => {
  expect(new Regex(`AB(C|D)*EFG`).dotRaw).toBe(`A.B.(C|D)*.E.F.G`)
})
test('Regex ToPostFix', () => {
  expect(new Regex(`AB(C|D)*EFG`).postFix).toBe(`A B . C D | * . E . F . G . `)
})
