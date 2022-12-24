const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const errHandler = require('../snippets/errHandler')

module.exports = (client) => {
    client.on('guildCreate', (guild) => {
        let givenEmbed = new MessageEmbed()
            .setColor('#d0c7be')
            .setAuthor(`${`Thanks for adding me to your server!`}`, `${client.user.displayAvatarURL()}`)
            .setDescription(`To see what I can do type \`/help\`\n
            When a user rejoins this server within a month of leaving, I'll restore the roles they had. Maybe try it out by kicking somebody from the server!\n
            I also offer temporary voice channels, try it out with \`/vc\`, you can also edit the call with commands found in \`/help\`\n
            To adjust any of my settings use \`/settings about\`
            `)
        if (guild.systemChannel) {guild.systemChannel.send({ embeds: [givenEmbed] }).catch(err => console.log(`messageError ${err}`));}
    })
}