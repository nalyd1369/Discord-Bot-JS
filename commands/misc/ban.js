module.exports = {
    commands: ["ban"],
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
            .ban({
                reason: 'They were bad!',
            })
            .then(() => {
                // We let the message author know we were able to ban the person
                message.reply(`Successfully banned ${user.tag}`);
            })
            .catch(err => {
                // An error happened
                // This is generally due to the bot not being able to ban the member,
                // either due to missing permissions or role hierarchy
                if(member.id === client.user.id) {
                    message.reply('I cannot ban myself');
                } else {
                    message.reply('I was unable to ban the member');
                    console.error(err);
                }
                // Log the error
            });
        } else {
            // The mentioned user isn't in this guild
            message.reply("That user isn't in this guild!");
        }
        } else {
        // Otherwise, if no user was mentioned
        message.reply("You didn't mention the user to ban!");
        }
    },
    permissions: "BAN_MEMBERS",
    requiredRoles: [],
}