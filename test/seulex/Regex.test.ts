import { Regex } from '../../src/seulex/core/Regex'

test('_procRangeEscape', () => {
  expect(new Regex(`abc"de\\f"gh\\d+\\s"\\d"`).escapeExpanded).toBe(
    `abc\"de\\f\"gh[0-9]+\\s\"[0-9]\"`
  )
  expect(new Regex(`abc[" "a]`).escapeExpanded).toBe(`abc[" "a]`)
})

test('_procRange', () => {
  expect(new Regex(`abc[^A-Za-z0-9_><+*/]`).rangeExpanded).toEqual(
    `abc( |!|"|#|$|%|&|'|(|)|,|-|.|:|;|=|?|@|[|\\|]|^|\`|\\n|\\r|\\t|{|||}|~)`
  )
  expect(new Regex(`abc[A-Za-z0-9_><+*/]`).rangeExpanded).toEqual(
    `abc(A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|0|1|2|3|4|5|6|7|8|9|_|>|<|+|*|/)`
  )
})

test('_addDots', () => {
  expect(new Regex(`abc[a-bA-B0-2_]`).dotAdded).toEqual(['a', 'b', 'c', '(a|b|A|B|0|1|2|_)'])
})

test('_addDots', () => {
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
