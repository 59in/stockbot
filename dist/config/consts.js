"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consts = void 0;
const discord_js_1 = require("discord.js");
const path_1 = require("path");
class Consts {
    static CLIENT_INTENTS = [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildIntegrations,
        discord_js_1.GatewayIntentBits.GuildMessageTyping,
        discord_js_1.GatewayIntentBits.MessageContent
    ];
    static COMMANDS_PATH = (0, path_1.join)(__dirname, "..", 'commands');
    static COMMAND_PATH = (commandFile) => (0, path_1.join)(this.COMMANDS_PATH, commandFile);
}
exports.Consts = Consts;
