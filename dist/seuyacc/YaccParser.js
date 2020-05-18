"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
class YaccParser {
    constructor(filePath) {
        this._filePath = filePath;
        this._rawContent = fs_1.default
            .readFileSync(this._filePath)
            .toString()
            .replace(/\r\n/g, '\n');
        this._splitContent = this._rawContent.split('\n');
        this._fillText();
        this._parseProducers();
    }
    get producers() {
        return this._producers;
    }
    _parseProducers() {
        const lines = this._producerPart.split('\n');
        let insideOne = false;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.trimLeft() === line) {
                // 顶格
                utils_1.assert(!insideOne, 'New producer before the previous ends.');
                insideOne = true;
                line = line.trim();
                if (!this._alphabet.includes(line)) {
                    this._alphabet.push(line);
                }
                while ((line = lines[++i].trim()) !== ';') {
                    let lineSplit = line.split(/\s/);
                }
            }
        }
    }
    _fillText() {
        let copyPartStart = -1, copyPartEnd = -1, twoPercent = [];
        // 寻找分界符位置
        this._splitContent.forEach((v, i) => {
            switch (v.trimRight() // 要求左侧顶格
            ) {
                case '%{':
                    utils_1.assert(copyPartStart === -1, 'Bad .y structure. Duplicate %{.');
                    copyPartStart = i;
                    break;
                case '%}':
                    utils_1.assert(copyPartEnd === -1, 'Bad .y structure. Duplicate %}.');
                    copyPartEnd = i;
                    break;
                case '%%':
                    utils_1.assert(twoPercent.length < 2, 'Bad .y structure. Duplicate %%.');
                    twoPercent.push(i);
                    break;
            }
        });
        utils_1.assert(copyPartStart !== -1, 'Bad .y structure. {% not found.');
        utils_1.assert(copyPartEnd !== -1, 'Bad .y structure. %} not found.');
        utils_1.assert(twoPercent.length === 2, 'Bad .y structure. No enough %%.');
        // 最末尾的C代码部分
        this._userCodePart = this._splitContent.slice(twoPercent[1] + 1).join('\n');
        // 开头的直接复制部分
        this._copyPart = this._splitContent
            .slice(copyPartStart + 1, copyPartEnd)
            .join('\n');
        // 中间的规则部分
        this._producerPart = this._splitContent
            .slice(twoPercent[0] + 1, twoPercent[1])
            .join('\n');
        // 剩余的是信息部分
        this._infoPart =
            this._splitContent.slice(0, copyPartStart).join('\n') +
                this._splitContent.slice(copyPartEnd + 1, twoPercent[0]).join('\n');
    }
}
exports.YaccParser = YaccParser;
