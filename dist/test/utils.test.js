"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils");
test('splitAndKeep basic', () => {
    expect(utils_1.splitAndKeep('ab.cd;ef,g|h', '.;,|')).toEqual([
        'ab',
        '.',
        'cd',
        ';',
        'ef',
        ',',
        'g',
        '|',
        'h',
    ]);
});
