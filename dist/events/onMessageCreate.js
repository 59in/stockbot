"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageCreate = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
const Logger_1 = require("../utils/Logger");
const onMessageCreate = async (message) => {
    if (message.author.bot || message.channel.type === discord_js_1.ChannelType.DM)
        return;
    if (message.content.startsWith(__1.client.prefix)) {
        const content = message.content.slice(__1.client.prefix.length).trim();
        const args = content.split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        const command = __1.handler.commands.get(commandName) || __1.handler.commands.find((cmd) => cmd.aliases.includes(commandName));
        try {
            if (!command || !command.messageRun)
                return __1.handler.err(message, commandName);
            command.messageRun(message, args);
        }
        catch (error) {
            if (__1.client.debug)
                Logger_1.Logger.error(error);
            __1.handler.err(message, commandName);
        }
        finally {
            __1.client.msgdelete(message, 0, true);
        }
    }
    else {
    }
};
exports.onMessageCreate = onMessageCreate;
