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
                mutedRole = await message.guild.roles.create({
                    data: {
                        name: 'Muted',
                        color: '4788ff',
                      },
                });

                const channels = message.guild.channels.cache.filter(c => c.guild && c.type === 'text');
                channels.forEach(channel => {
                    console.log(channel.name)
                    channel.updateOverwrite(mutedRole, {
                        SEND_MESSAGES: false
                      })
                });
            } catch(e) {
                // If err print
                message.reply('I was unable to mute the member');
                console.log(e.stack);
            }
        }

        try {
            if (target.id === client.user.id) {
                message.reply('I cannot mute myself')
            } else {
                target.roles.add(mutedRole)
                message.react('👌')
            }
        } catch(e) {
            message.reply('Something went wrong')
            console.log(e.stack)
        }
    },
    permissions: "MUTE_MEMBERS",
    requiredRoles: [],
}