const Discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    commands: ["help"],
    expectedArgs: '',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text) => {
        color = message.guild.me.displayHexColor

        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            const help = new Discord.MessageEmbed()
            .setColor(`${color}`)
            .addFields(
                { name: `Commands`,
                value: `
                **${config.prefix}ping** - Sends latency
                **${config.prefix}vc <name>** - Creates a custom voice channel
                **${config.prefix}update** - Toggles the daily schedule notification(WIP),
                **${config.prefix}purge <amount>** - Deletes up to 100 messages
                **${config.prefix}say <text>** - Says the message
                **${config.prefix}status** - Sends some stats about the server (Broken)
                **${config.prefix}weather <city>** - Sends weather data
                **${config.prefix}kick <member>** - Kicks a member
                **${config.prefix}ban/unban <member>** - Bans or unbans a member
                **${config.prefix}mute/unmute <member>** - Mutes or unmutes a member (Buggy)
                **${config.prefix}lock/unlock <member>** - Locks or unlocks a channel`
                }
            )
            .setFooter(`*This bot is still in beta. Please DM Dylan with any bugs, feature requests, or improvements!*`)
            message.channel.send(help);
            return
        } else {
            const help = new Discord.MessageEmbed()
            .setColor(`${color}`)
            .addFields(
                { name: `Commands`,
                value: `
                **${config.prefix}ping** - Sends latency
                **${config.prefix}vc <name>** - Creates a custom voice channel
                **${config.prefix}update** - Toggles the daily schedule notification(WIP),
                **${config.prefix}say <text>** - Says the message
                **${config.prefix}status** - Sends some stats about the server (Broken)
                **${config.prefix}weather <city>** - Sends weather data`
                }
            )
            .setFooter(`*This bot is still in beta. Please DM Dylan with any bugs, feature requests, or improvements!*`)
            message.channel.send(help);
            return
        }
    },
    permissions: "",
    requiredRoles: [],
}