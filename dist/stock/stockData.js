"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOCK = void 0;
const axios_1 = __importDefault(require("axios"));
const Logger_1 = require("../utils/Logger");
exports.STOCK = {
    KOSPI: [],
    KOSDAQ: [],
    NASDAQ: []
};
const getData = (market) => new Promise(async (res, rej) => {
    const url = market == "NASDAQ" ? "https://api.stock.naver.com/stock/exchange/NASDAQ/marketValue"
        : `https://m.stock.naver.com/api/stocks/marketValue/${market}`;
    const data = await axios_1.default.get(`${url}?page=1&pageSize=60`, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Encoding": "gzip,deflate,compress",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    }).catch(() => {
        return {
            status: 404,
            data: undefined
        };
    });
    let stocklist = [];
    if (data.status == 200 && data.data) {
        stocklist.push(...(data.data.stocks || []));
        let pcount = Math.ceil(data.data.totalCount / 60);
        if (pcount > 1) {
            for (let i = 2; i <= pcount; i++) {
                const data2 = await axios_1.default.get(`${url}?page=${i}&pageSize=60`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept-Encoding": "gzip,deflate,compress",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
                    }
                }).catch(() => {
                    return {
                        status: 404,
                        data: undefined
                    };
                });
                if (data2.status == 200 && data2.data) {
                    stocklist.push(...(data2.data.stocks || []));
                }
            }
        }
    }
    if (stocklist.length == 0)
        return rej(`${market} 주식 오류발생`);
    exports.STOCK[market] = stocklist;
    Logger_1.Logger.info(`${market} 주식 새로고침 완료`);
    return res(stocklist);
});
(() => {
    const market = ["KOSPI", "KOSDAQ", "NASDAQ"];
    for (let i of market) {
        getData(i).then((val) => {
            Logger_1.Logger.info(`${i} 주식 초기화완료 [${val.length}개]`);
        }).catch(Logger_1.Logger.error);
    }
    setInterval(() => {
        for (let i of market) {
            getData(i).then((val) => {
                Logger_1.Logger.info(`${i} 주식 초기화완료 [${val.length}개]`);
            }).catch(Logger_1.Logger.error);
        }
    }, 1000 * 60 * 10);
})();
