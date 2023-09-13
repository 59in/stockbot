"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onReady = void 0;
require("dotenv/config");
const __1 = require("..");
const Logger_1 = require("../utils/Logger");
const onReady = () => {
    if (!__1.client.user)
        return;
    const prefix = __1.client.prefix;
    let actlist = eval(process.env.ACTIVITY || '[{ "text": `/help`, time: 10 }, { "text": `${prefix}help`, "time": 10 }]');
    Logger_1.Logger.ready(`Ready! ${__1.client.user.username}`);
    Logger_1.Logger.ready(`prefix: ${prefix}`);
    Logger_1.Logger.ready(`Activity: ${JSON.stringify(actlist)}`);
    Logger_1.Logger.ready(`로그확인: ${__1.client.debug}`);
    if (process.env.REFRESH_SLASH_COMMAND_ON_READY === "true")
        __1.handler.registCachedCommands(__1.client);
    if (actlist.length < 1)
        return;
    __1.client.user.setActivity(actlist[0].text);
    if (actlist.length < 2)
        return;
    let i = 1;
    let time = actlist[1].time;
    setInterval(() => {
        __1.client.user?.setActivity(actlist[i].text);
        if (++i >= actlist.length)
            i = 0;
        time = actlist[i].time;
    }, time * 1000);
};
exports.onReady = onReady;
