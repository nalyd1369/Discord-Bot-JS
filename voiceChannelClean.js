module.exports = async (client) => {
    client.guilds.cache.forEach((guild) => {
        const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');
        var wantedChannel = guild.channels.cache.find(channels => channels.name === "Custom");

        if (voiceChannels && wantedChannel) {
            for (const [id, voiceChannel] of voiceChannels) {
                if (voiceChannel.parent === wantedChannel && voiceChannel.members.size === 0) {
                    console.log(`Deleted channel "${voiceChannel.name}"`)
                    voiceChannel.delete()
                }
            }
        } else {
            console.log(`Nothing found in ${guild.name}`)
        }
    });
}