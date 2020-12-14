const Discord = require("discord.js");
const redis = require('../../redis')

function createRole (message) {
    message.guild.roles.create({
        data: {
          name: 'Muted',
        },
      })
        .catch(console.error);
}

module.exports = {
    commands: ["unmute"],
    expectedArgs: '<Member>',
    permissionError: "You need admin permissions to run this command",
    minArgs: 1,
    maxArgs: 1,
    callback: async (message, arguments, text, client) => {
        //target = message.mentions.users.first()
        var wantedRole = message.guild.roles.cache.find(roles => roles.name === "Muted");
        if (!wantedRole) {
            createRole(message)
            var wantedRole = message.guild.roles.cache.find(roles => roles.name === "Muted");
        }
        target.roles.add(wantedRole)
        //.catch(console.log())
    },
    permissions: "MUTE_MEMBERS",
    requiredRoles: [],
}