module.exports = {
    commands: ["ping"],
    expectedArgs: '',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text) => {
		  message.reply('Pong.');
    },
    permissions: "",
    requiredRoles: [],
}