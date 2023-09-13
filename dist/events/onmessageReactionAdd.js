"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onmessageReactionAdd = void 0;
const onmessageReactionAdd = async (reaction, user) => {
    if (user.bot)
        return;
    if (!reaction.message.guildId)
        return;
    if (reaction.message.partial)
        await reaction.message.fetch();
    if (reaction.partial)
        await reaction.fetch();
};
exports.onmessageReactionAdd = onmessageReactionAdd;
