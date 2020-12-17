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
      target = message.mentions.members.first()
      let mutedRole = message.guild.roles.cache.find(roles => roles.name === "Muted");

      try {
        target.roles.remove(mutedRole)
        message.react('👌')
      } catch(e) {
        if(member.id === client.user.id) {
          message.reply('I cannot run this command on myself');
        } else {
          message.reply('Something went wrong')
          console.log(e.stack)
        }
      }
    },
    permissions: "MUTE_MEMBERS",
    requiredRoles: [],
}