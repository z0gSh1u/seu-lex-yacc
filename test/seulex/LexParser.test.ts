import { LexParser } from '../../src/seulex/core/LexParser'

test('LexParser test', () => {
  expect(new LexParser('example/md.l').actions).toEqual({
    '(^#{1,3}" "([A-Za-z])+$)':
      '{    yylval = strdup(yytext + 2); return (TITLE); }',
    '(\\*\\*([A-Za-z])+\\*\\*)':
      '{   yylval = substr(yytext, 2, strlen(yytext) - 2); return (BOLD); }',
    '(\\*([A-Za-z])+\\*)':
      '{ yylval = substr(yytext, 2, strlen(yytext) - 1); return (ITALIC); }',
    '[ab]': ';',
    '[cd]': 'yylval = "Hello";',
    '[ef]': '{ return 233; }',
    '[gh]': '{ return 233; }',
    '[i]': '{ return 233; }',
  })
})
