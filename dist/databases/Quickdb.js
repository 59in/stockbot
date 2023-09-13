"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QDB = void 0;
require("dotenv/config");
const quick_db_1 = require("quick.db");
const __1 = require("..");
const qdb = new quick_db_1.QuickDB({
    filePath: process.env.DB_FILE_PATH || "./dbfile.sqlite"
});
const guild_set = (guildId, getqdb) => new Promise(async (res, rej) => {
    try {
        for (const key of Object.keys(getqdb)) {
            await qdb.table("s" + guildId).set(key, getqdb[key]);
        }
        return res(true);
    }
    catch (err) {
        return rej(err);
    }
});
const guild_get = (guild) => new Promise((res, rej) => {
    qdb.table("s" + guild.id).all().then(async (guildData) => {
        let output = {};
        if (guildData.length === 0 || guildData.some((val) => val.id !== "id")) {
            let serverlist = await qdb.get("ids") || [];
            if (!serverlist.includes(guild.id)) {
                serverlist.push(guild.id);
                await qdb.set("ids", serverlist);
            }
            let data = {
                id: guild.id,
                prefix: __1.client.prefix,
                name: "",
                role: [],
                channelId: ""
            };
            output = data;
        }
        for (let val of guildData) {
            output[val.id] = val.value;
        }
        output["name"] = guild.name;
        await guild_set(guild.id, output);
        return res(output);
    }).catch(rej);
});
const guild_del = (guildId) => new Promise((res, rej) => {
    qdb.table("s" + guildId).deleteAll().then(async () => {
        let serverlist = await qdb.get("ids") || [];
        await qdb.set("ids", serverlist.filter(id => id !== guildId));
        return res(true);
    }).catch(rej);
});
const guild_all = () => new Promise(async (res, rej) => {
    try {
        let serverlist = await qdb.get("ids") || [];
        let output = [];
        for (let guildId of serverlist) {
            let guilddata = await qdb.table("s" + guildId).all();
            let output2 = {};
            for (let val of guilddata) {
                output2[val.id] = val.value;
            }
            output.push(output2);
        }
        return res(output);
    }
    catch (err) {
        return rej(err);
    }
});
const user_set = (guildId, userId, getqdb) => new Promise(async (res, rej) => {
    try {
        for (const key of Object.keys(getqdb)) {
            await qdb.table("s" + guildId).table("u" + userId).set(key, getqdb[key]);
        }
        return res(true);
    }
    catch (err) {
        return rej(err);
    }
});
const user_get = (guild, member) => new Promise(async (res, rej) => {
    await guild_get(guild).catch(rej);
    qdb.table("s" + guild.id).table("u" + member.id).all().then(async (userData) => {
        let output = {};
        if (userData.length === 0 || userData.some((val) => val.id !== "id")) {
            let userlist = await qdb.table("s" + guild.id).get("idu") || [];
            if (!userlist.includes(guild.id)) {
                userlist.push(guild.id);
                await qdb.table("s" + guild.id).set("idu", userlist);
            }
            let data = {
                id: member.id,
                name: "",
                money: 0,
                support: {
                    money: false,
                    time: 0
                },
                stocks: []
            };
            output = data;
        }
        for (let val of userData) {
            output[val.id] = val.value;
        }
        output["name"] = member.nickname || member.user.username;
        await user_set(guild.id, member.id, output);
        return res(output);
    }).catch(rej);
});
const user_del = (guildId, userId) => new Promise((res, rej) => {
    qdb.table("s" + guildId).table("u" + userId).deleteAll().then(async () => {
        let userlist = await qdb.table("s" + guildId).get("idu") || [];
        await qdb.table("s" + guildId).set("idu", userlist.filter(id => id !== userId));
        return res(true);
    }).catch(rej);
});
const user_all = (guildId) => new Promise(async (res, rej) => {
    try {
        let userlist = await qdb.table("s" + guildId).get("idu") || [];
        let output = [];
        for (let userId of userlist) {
            let guilddata = await qdb.table("s" + guildId).table("u" + userId).all();
            let output2 = {};
            for (let val of guilddata) {
                output2[val.id] = val.value;
            }
            output.push(output2);
        }
        return res(output);
    }
    catch (err) {
        return rej(err);
    }
});
exports.QDB = {
    guild: {
        get: guild_get,
        set: guild_set,
        del: guild_del,
        all: guild_all
    },
    user: {
        get: user_get,
        set: user_set,
        del: user_del,
        all: user_all
    }
};
