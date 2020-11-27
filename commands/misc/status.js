const Discord = require('discord.js')

module.exports = {
    commands: ["status"],
    expectedArgs: '',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text) => {
        const { guild } = message

        const {name, memberCount, owner, afkTimeout} = guild
        const channelCount = message.guild.channels.size;
        const roleCount = guild.roles.size;

        const icon = guild.iconURL()

        const embed = new Discord.MessageEmbed()
            .setTitle(`Server info for ${name}`)
            .setThumbnail(icon)
            .addFields(
                {
                    name: 'Owner',
                    value: owner,
                },
                {
                    name: 'Members',
                    value: `${memberCount} members`,
                },
                {
                    name: 'Channels',
                    value: `${channelCount} channels`,
                },
                {
                    name: 'Roles',
                    value: `${roleCount} roles`,
                },
                {
                    name: 'AFK Timeout',
                    value: `${afkTimeout / 60} minutes`,
                },
            )
        message.channel.send(embed)
    },
    permissions: "",
    requiredRoles: [],
}