"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashHandler = void 0;
require("dotenv/config");
const __1 = require("..");
const discord_js_1 = require("discord.js");
const consts_1 = require("../config/consts");
const discord_js_2 = require("discord.js");
const fs_1 = require("fs");
const Logger_1 = require("../utils/Logger");
class SlashHandler {
    commands;
    cooldown;
    constructor() {
        this.commands = new discord_js_2.Collection();
        this.cooldown = new Map();
        const commandPath = consts_1.Consts.COMMANDS_PATH;
        const commandFiles = (0, fs_1.readdirSync)(commandPath);
        for (const commandFile of commandFiles) {
            const command = new (require(consts_1.Consts.COMMAND_PATH(commandFile)).default)();
            this.commands.set(command.metadata.name, command);
        }
    }
    async registCachedCommands(client) {
        if (!process.env.DISCORD_CLIENTID) {
            throw new TypeError("DISCORD_CLIENTID을 찾을수 없음");
        }
        if (!process.env.DISCORD_TOKEN) {
            throw new TypeError("DISCORD_TOKEN을 찾을수 없음");
        }
        if (!client.application)
            return Logger_1.Logger.warn('WARNING: registCachedCommands() called before application is ready.');
        const metadatas = [];
        for (const command of this.commands.values()) {
            if (!command.metadata)
                continue;
            if (!command.visible || !command.slashRun)
                continue;
            metadatas.push(command.metadata);
        }
        const rest = new discord_js_1.REST({ version: discord_js_1.DefaultRestOptions.version }).setToken(process.env.DISCORD_TOKEN);
        await rest.put(discord_js_1.Routes.applicationCommands(process.env.DISCORD_CLIENTID), { body: [] }).then(() => Logger_1.Logger.debug('Successfully deleted commands.'));
        if (process.env.ENVIROMENT?.toUpperCase() === 'DEV') {
            await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.DISCORD_CLIENTID, process.env.ENVIROMENT_DEV_GUILDID), { body: [] }).then(() => Logger_1.Logger.debug("Successfully deleted commands for guild: " + process.env.ENVIROMENT_DEV_GUILDID));
            await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.DISCORD_CLIENTID, process.env.ENVIROMENT_DEV_GUILDID), { body: metadatas }).then(() => Logger_1.Logger.debug('Registered commands for guild: ' + process.env.ENVIROMENT_DEV_GUILDID));
            return;
        }
        await rest.put(discord_js_1.Routes.applicationCommands(process.env.DISCORD_CLIENTID), { body: metadatas }).then(() => Logger_1.Logger.debug('Registered commands.'));
    }
    runCommand(interaction) {
        const commandName = interaction.commandName;
        const command = this.commands.get(commandName);
        if (!command)
            return;
        if (command.slashRun)
            command.slashRun(interaction);
    }
    err(message, commandName) {
        if (!commandName || commandName == '')
            return;
        return message.channel.send({ embeds: [
                __1.client.mkembed({
                    description: `\` ${commandName} \` 이라는 명령어를 찾을수 없습니다.`,
                    footer: { text: ` ${__1.client.prefix}help 를 입력해 명령어를 확인해주세요.` },
                    color: "DarkRed"
                })
            ] }).then(m => __1.client.msgdelete(m, 1));
    }
}
exports.SlashHandler = SlashHandler;
