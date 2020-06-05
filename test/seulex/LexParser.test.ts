import { LexParser } from '../../src/seulex/core/LexParser'

test('LexParser test', () => {
  expect(new LexParser('example/Test/markdown_test.l').actions).toEqual({
    '(#([a-b])+)': 'yylval = strdup(yytext + 2); return (TITLE);',
    '(\\r|\\n)': 'return 233;',
    'a+b?': 'return 0;',
  })
})
