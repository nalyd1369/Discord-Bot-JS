module.exports = {
    commands: ["unban"],
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
            .unban({
                reason: 'They were bad!',
            })
            .then(() => {
                // We let the message author know we were able to ban the person
                message.reply(`Successfully unbanned ${user.tag}`);
            })
            .catch(err => {
                // An error happened
                // This is generally due to the bot not being able to ban the member,
                // either due to missing permissions or role hierarchy
                message.reply('I was unable to unban the member');
                // Log the error
                console.error(err);
            });
        } else {
            // The mentioned user isn't in this guild
            message.reply("That user isn't in this guild!");
        }
        } else {
        // Otherwise, if no user was mentioned
        message.reply("You didn't mention the user to unban!");
        }
    },
    permissions: "BAN_MEMBERS",
    requiredRoles: [],
}