const config = require('../../config.json')

module.exports = {
    commands: ["help"],
    expectedArgs: '',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text) => {
        message.channel.send(`
        These are my supported commands:
        
        **${config.prefix}ping** - Sends latency
        **${config.prefix}vc <name>** - Creates a custom voice channel
        **${config.prefix}update** - Toggles the daily schedule notification
        **${config.prefix}purge <amount>** - Deletes up to 100 messages
        **${config.prefix}say <text>** - Says the message
        **${config.prefix}status** - Sends some stats about the server (WIP)
        **${config.prefix}kick <member>** - Kicks a member
        **${config.prefix}ban <member>** - Bans a member\n
        *This bot is still in beta. Please DM Dylan with any bugs, feature requests, or improvements!*
        `)
    },
    permissions: "",
    requiredRoles: [],
}