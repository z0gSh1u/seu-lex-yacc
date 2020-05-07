import { Regex } from '../../src/seulex/core/Regex'

test('Regex Adddot', () => {
  expect(new Regex(`AB(C|D)*EFG`).dotRaw).toBe(`A.B.(C|D)*.E.F.G`)
  expect(new Regex(`A*B*(CD)*`).dotRaw).toBe(`A*.B*.(C.D)*`)
  expect(new Regex(`AB?(CD)?(D|E)?`).dotRaw).toBe(`A.B?.(C.D)?.(D|E)?`)
})
test('Regex ToPostFix', () => {
  expect(new Regex(`AB(C|D)*EFG`).postFix).toBe(`A B . C D | * . E . F . G . `)
  expect(new Regex(`A*B*(CD)*`).postFix).toBe(`A * B * . C D . * . `)
  expect(new Regex(`AB?(CD)?(D|E)?`).dotRaw).toBe(`A B ? . C D . ? . D E | ? .`)
})
