"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotClient = void 0;
require("dotenv/config");
const discord_js_1 = require("discord.js");
const consts_1 = require("../config/consts");
class BotClient extends discord_js_1.Client {
    debug;
    prefix;
    embedColor;
    constructor() {
        super({ intents: consts_1.Consts.CLIENT_INTENTS });
        this.debug = JSON.parse(process.env.DEBUG || "false");
        this.prefix = process.env.PREFIX || "t;";
        this.embedColor = process.env.EMBED_COLOR
            ? process.env.EMBED_COLOR.trim().charAt(0).toLocaleUpperCase() + process.env.EMBED_COLOR.trim().slice(1).toLocaleLowerCase()
            : "Orange";
        this.login(process.env.DISCORD_TOKEN);
    }
    msgdelete = (message, time, customtime) => {
        let deletetime = customtime ? time : 6000 * time;
        if (deletetime < 100)
            deletetime = 100;
        setTimeout(() => {
            try {
                if (message.deletable)
                    message.delete();
            }
            catch { }
            ;
        }, deletetime);
    };
    onEvent = (event, func, ...extra) => this.on(event, (...args) => func(...args, ...extra));
    mkembed(data) {
        const embed = new discord_js_1.EmbedBuilder();
        if (data.title)
            embed.setTitle(data.title);
        if (data.description)
            embed.setDescription(data.description);
        if (data.url)
            embed.setURL(data.url);
        if (data.image)
            embed.setImage(data.image);
        if (data.thumbnail)
            embed.setThumbnail(data.thumbnail);
        if (data.author)
            embed.setAuthor({ name: data.author.name, iconURL: data.author.iconURL, url: data.author.url });
        if (data.addFields)
            embed.addFields(data.addFields);
        if (data.timestamp)
            embed.setTimestamp(data.timestamp);
        if (data.footer)
            embed.setFooter({ text: data.footer.text, iconURL: data.footer.iconURL });
        if (data.color) {
            embed.setColor(data.color);
        }
        else {
            embed.setColor(this.embedColor);
        }
        return embed;
    }
    help(name, metadata, msgmetadata) {
        const prefix = this.prefix;
        var text = "";
        metadata.options?.forEach((opt) => {
            text += `/${name} ${opt.name}`;
            if (opt.type === discord_js_1.ApplicationCommandOptionType.Subcommand && opt.options) {
                if (opt.options.length > 1) {
                    text = "";
                    opt.options.forEach((opt2) => {
                        text += `/${name} ${opt.name} [${opt2.type}] : ${opt.description}\n`;
                    });
                }
                else {
                    text += ` [${opt.options[0].type}] : ${opt.description}\n`;
                }
            }
            else {
                text += ` : ${opt.description}\n`;
            }
        });
        if (msgmetadata) {
            text += `\n`;
            msgmetadata.forEach((opt) => {
                text += `${prefix}${name} ${opt.name} : ${opt.des}\n`;
            });
        }
        if (!text || text.length == 0)
            return undefined;
        return this.mkembed({
            title: `\` ${name} 명령어 \``,
            description: text,
            color: this.embedColor
        });
    }
}
exports.BotClient = BotClient;
