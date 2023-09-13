"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const discord_js_1 = require("discord.js");
class default_1 {
    name = "help";
    visible = true;
    description = "명령어 확인";
    information = "명령어 확인";
    aliases = ["도움말"];
    metadata = {
        name: this.name,
        description: this.description
    };
    async slashrun(interaction) {
        return await interaction.followUp(this.gethelp());
    }
    async messageRun(message) {
        return message.channel.send(this.gethelp()).then(m => index_1.client.msgdelete(m, 5));
    }
    async menurun(interaction, args) {
        const command = index_1.handler.commands.get(args[0]);
        var embed = index_1.client.mkembed({});
        var embed2 = undefined;
        if (command) {
            embed.setTitle(`\` /${args[0]} 도움말 \``)
                .setDescription(`이름: ${args[0]}\n설명: ${command.information ? command.information : command.description}`);
            embed2 = index_1.client.help(command.metadata.name, command.metadata, command.msgmetadata);
        }
        else {
            embed.setTitle(`\` ${args[0]} 도움말 \``)
                .setDescription(`명령어를 찾을수 없습니다.`)
                .setFooter({ text: `도움말: /help` })
                .setColor('DarkRed');
        }
        if (embed2)
            return await interaction.followUp({ embeds: [embed, embed2] });
        return await interaction.followUp({ embeds: [embed] });
    }
    gethelp() {
        const slashcmdembed = index_1.client.mkembed({
            title: `\` slash (/) 도움말 \``,
            description: `명령어\n명령어 설명`
        });
        const msgcmdembed = index_1.client.mkembed({
            title: `\` 기본 (${index_1.client.prefix}) 도움말 \``,
            description: `명령어 [같은 명령어]\n명령어 설명`,
            footer: { text: `PREFIX: ${index_1.client.prefix}` }
        });
        let cmdlist = [];
        index_1.handler.commands.forEach((cmd) => {
            if (cmd.slashRun && cmd.visible) {
                cmdlist.push({ label: `/${cmd.name}`, description: `${cmd.information ? cmd.information : cmd.description}`, value: `${cmd.name}` });
                slashcmdembed.addFields([{ name: `**/${cmd.name}**`, value: `${cmd.information ? cmd.information : cmd.description ? cmd.description : "-"}`, inline: true }]);
            }
        });
        index_1.handler.commands.forEach((cmd) => {
            if (cmd.messageRun && cmd.visible) {
                msgcmdembed.addFields([{ name: `**${index_1.client.prefix}${cmd.name}${(cmd.aliases && cmd.aliases.length > 0) ? ` [ ${cmd.aliases} ]` : ""}**`, value: `${cmd.information ? cmd.information : cmd.description ? cmd.description : "-"}`, inline: true }]);
            }
        });
        const rowhelp = index_1.client.mkembed({
            title: '\` 명령어 상세보기 \`',
            description: `명령어의 자세한 내용은\n아래의 선택박스에서 선택해\n확인할수있습니다.`,
            footer: { text: '여러번 가능' }
        });
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('help')
            .setPlaceholder('명령어를 선택해주세요.')
            .addOptions(cmdlist));
        return { embeds: [slashcmdembed, msgcmdembed, rowhelp], components: [row] };
    }
}
exports.default = default_1;
