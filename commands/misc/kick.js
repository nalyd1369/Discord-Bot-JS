module.exports = {
  commands: ["kick"],
  expectedArgs: '<Member>',
  permissionError: "You need admin permissions to run this command",
  minArgs: 1,
  maxArgs: 1,
  callback: (message, arguments, text, client) => {
      const user = message.mentions.users.first();
      // If we have a user mentioned
      if (user) {
        // Now we get the member from the user
        const member = message.guild.member(user);
        // If the member is in the guild
        if (member) {
          member
            .kick({
              reason: 'they were bad!',
            })
            .then(() => {
              // We let the message author know we were able to kick the person
              message.reply(`Successfully kicked ${user.tag}`);
            })
            .catch(err => {
              // An error happened
              // This is generally due to the bot not being able to kick the member,
              // either due to missing permissions or role hierarchy
              if(member.id === client.user.id) {
                message.reply('I cannot kick myself');
            } else {
                message.reply('I was unable to kick the member');
                console.error(err);
            }
            });
        } else {
          // The mentioned user isn't in this guild
          message.reply("That user isn't in this guild!");
        }
        // Otherwise, if no user was mentioned
      } else {
        message.reply("You didn't mention the user to kick!");
      }
  },
  permissions: "KICK_MEMBERS",
  requiredRoles: [],
}
