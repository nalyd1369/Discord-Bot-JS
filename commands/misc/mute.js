const Discord = require("discord.js");
const redis = require('../../redis')

module.exports = {
    commands: ["mute"],
    expectedArgs: '<Member>',
    permissionError: "You need admin permissions to run this command",
    minArgs: 1,
    maxArgs: 1,
    callback: async (message, arguments, text, client) => {
        /* target = message.mentions.users.first()
        const redisClient = await redis()

        try {
            const redisKey = `muted-${id}`
            if seconds
            const redisClient.set(redisKey, 'true', )
        } finally {
            redisClient.quit()
        } */
    },
    permissions: "BAN_MEMBERS",
    requiredRoles: [],
}