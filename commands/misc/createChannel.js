const Discord = require("discord.js");

function moveVC(message, text) {
    var wantedChannel = message.guild.channels.cache.find(channels => channels.name === "Custom");
    message.guild.channels.create (text, {
        type: 'voice',
        permissionOverwrites: [{
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
            allow: ['CONNECT', 'SPEAK', 'STREAM', 'USE_VAD'],
        }]
    }) .then((channel) => {
        //message.channel.send(`Created voice channel "${channel.name}"`)
        channel.setParent(wantedChannel.id)
        deleteEmptyChannelAfterDelay(wantedChannel, message);
    }) .catch((err) => {
        console.log(err)
        channel.updateOverwrite(channel.guild.roles.everyone, {VIEW_CHANNEL: true})});
    return
}


module.exports = {
    commands: ["vc", "voice", "channel"],
    expectedArgs: '',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text) => { 
        var wantedChannel = message.guild.channels.cache.find(channels => channels.name === "Custom");
        if (!wantedChannel) {
            message.guild.channels.create ('Custom', {
            type: 'category'
            })
            setTimeout(moveVC, 1500, message, text)
            return
        }
        moveVC(message, text)
        message.react('👌')
        console.log('Reacted')
    },
    permissions: "",
    requiredRoles: [], 
}

function deleteEmptyChannelAfterDelay(voiceChannel, message, delayMS = 2 * 60000){
    var interval = setInterval (function () {
        const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'voice');
        console.log('Ran Interval')
        var wantedChannel = message.guild.channels.cache.find(channels => channels.name === "Custom");
        if (voiceChannel.parent === wantedChannel && voiceChannel.members.size === 0) {
            for (const [id, voiceChannel] of voiceChannels) {   
                console.log(`Deleted channel ${voiceChannel}`)
                voiceChannel.delete()
                clearInterval(interval)
            }
            return
        }
    }, delayMS)
};