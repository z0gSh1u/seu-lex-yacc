import { YaccParser } from '../../src/seuyacc/YaccParser'
import { Operator, Producer } from '../../src/seuyacc/Grammar'

test('Yacc Parser', () => {
  let yaccParser = new YaccParser("example/YaccParserTest.y")
  expect(yaccParser.tokens).toEqual([
    "ZHUOLAO", "TQL", "YYY"
  ])
  expect(yaccParser.startSymbol).toEqual("kaishi")
  expect(yaccParser.operators).toEqual([
    new Operator('\'/\'', false),
    new Operator('\'*\'', false),
    new Operator('\'=\'', true),
    new Operator('\'-\'', false),
    new Operator('\'+\'', false)
  ])
  expect(yaccParser.producers).toEqual([
    new Producer("kaishi", ["kaishi", "YYY"], ""),
    new Producer("kaishi", ["ZHUOLAO", "\'=\'", "TQL"], "true;"),
    new Producer("kaishi", ["ZHUOLAO", "\'i\'", "\'s\'", "TQL"], "if (true) {$$ = \"}\\\"\";}"),
    new Producer("zhongjian", ["kaishi"], ""),
    new Producer("zhongjian", ["zhongjian", "TQL", "ZHUOLAO"], ""),
    new Producer("zhongjian", ["\'\\n\'"], ""),
    new Producer("jieshu", ["zhongjian", "YYY"], "return 0;")
  ])
})