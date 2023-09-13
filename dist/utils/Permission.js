"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embed_permission = exports.check_permission = void 0;
require("dotenv/config");
const __1 = require("..");
const Quickdb_1 = require("../databases/Quickdb");
const check_admin = (message) => {
    if (process.env.ADMIN_ID && (process.env.ADMIN_ID === message.member?.user.id))
        return true;
    return false;
};
const check_permission = async (message) => {
    if (check_admin(message))
        return true;
    let userper = message.member?.permissions;
    if (userper && userper.has("Administrator"))
        return true;
    let guildDB = await Quickdb_1.QDB.guild.get(message.guild);
    let userrole = message.member?.roles;
    if (userrole && userrole.cache.some(role => guildDB.role.includes(role.id)))
        return true;
    return false;
};
exports.check_permission = check_permission;
exports.embed_permission = __1.client.mkembed({
    description: `이 명령ㅇ어를 사용할\n권한이 없습니다.`,
    color: "DarkRed"
});
