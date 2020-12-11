const Discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    commands: ["unlock"],
    expectedArgs: '',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text) => {
        message.channel.updateOverwrite(
            message.guild.roles.everyone.id,
            { 'SEND_MESSAGES': null },
        ).catch(console.log);

        message.channel.send(`This channel was unlocked by ${message.author}`)
    },
    permissions: "MANAGE_ROLES",
    requiredRoles: [],
}