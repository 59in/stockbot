"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const discord_js_1 = require("discord.js");
class default_1 {
    name = "ping";
    visible = true;
    description = "PONG!";
    information = "핑 확인";
    aliases = ["핑"];
    metadata = {
        name: this.name,
        description: this.description
    };
    msgmetadata = undefined;
    async slashRun(interaction) {
        return await interaction.followUp(this.ping());
    }
    async messageRun(message) {
        return message.channel.send(this.ping()).then(m => index_1.client.msgdelete(m, 3));
    }
    async buttonRun(interaction) {
        return await interaction.followUp(this.ping());
    }
    ping() {
        const actionRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("ping-restart")
            .setLabel("다시 측정")
            .setStyle(discord_js_1.ButtonStyle.Success));
        const embed = index_1.client.mkembed({
            title: `Pong!`,
            description: `**${index_1.client.ws.ping}ms**`
        });
        return { embeds: [embed], components: [actionRow], ephemeral: true };
    }
}
exports.default = default_1;
