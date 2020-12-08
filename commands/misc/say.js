const Discord = require("discord.js");

module.exports = {
    commands: ["say", "speak", "dictate"],
    expectedArgs: '<Text>',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text, client) => {
        message.delete()
        message.channel.send(text)
        .catch(err => {
            console.error(err)})
    },
    permissions: "",
    requiredRoles: [],
}