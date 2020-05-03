import { splitAndKeep } from '../src/utils'

test('splitAndKeep basic', () => {
  expect(splitAndKeep('ab.cd;ef,g|h', '.;,|')).toEqual([
    'ab',
    '.',
    'cd',
    ';',
    'ef',
    ',',
    'g',
    '|',
    'h',
  ])
})
