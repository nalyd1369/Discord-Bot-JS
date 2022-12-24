const mongoose = require("mongoose");
const callSchema = require('../../schemas/call')
const trackCommands = require('../../snippets/trackCommands');
const errHandler = require('../../snippets/errHandler');
const { MessageEmbed } = require("discord.js");
const calls = mongoose.model("calls")

module.exports = {
    name: 'unlock',
    category: 'General',
    description: 'Unlocks your current call',
    slash: true,

    callback: async ({ member, interaction, guild }) => {
        if (!member.voice.channel) { errHandler('noCall', interaction); return }
        let call = member.voice.channel
        if (call.parent.name != "Custom Calls") { errHandler('noCustom', interaction); return }

        calls.findOne({ callID: call.id }, async function (err, found) {
            if (!found) { errHandler('fatal', interaction); return }
            if (found.ownerID != member.id && !member.permissions.has('MANAGE_CHANNELS')) { errHandler('noPerms', interaction); return }
            //maybe wipe people who previously could see it
            call.permissionOverwrites.edit(guild.roles.everyone, { VIEW_CHANNEL: null });
            await calls.updateOne({ callID: call.id }, { $set: { private: false } })

            const embed = new MessageEmbed()
                .setAuthor(`| You've unlocked the call`, `${member.displayAvatarURL()}`).setColor(`#d0c7be`)
            interaction.reply({embeds: [embed], ephemeral: true})
        })
        trackCommands('unlock')
    }
}