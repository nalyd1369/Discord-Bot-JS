const { MessageEmbed } = require('discord.js')
const mongoose = require("mongoose");
const callSchema = require('../../schemas/call');
const errHandler = require('../../snippets/errHandler');
const calls = mongoose.model("calls")
const trackCommands = require('../../snippets/trackCommands');


module.exports = {
    name: 'deletegui',
    category: 'General',
    description: 'Deletes the GUI of your call',
    slash: true,

    callback: async ({ member, interaction, guild }) => {
        let call = member.voice.channel
        if (!call) { errHandler("noCall", interaction); return }
        if (call.parent.name != "Custom Calls") { errHandler("noCustom", interaction); return }

        await calls.findOne({ callID: call.id }, async function (err, dbCall) {
            if (!dbCall) { errHandler('fatal', interaction); return }
            if (dbCall.GUIMessageID == null) { errHandler("noGUI", interaction); return }

            interaction.channel.messages.fetch(`${dbCall.GUIMessageID}`).then(GUI => {
                if (GUI) { GUI.delete().catch(err => console.log(err)) }
                const message = new MessageEmbed()
                    .setAuthor(`| You've deleted the GUI`, `${member.displayAvatarURL()}`)
                    .setColor(`#d0c7be`)

                interaction.reply({ embeds: [message], ephemeral: true })
            }).catch(err => console.log(err))
            await calls.updateOne({ callID: call.id }, { $set: { GUIMessageID: null } })
        }).clone()
    },
}