"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchange = exports.exmoney = void 0;
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const Logger_1 = require("../utils/Logger");
exports.exmoney = -1;
const getexchange = async () => {
    const get = await axios_1.default.get(`https://api.exchangerate.host/latest?base=USD&symbols=KRW&amount=1`, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Encoding": "gzip,deflate,compress",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        },
        responseType: "json"
    }).catch(() => {
        return { data: { success: false, rates: { KRW: 0.0 } } };
    });
    if (get.data.success) {
        if (get.data.rates?.KRW) {
            exports.exmoney = get.data.rates.KRW;
            Logger_1.Logger.info("환율 : " + exports.exmoney.toFixed(2) + "원");
            return;
        }
    }
    Logger_1.Logger.error("환율 정보를 가져올수 없음");
};
const exchange = (getmoney) => {
    const money = Number(getmoney.replace(/\,/g, ""));
    if (exports.exmoney == -1)
        return money.toLocaleString("ko-KR");
    return Number(Math.floor(money * exports.exmoney)).toLocaleString("ko-KR");
};
exports.exchange = exchange;
(() => {
    getexchange();
    setInterval(() => {
        getexchange();
    }, 1000 * 60 * 30);
})();
