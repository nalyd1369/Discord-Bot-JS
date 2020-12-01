const Discord = require("discord.js");

module.exports = {
    commands: ["ping", "latency"],
    expectedArgs: '<Member>',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text, client) => {
        const Latency = new Discord.MessageEmbed()
            .setTitle('Pong!🏓')
            .addFields(
                { name: 'Latency', value: `${Date.now() - message.createdTimestamp}ms` },
                { name: 'API', value: `${Math.round(client.ws.ping)}ms` },
            )
        message.channel.send(Latency)
    },
    permissions: "",
    requiredRoles: [],
}