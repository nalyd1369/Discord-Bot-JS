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
        **${config.prefix}vc <Name>** - Creates a custom voice channel
        **${config.prefix}purge** - Deletes up to 100 messages
        **${config.prefix}say <Text>** - Says the message
        **${config.prefix}spam <Library>** - Spams from Reddit (Disabled)
        **${config.prefix}status** - Sends some stats about the server (WIP)
        **${config.prefix}kick <Member>** - Kicks a member
        **${config.prefix}ban <Member>** - Bans a member\n
        *This bot is still in beta. Please DM Dylan with any bugs, feature requests, or improvements!*
        `)
    },
    permissions: "",
    requiredRoles: [],
}