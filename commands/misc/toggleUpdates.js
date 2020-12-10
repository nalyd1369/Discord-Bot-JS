const Discord = require("discord.js");

function createRole (message) {
    message.guild.roles.create({
        data: {
          name: 'Updates',
        },
        reason: 'To allow for notifications',
      })
        .catch(console.error);
}

module.exports = {
    commands: ["update", "updates", "notifs", "notifications"],
    expectedArgs: '',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text) => {
        var wantedRole = message.guild.roles.cache.find(channels => channels.name === "Updates");
        if (!wantedRole) {
            createRole(message)
            var wantedRole = message.guild.roles.cache.find(channels => channels.name === "Updates");
        }

        if(message.member.roles.cache.find(r => r.name === "Updates")) {
            message.member.roles.remove(wantedRole)
            message.channel.send('You will no longer receive notifications')
        } else {
            message.member.roles.add(wantedRole)
            message.channel.send('You will now receive notifications')
        }
    },
    permissions: "",
    requiredRoles: [],
}