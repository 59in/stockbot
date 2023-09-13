"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixNumber = exports.maxEmbedTextLength = exports.maxEmbedNumber = void 0;
exports.maxEmbedNumber = 10;
exports.maxEmbedTextLength = 1000;
const fixNumber = (digit, num) => {
    let addzero = "";
    if (digit <= 3 && num < 100)
        addzero += "0";
    if (digit <= 2 && num < 10)
        addzero += "0";
    return addzero + num;
};
exports.fixNumber = fixNumber;
