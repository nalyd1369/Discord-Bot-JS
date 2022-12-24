const { MessageEmbed, MessageActionRow } = require('discord.js')
const mongoose = require("mongoose");
const callSchema = require('../../schemas/call')
const errHandler = require('../../snippets/errHandler')
const trackCommands = require('../../snippets/trackCommands')
const calls = mongoose.model("calls")

module.exports = {
    name: 'rename',
    category: 'Testing',
    description: 'Renames the call',
    slash: true,
    cooldown: '5m',
    options: [{
        name: 'name',
        description: 'New call name',
        type: 'STRING',
        required: true,
    }],

    callback: ({ text, member, interaction, client }) => {
        if (!member.voice.channel) { errHandler('noCall', interaction); return }
        const call = member.voice.channel
        if (call.parent.name != "Custom Calls") { errHandler('noCustom', interaction); return }

        calls.findOne({ callID: call.id }, async function (err, found) {
            if (!found) { errHandler('fatal', interaction); return }
            if (found.ownerID != member.id && !member.permissions.has('MANAGE_CHANNELS')) { errHandler('noPerm', interaction); return }
            call.setName(text)

            const embed = new MessageEmbed().setAuthor(`| Changed call name to "${text}"`, `${member.displayAvatarURL()}`).setColor(`#d0c7be`)
            interaction.reply({embeds: [embed], ephereal: true})
        })
        trackCommands('rename')
    },
}