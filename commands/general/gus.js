const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const mongoose = require('mongoose')
const errHandler = require('../../snippets/errHandler')
const statsSchema = require("../../schemas/stats")
const stats = mongoose.model('stats')
const trackCommands = require('../../snippets/trackCommands')

module.exports = {
    name: 'gus',
    category: 'Testing',
    description: 'gus',
    cooldown: '20s',
    slash: true,

    callback: async ({ client, interaction }) => {
        let amountGussed = '?'
        const oldNick = interaction.guild.me.displayName
        interaction.guild.me.setNickname('gus', 'gus')
        
        await stats.findOne({ commands: { $gte: 0 } }, async function (err, result) {
            const Claim = new MessageEmbed()
            .setTitle(`gussified😨`)
            .setColor(`#d0c7be`)
            .setImage('https://i.postimg.cc/SQWVNn4b/IMG-5231.png')
            .setFooter(`I've gussed ${result.gussed} people`)

            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('heuh')
                        .setEmoji('😨')
                        .setLabel('heuh')
                        .setStyle('DANGER')
                )

            interaction.reply({ embeds: [Claim], components: [buttons], ephemeral: false }).catch(err => {console.log(err)})
        }).clone()

        setTimeout(function () {//sets delay of update for restore roles to not be overwritten
            if (oldNick != "gus") { interaction.guild.me.setNickname(oldNick) }
        }, 10000)

        trackCommands('gus')
    },
}