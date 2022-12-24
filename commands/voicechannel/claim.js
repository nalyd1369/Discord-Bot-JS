const mongoose = require("mongoose");
const { MessageEmbed } = require('discord.js')
const callSchema = require('../../schemas/call')
const errHandler = require('../../snippets/errHandler');
const updateGUI = require("../../automaticScripts/buttonGUI");
const trackCommands = require("../../snippets/trackCommands");
const calls = mongoose.model("calls")

module.exports = {
    name: 'claim',
    category: 'General',
    description: 'Claims owner of the call',
    slash: true,

    callback: async ({ member, interaction, guild }) => {
        const call = await member.voice.channel
        if (!call) { errHandler("noCall", interaction); return }
        if (call.parent.name != "Custom Calls") { errHandler('noCustom', interaction); return }

        await calls.findOne({ callID: call.id }, async function (err, found) {
            if (!found) { errHandler("fatal", interaction); return }
            if (member.id == found.ownerID) { errHandler('areOwner', interaction); return }

            const owner = await guild.members.fetch(found.ownerID)
            if (owner.voice.channelId == call.id) { errHandler('ownerInCall', interaction); return }
            await calls.updateOne({ callID: call.id }, { $set: { "ownerID": member.id } })
            const Claim = new MessageEmbed()
                .setAuthor(`| ${member.displayName} has claimed the call`, `${member.displayAvatarURL()}`)
                .setColor(`#d0c7be`)
            interaction.reply({ embeds: [Claim], ephemeral: false })
            updateGUI(interaction, call)
        }).clone()

        trackCommands('claim')
    },
}