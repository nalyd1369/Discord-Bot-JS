const Discord = require("discord.js");
const redis = require('../../redis')

module.exports = {
    commands: ["mute"],
    expectedArgs: '<Member>',
    permissionError: "You need admin permissions to run this command",
    minArgs: 1,
    maxArgs: 1,
    callback: async (message, arguments, text, client) => {
        target = message.mentions.members.first()
        let mutedRole = message.guild.roles.cache.find(roles => roles.name === "Muted");
        
        if (!mutedRole) {
            try {
                mutedRole = await message.guild.createRole({
                    name: "Muted",
                    color: "#4788ff",
                    permissions: []
                });

                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(mutedRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                });
            } catch(e) {
                // If err print
                console.log(e.stack);
            }
        }

        try {
            target.roles.add(mutedRole)
            message.react('👌')
        } catch(e) {
            console.log(e.stack)
        }
    },
    permissions: "MUTE_MEMBERS",
    requiredRoles: [],
}