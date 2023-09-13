"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onInteractionCreate = void 0;
const __1 = require("..");
const onInteractionCreate = async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        await interaction.deferReply({ ephemeral: true, fetchReply: true }).catch(() => { });
        const commandName = interaction.customId;
        const args = interaction.values;
        const command = __1.handler.commands.get(commandName);
        if (command && command.menuRun)
            return command.menuRun(interaction, args);
    }
    if (interaction.isButton()) {
        const args = interaction.customId.split("-");
        if (!args || args.length === 0)
            return;
        await interaction.deferReply({ ephemeral: true, fetchReply: true });
        const command = __1.handler.commands.get(args.shift());
        if (command && command.buttonRun)
            return command.buttonRun(interaction, args);
    }
    if (!interaction.isCommand())
        return;
    await interaction.deferReply({ ephemeral: true, fetchReply: true });
    __1.handler.runCommand(interaction);
};
exports.onInteractionCreate = onInteractionCreate;
