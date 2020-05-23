import { Regex } from '../../src/seulex/core/Regex'

test('Regex _expandEscape', () => {
  expect(new Regex(`AB\\dC\\s`).escapeExpanded).toBe(`AB[0-9]C[" "\\t\\r\\n]`)
})

test('Regex _expandRange', () => {
  expect(new Regex('AB[C-F][A-Ca-c_]').rangeExpanded).toBe(`AB(C|D|E|F)(A|B|C|a|b|c|_)`)
  expect(() => {
    new Regex('AB[C-F][A-Cd-b_]')
  }).toThrow()
  expect(new Regex('Hello\\"[x-z]\\"').rangeExpanded).toBe(`Hello\\\"(x|y|z)\\\"`)
})

test('Regex _addDots', () => {
  expect(new Regex(`AB(C|D)*EFG`).dotAdded).toEqual(['A', 'B', '(C|D)*', 'E', 'F', 'G'])
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
  expect(new Regex(`oh\\\\d`).dotAdded).toEqual(['o', 'h', '\\\\', 'd'])
  expect(new Regex(`oh\\\\\\d`).dotAdded).toEqual(['o', 'h', '\\\\', '(0|1|2|3|4|5|6|7|8|9)'])
})

test('Regex _toPostfix', () => {
  expect(new Regex(`AB(C|D)*EFG`).postFix).toBe(`A B [dot] C D | * [dot] E [dot] F [dot] G [dot]`)
  expect(new Regex(`AB+(CD)?(D|E)*..F`).postFix).toBe(
    `A B + [dot] C D [dot] ? [dot] D E | * [dot] . [dot] . [dot] F [dot]`
  )
  expect(new Regex(`oh\\d`).postFix).toBe(`o h [dot] 0 1 2 3 4 5 6 7 8 9 | | | | | | | | | [dot]`)
  expect(new Regex(`"oh\\s"`).postFix).toBe(`o h [dot] \\ \\ [dot] s [dot]`)
  expect(new Regex(`"tell me"`).postFix).toBe(
    `t e [dot] l [dot] l [dot] [space] [dot] m [dot] e [dot]`
  )
})
