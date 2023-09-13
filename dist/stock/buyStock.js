"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyStock = void 0;
const index_1 = require("../index");
const Quickdb_1 = require("../databases/Quickdb");
const searchStock_1 = require("./searchStock");
const buyStock = async (guild, member, market, name, count) => {
    const findstock = await (0, searchStock_1.searchStock)(member, market, name);
    if (!findstock[0])
        return findstock[1];
    const stock = findstock[0];
    const stockPrice = Number(stock.closePrice.replace(/\,/g, ""));
    const UDB = await Quickdb_1.QDB.user.get(guild, member);
    if (UDB.money < stockPrice * count)
        return index_1.client.mkembed({
            author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
            title: `** ${name} 주식 매수 오류 **`,
            description: `보유금액이 부족합니다.\n현재 보유금액 : ${UDB.money.toLocaleString("ko-KR")}원\n부족금액 : ${(stockPrice * count - UDB.money).toLocaleString("ko-KR")}원`,
            color: "DarkRed"
        });
    let stocks = [];
    let addstock = false;
    for (let dbstock of UDB.stocks) {
        if (dbstock.code == stock.reutersCode && dbstock.price == stockPrice) {
            addstock = true;
            stocks.push({
                ...dbstock,
                count: dbstock.count + count
            });
        }
        else {
            stocks.push(dbstock);
        }
    }
    if (!addstock)
        stocks.push({
            market: market,
            code: stock.reutersCode,
            name: stock.stockName,
            price: stockPrice,
            count: count,
            time: Date.now()
        });
    const check = await Quickdb_1.QDB.user.set(guild.id, member.id, { stocks: stocks, money: UDB.money - (stockPrice * count) });
    if (!check)
        return index_1.client.mkembed({
            author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
            title: `** ${name} 주식 매수 오류 **`,
            description: `주식 매수중 오류발생`,
            color: "DarkRed"
        });
    return index_1.client.mkembed({
        author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
        title: `** ${name} 주식 매수 성공 **`,
        description: `
      주식이름 : ${stock.stockName}
      하나금액 : ${stock.closePrice}원
      매수수량 : ${count}개
      총금액 : ${(stockPrice * count).toLocaleString("ko-KR")}원
      현재 보유금액 : ${(UDB.money - (stockPrice * count)).toLocaleString("ko-KR")}원
    `
    });
};
exports.buyStock = buyStock;
