"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const discord_js_1 = require("discord.js");
const Permission_1 = require("../utils/Permission");
const Quickdb_1 = require("../databases/Quickdb");
class default_1 {
    name = "역할";
    visible = true;
    description = "특정 명령어 사용가능한 역할 설정";
    information = "특정 명령어 사용가능한 역할 설정";
    aliases = ["role"];
    metadata = {
        name: this.name,
        description: this.description,
        options: [
            {
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                name: '도움말',
                description: '역할 도움말'
            },
            {
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                name: '목록',
                description: '등록된 역할 확인'
            },
            {
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                name: '추가',
                description: '특정 명령어 사용가능한 역할 추가',
                options: [{
                        type: discord_js_1.ApplicationCommandOptionType.Role,
                        name: '역할',
                        description: '역할',
                        required: true
                    }]
            },
            {
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                name: '제거',
                description: '특정 명령어 사용가능한 역할 제거',
                options: [{
                        type: discord_js_1.ApplicationCommandOptionType.Role,
                        name: '역할',
                        description: '역할',
                        required: true
                    }]
            }
        ]
    };
    msgmetadata = [
        {
            name: "도움말",
            des: "역할 도움말"
        },
        {
            name: "목록",
            des: "등록된 역할 확인"
        },
        {
            name: "추가",
            des: "특정 명령어 사용가능한 역할 추가"
        },
        {
            name: "제거",
            des: "특정 명령어 사용가능한 역할 제거"
        }
    ];
    async slashRun(interaction) {
        if (!(await (0, Permission_1.check_permission)(interaction)))
            return await interaction.followUp({ embeds: [Permission_1.embed_permission] });
        const cmd = interaction.options.data[0];
        const role = cmd.options ? cmd.options[0]?.role : undefined;
        let guildDB = await Quickdb_1.QDB.guild.get(interaction.guild);
        if (cmd.name === '목록')
            return await interaction.followUp({ embeds: [this.list(guildDB)] });
        if (cmd.name === '추가')
            return await interaction.followUp({ embeds: [await this.add(guildDB, role.id)] });
        if (cmd.name === '제거')
            return await interaction.followUp({ embeds: [await this.remove(guildDB, role.id)] });
        return await interaction.followUp({ embeds: [
                index_1.client.help(this.name, this.metadata, this.msgmetadata)
            ] });
    }
    async messageRun(message, args) {
        if (!(await (0, Permission_1.check_permission)(message)))
            return message.channel.send({ embeds: [Permission_1.embed_permission] });
        let guildDB = await Quickdb_1.QDB.guild.get(message.guild);
        if (!guildDB)
            return message.channel.send({ embeds: [index_1.client.mkembed({
                        title: `데이터베이스오류`,
                        description: "다시시도해주세요.",
                        color: "DarkRed"
                    })] }).then(m => index_1.client.msgdelete(m, 1));
        if (args[0] === "목록")
            return message.channel.send({ embeds: [this.list(guildDB)] }).then(m => index_1.client.msgdelete(m, 4));
        if (args[0] === "추가") {
            if (args[1]) {
                const role = message.guild?.roles.cache.get(args[1]);
                if (role)
                    return message.channel.send({ embeds: [await this.add(guildDB, role.id)] }).then(m => index_1.client.msgdelete(m, 2));
            }
            return message.channel.send({ embeds: [this.err("추가", "역할을 찾을수 없습니다.")] }).then(m => index_1.client.msgdelete(m, 1));
        }
        if (args[0] === "제거") {
            if (args[1]) {
                const role = message.guild?.roles.cache.get(args[1]);
                if (role)
                    return message.channel.send({ embeds: [await this.remove(guildDB, role.id)] }).then(m => index_1.client.msgdelete(m, 2));
            }
            return message.channel.send({ embeds: [this.err("제거", "역할을 찾을수 없습니다.")] }).then(m => index_1.client.msgdelete(m, 1));
        }
        return message.channel.send({ embeds: [index_1.client.help(this.name, this.metadata, this.msgmetadata)] }).then(m => index_1.client.msgdelete(m, 5));
    }
    err(name, desc) {
        return index_1.client.mkembed({
            title: `\` 역할 ${name} 오류 \``,
            description: desc,
            footer: { text: `${index_1.client.prefix}역할 도움말` },
            color: "DarkRed"
        });
    }
    list(guildDB) {
        let text = '';
        guildDB.role.forEach((roleID) => {
            text += `<@&${roleID}>\n`;
        });
        return index_1.client.mkembed({
            title: `\` 역할 목록 \``,
            description: (text && text !== '') ? text : '등록된 역할 없음'
        });
    }
    async add(guildDB, roleId) {
        if (guildDB.role.includes(roleId)) {
            return index_1.client.mkembed({
                title: `\` 역할 추가 오류 \``,
                description: `<@&${roleId}> 역할이 이미 등록되어 있습니다.`,
                footer: { text: `목록: /역할 목록` },
                color: 'DarkRed'
            });
        }
        else {
            guildDB.role.push(roleId);
            return await Quickdb_1.QDB.guild.set(guildDB.id, { role: guildDB.role }).then((val) => {
                if (!val)
                    return index_1.client.mkembed({
                        title: `\` 역할 추가 오류 \``,
                        description: `<@&${roleId}> 역할 추가 중 오류발생`,
                        color: "DarkRed"
                    });
                return index_1.client.mkembed({
                    title: `\` 역할 추가 \``,
                    description: `<@&${roleId}> 역할 추가 완료`,
                    footer: { text: `목록: /역할 목록` }
                });
            }).catch(() => {
                return index_1.client.mkembed({
                    title: `\` 역할 추가 오류 \``,
                    description: `<@&${roleId}> 역할 추가 중 오류발생`,
                    color: "DarkRed"
                });
            });
        }
    }
    async remove(guildDB, roleId) {
        if (guildDB.role.includes(roleId)) {
            let list = [];
            guildDB.role.forEach((ID) => {
                if (ID !== roleId)
                    list.push(ID);
            });
            guildDB.role = list;
            return await Quickdb_1.QDB.guild.set(guildDB.id, { role: guildDB.role }).then((val) => {
                if (!val)
                    return index_1.client.mkembed({
                        title: `\` 역할 제거 오류 \``,
                        description: `<@&${roleId}> 역할 제거 중 오류발생`,
                        color: "DarkRed"
                    });
                return index_1.client.mkembed({
                    title: `\` 역할 제거 \``,
                    description: `<@&${roleId}> 역할 제거 완료`,
                    footer: { text: `목록: /역할 목록` }
                });
            }).catch(() => {
                return index_1.client.mkembed({
                    title: `\` 역할 제거 오류 \``,
                    description: `<@&${roleId}> 역할 제거 중 오류발생`,
                    color: "DarkRed"
                });
            });
        }
        else {
            return index_1.client.mkembed({
                title: `\` 역할 제거 오류 \``,
                description: `<@&${roleId}> 역할이 등록되어있지 않습니다.`,
                footer: { text: `목록: /역할 목록` },
                color: 'DarkRed'
            });
        }
    }
}
exports.default = default_1;
