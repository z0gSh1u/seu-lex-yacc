import { Regex } from '../../src/seulex/core/Regex'

test('Regex Adddot', () => {
  expect(new Regex(`AB(C|D)*EFG`).dotAdded).toEqual([
    'A',
    'B',
    '(C|D)*',
    'E',
    'F',
    'G',
  ])
  expect(new Regex(`AB+(CD)?(D|E)*..F`).dotAdded).toEqual([
    'A',
    'B+',
    '(C',
    'D)?',
    '(D|E)*',
    '.',
    '.',
    'F',
  ])
})
test('Regex ToPostFix', () => {
  expect(new Regex(`AB(C|D)*EFG`).postFix).toBe(
    `A B [dot] C D | * [dot] E [dot] F [dot] G [dot]`
  )
  expect(new Regex(`AB+(CD)?(D|E)*..F`).postFix).toBe(
    `A B + [dot] C D [dot] ? [dot] D E | * [dot] . [dot] . [dot] F [dot]`
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
  expect(new Regex('Hello\\"[x-z]\\"').rangeExpanded).toBe(
    `Hello\\\"(x|y|z)\\\"`
  )
})
