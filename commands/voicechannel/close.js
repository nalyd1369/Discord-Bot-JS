const mongoose = require("mongoose");
const errHandler = require('../../snippets/errHandler')
const { MessageEmbed } = require('discord.js')
const callSchema = require('../../schemas/call');
const trackCommands = require("../../snippets/trackCommands");
const calls = mongoose.model("calls")

module.exports = {
    name: 'close',
    category: 'Testing',
    description: 'Deletes your call',
    slash: true,

    callback: ({ interaction, member }) => {
        let call = member.voice.channel
        if (!call) { errHandler("noCall", interaction); return }
        if (call.parent.name != "Custom Calls") { errHandler("noCustom", interaction); return }
        calls.findOne({ callID: call.id }, async function (err, dbCall) {
            if (!dbCall) { errHandler("fatal", interaction); return }
            if (dbCall.ownerID != member.id && !member.permissions.has('MANAGE_CHANNELS')) { errHandler("noPerm", interaction); return }

            //find gui
            if (dbCall.GUIMessageID != null) {
                const GUIChannel = call.guild.channels.cache.get(dbCall.GUIChannelID)
                if (GUIChannel) { 
                    const GUI = await GUIChannel.messages.fetch(`${dbCall.GUIMessageID}`) 
                    if (GUI){ 
                        GUI.delete().catch(err => console.log(err)) 
                    }
                }
            }

            calls.deleteOne({ callID: call.id }, function (err, dbCall) { if (err) { console.log(err) } }).clone()//fix later
            const Claim = new MessageEmbed()
                .setAuthor(`| ${member.displayName} has closed the call`, `${member.displayAvatarURL()}`)
                .setColor(`#d0c7be`)
            interaction.reply({ embeds: [Claim], ephemeral: false })
            call.delete()
        })
        trackCommands('close')
    },
}