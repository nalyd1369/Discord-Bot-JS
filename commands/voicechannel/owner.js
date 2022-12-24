const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const mongoose = require('mongoose')
const callSchema = require('../../schemas/call')
const calls = mongoose.model('calls')
const updateGUI = require('../../snippets/updateGUISnip');
const errHandler = require('../../snippets/errHandler');
const trackCommands = require('../../snippets/trackCommands');
//change

module.exports = {
    name: 'owner',
    category: 'Testing',
    description: 'Sets a new owner for the call',
    slash: true,
    options: [{
        name: 'user',
        description: 'Who to give owner',
        type: 'USER',
        required: true,
    }],

    callback: ({ interaction, member, guild }) => {
        const call = member.voice.channel
        const mentioned = interaction.options.getUser('user')
        if (!call) { errHandler("noCall", interaction); return }
        if (!mentioned) { errHandler('fatal', interaction); return }
        if (call.parent.name != "Custom Calls") { errHandler('noCustom', interaction); return }

        calls.findOne({ callID: call.id }, async function (err, found) {
            if (!found) { errHandler("fatal", interaction); return }
            const owner = await guild.members.fetch(found.ownerID)

            if (member.id != found.ownerID) { errHandler('noPerm', interaction); return }
            if (member.id == mentioned.id) { errHandler("selfOwner", interaction) }
            await calls.updateOne({ callID: call.id }, { $set: { "ownerID": mentioned.id } })
            updateGUI(interaction, call)
            const newOwnerEmbed = new MessageEmbed()
                .setAuthor(`| ${member.displayName} has given owner to ${mentioned.displayName}`, `${owner.displayAvatarURL()}`)
                .setColor(`#d0c7be`)
            await interaction.reply({ embeds: [newOwnerEmbed], ephemeral: false })
        }).clone()
        trackCommands('transfer')
    },
}