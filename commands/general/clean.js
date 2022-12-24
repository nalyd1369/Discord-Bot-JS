const { MessageEmbed } = require('discord.js')
const mongoose = require("mongoose");
const callSchema = require('../../schemas/call');
const errHandler = require('../../snippets/errHandler');
const calls = mongoose.model("calls")
const trackCommands = require('../../snippets/trackCommands');


module.exports = {
    name: 'clean',
    category: 'General',
    description: 'Deletes inactive calls',
    slash: true,

    callback: async ({ member, args, interaction, guild }) => {
        const voiceChannels = guild.channels.cache.filter(c => c.type === 'GUILD_VOICE');
        var wantedChannel = guild.channels.cache.find(c => c.name === "Custom Calls");
        let callsClosed = 0
        if (!wantedChannel) { errHandler('fatal', interaction) }

        for (const [id, voiceChannel] of voiceChannels) {
            if (voiceChannel.parent === wantedChannel) {
                if (voiceChannel.members.size == 0) {
                    await calls.findOne({ callID: voiceChannel.id }, async function (err, dbCall) {
                        if (!dbCall) { return }
                        console.log(`Info | ${voiceChannel.name} from ${guild.name} has been destroyed by clean`)
                        const GUIChannel = await guild.channels.cache.get(dbCall.GUIChannelID)
                        if (GUIChannel) {
                            await GUIChannel.messages.fetch(`${dbCall.GUIMessageID}`).then(GUI => {
                                if (GUI) { GUI.delete().catch(err => console.log("Couldn't delete GUI")) }
                            }).catch(err => console.log("Couldn't find GUI message"))
                        }
                        await calls.deleteOne({ callID: voiceChannel.id })
                        voiceChannel.delete().catch(err => console.log("Couldn't delete call"))
                        callsClosed++
                    }).clone()
                }
            }
        }

        /* if (callsClosed == 0) {errHandler('noCallsFound', interaction); return}
        const message = new MessageEmbed()
            .setAuthor(`| ${member.displayName} has closed ${callsClosed} calls`, `${member.displayAvatarURL()}`)
            .setColor(`#d0c7be`)

        await interaction.reply({ embeds: [message], ephemeral: false }) */
        const message = new MessageEmbed()
            .setAuthor(`| ${member.displayName} has closed inactive calls`, `${member.displayAvatarURL()}`)
            .setColor(`#d0c7be`)

        await interaction.reply({ embeds: [message], ephemeral: false })
    },
}