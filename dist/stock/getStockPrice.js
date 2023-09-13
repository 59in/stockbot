"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStock = void 0;
const stockData_1 = require("./stockData");
const exchange_1 = require("./exchange");
const getStock = async (market, code) => {
    const stocklist = stockData_1.STOCK[market];
    if (stocklist.length == 0)
        return [undefined, "주식 데이터를 찾을수 없음"];
    const findstock = stocklist.filter(stock => stock.reutersCode == code);
    if (!findstock[0])
        return [undefined, `${code} 주식을 찾을수 없음`];
    if (market === "NASDAQ")
        return [(0, exchange_1.exchange)(findstock[0].closePrice), ""];
    return [findstock[0].closePrice, ""];
};
exports.getStock = getStock;
