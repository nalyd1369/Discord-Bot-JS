const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const errHandler = require('../../snippets/errHandler')
const trackCommands = require('../../snippets/trackCommands')
//doesn't count what was deleted
module.exports = {
    name: 'sweep',
    category: 'Testing',
    description: 'Delete my recent messages',
    slash: true,

    callback: async ({ client, interaction }) => {
        let botMessages = []
        
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {errHandler('noPerm', interaction)}
        await interaction.channel.messages.fetch({limit: 100}).then((messages) => {            
            messages.filter(m => m.author.id === '777324988314812458').forEach(msg => botMessages.push(msg));
            interaction.channel.bulkDelete(botMessages).catch(err => {console.log(err)})
        })
        const Claim = new MessageEmbed()
            .setAuthor(`Cleaned ${botMessages.length} old messages`, `${client.user.displayAvatarURL()}`)
            .setColor(`#d0c7be`)

        interaction.reply({ embeds: [Claim], ephemeral: false })

        trackCommands('sweep')
    },
}