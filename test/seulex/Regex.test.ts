import { Regex } from '../../src/seulex/core/Regex'

test('Regex Adddot', () => {
  expect(new Regex(`AB(C|D)*EFG`).dotRaw).toBe(`A.B.(C|D)*.E.F.G`)
  expect(new Regex(`A*B*(CD)*`).dotRaw).toBe(`A*.B*.(C.D)*`)
  expect(new Regex(`AB?(CD)?(D|E)?`).dotRaw).toBe(`A.B?.(C.D)?.(D|E)?`)
})
test('Regex ToPostFix', () => {
  expect(new Regex(`AB(C|D)*EFG`).postFix).toBe(`A B . C D | * . E . F . G .`)
  expect(new Regex(`A*B*(CD)*`).postFix).toBe(`A * B * . C D . * .`)
  expect(new Regex(`AB?(CD)?(D|E)?`).postFix).toBe(
    `A B ? . C D . ? . D E | ? .`
  )
})
test('Regex ExpandRange', () => {
  expect(new Regex('AB[C-F][A-Ca-c_]').rangeExpanded).toBe(
    `AB(C|D|E|F)(A|B|C|a|b|c|_)`
  )
  expect(() => {
    new Regex('AB[C-F][A-Cd-b_]')
  }).toThrow()
  expect(new Regex('Hello"[x-z]"').rangeExpanded).toBe(`Hello"[x-z]"`)
  expect(new Regex('Hello\\"[x-z]\\"').rangeExpanded).toBe(`Hello\\\"(x|y|z)\\\"`)
})
