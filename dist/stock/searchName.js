"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchName = void 0;
const __1 = require("..");
const stockData_1 = require("./stockData");
const stockConfig_1 = require("./stockConfig");
const exchange_1 = require("./exchange");
const searchName = async (member, market, name) => {
    const stocklist = stockData_1.STOCK[market];
    if (stocklist.length == 0)
        return [[[__1.client.mkembed({
                        author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
                        title: `** ${market} 주식 이름검색 오류 **`,
                        description: "주식 데이터를 찾을수 없음",
                        color: "DarkRed"
                    })]], 0, 0];
    let output = [];
    let text = "";
    let outputnumber = 0;
    let stocknumber = 1;
    const stockfilter = stocklist.filter(stock => stock.stockName.replace(/ +/g, "").toLocaleLowerCase().includes(name.replace(/ +/g, "").toLocaleLowerCase()));
    for (let stock of stockfilter) {
        let stocktext = `${(0, stockConfig_1.fixNumber)(3, stocknumber++)}. ${stock.stockName} [${market == "NASDAQ" ? (0, exchange_1.exchange)(stock.closePrice) : stock.closePrice}원]\n`;
        if (text.length + stocktext.length > stockConfig_1.maxEmbedTextLength) {
            if (!output[outputnumber])
                output[outputnumber] = [];
            output[outputnumber].push(__1.client.mkembed({
                description: text
            }));
            text = "";
            if (output[outputnumber].length == 5)
                outputnumber++;
        }
        text += stocktext;
    }
    if (!output[outputnumber])
        output[outputnumber] = [];
    output[outputnumber].push(__1.client.mkembed({
        description: text
    }));
    if (stockfilter.length == 0)
        return [[[__1.client.mkembed({
                        author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
                        title: `** ${market} 주식 이름검색 : ${name} **`,
                        description: `검색결과가 없음`
                    })]], 0, 0];
    output[0][0]
        .setAuthor({ name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) })
        .setTitle(`** ${market} 주식 이름검색 : ${name} (총: ${stockfilter.length}개) **`);
    let max = 0;
    for (let i of output) {
        max += i.length;
    }
    for (let i = 0; i < output.length; i++) {
        for (let j = 0; j < output[i].length; j++) {
            output[i][j].setFooter({ text: `${i * 5 + j + 1}/${max}` });
        }
    }
    return [output, max, stockfilter.length];
};
exports.searchName = searchName;
