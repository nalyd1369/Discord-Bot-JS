const { MessageEmbed } = require('discord.js')
const mongoose = require("mongoose");
const callSchema = require('../../schemas/call')
const calls = mongoose.model("calls")
const errHandler = require('../../snippets/errHandler');
const trackCommands = require('../../snippets/trackCommands');


module.exports = {
    name: 'limit',
    category: 'General',
    description: "Sets a user limit on the call you're in",
    slash: true,
    options: [{
        name: 'number',
        description: 'How many people are allowed',
        type: 'NUMBER',
        required: true,
    }],

    callback: ({ member, args, interaction, guild }) => {
        if (!member.voice.channel) { errHandler('noCall', interaction); return }
        let call = member.voice.channel
        let limitNum = parseInt(args[0])
        if (call.parent.name != "Custom Calls") { errHandler('noCustom', interaction); return }
        if (limitNum > 99 || limitNum < 0) { errHandler('userlimit', interaction); return }

        calls.findOne({ callID: call.id }, async function (err, found) {
            if (!found) { errHandler('fatal', interaction); return }
            const owner = guild.members.cache.get(found.ownerID)
            if (found.ownerID != member.id && !member.permissions.has('MANAGE_CHANNELS')) { errHandler('noPerm', interaction); return }
            call.setUserLimit(limitNum)
            const embed = new MessageEmbed()
                .setAuthor(`| ${member.displayName} has limited the call to ${limitNum} people`, `${member.displayAvatarURL()}`)
                .setColor(`#d0c7be`)    
            interaction.reply({ embeds: [embed], ephemeral: false })
        })

        trackCommands('limit')
    },
}