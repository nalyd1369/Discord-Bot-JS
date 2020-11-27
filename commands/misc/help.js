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
        
        **${config.prefix}help** - Sends this message
        **${config.prefix}ban <Member>** - Bans a member
        **${config.prefix}kick <Member>** - Kicks a member
        **${config.prefix}ping** - Sends a simple response (WIP)
        **${config.prefix}vc <Name>** - Creates a custom voice channel
        **${config.prefix}status** - Sends some stats about the server (WIP)
        *This bot is still in beta. Please DM Dylan with any bugs, feature requests, or improvements!*
        `)
    },
    permissions: "",
    requiredRoles: [],
}