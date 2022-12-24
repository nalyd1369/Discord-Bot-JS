const { MessageEmbed } = require('discord.js')
const mongoose = require("mongoose");
const callSchema = require("../../schemas/call")
const calls = mongoose.model("calls")
const errHandler = require('../../snippets/errHandler');
const trackCommands = require('../../snippets/trackCommands');

module.exports = {
    name: 'invite',
    category: 'Testing',
    description: 'Invites a user to your locked call',
    expectedArgs: '<user>',
    minArgs: 1,
    slash: true,
    options: [{
        name: 'user',
        description: 'Who to invite to call',
        type: 'MENTIONABLE',
        required: true,
    }],

    callback: ({ interaction, member }) => {
        let mentioned = interaction.options.getMentionable('user')
        let call = member.voice.channel
        console.log(`${mentioned} / ${call}`)

        if (!call) { errHandler('noCall', interaction); return }
        if (call.parent.name != "Custom Calls") { errHandler("noCustom", interaction); return }
        if (mentioned == null) { errHandler('noMention', interaction); return }

        calls.findOne({ callID: call.id }, async function (err, found) {
            if (!found) { errHandler('fatal', interaction); return }

            if (found.ownerID != member.id && !member.permissions.has('MANAGE_CHANNELS')) { errHandler('noPerm', interaction); return }
            call.permissionOverwrites.edit(mentioned, { VIEW_CHANNEL: true });
            const Claim = new MessageEmbed()
                .setAuthor(`| You have invited ${mentioned.displayName || mentioned.name} to the call`, `${member.displayAvatarURL()}`)
                .setColor(`#d0c7be`)
            interaction.reply({ embeds: [Claim], ephemeral: true })
        }).clone()//fix

        trackCommands('invite')
    },
}