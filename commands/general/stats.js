const { MessageEmbed } = require('discord.js')
const mongoose = require('mongoose')
const statsSchema = require("../../schemas/stats")
const userSchema = require('../../schemas/user')
const guildSchema = require('../../schemas/guild')
const errHandler = require('../../snippets/errHandler')
const trackCommands = require('../../snippets/trackCommands')
const stats = mongoose.model('stats')
const users = mongoose.model('users')
const guilds = mongoose.model('guilds')

module.exports = {
    name: 'stats',
    category: 'Testing',
    description: 'Sends some stats',
    slash: true,

    callback: async ({ client, interaction }) => {
        const owner = await client.users.fetch('344873889505083392')
        //users
        const guildSize = client.guilds.cache.size
        let totalMembers = 0;
        let storedGuilds = '?'
        let storedMembers = '?'
        
        //ram
        let usedRAM = process.memoryUsage().heapUsed / 1024 / 1024
        usedRAM = Math.round(usedRAM)
        const percentageRAM = ((usedRAM / 1866) * 100).toFixed(1)

        client.guilds.cache.forEach(g => {
            totalMembers += g.memberCount
        })

        await guilds.count({}, function(err, count) {
            storedGuilds = count
        }).clone()

        await users.count({}, function(err, count) {
            storedMembers = count
        }).clone()

        let seconds = parseInt((client.uptime / 1000) % 60)
        let minutes = parseInt((client.uptime / (1000 * 60)) % 60)
        let hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24)
        let days = parseInt((client.uptime / (1000 * 60 * 60 * 24)) % 31)

        await stats.findOne({ commands: { $gte: 0 } }, async function (err, result) {
            if (!result) { errHandler("fatal", interaction); return }
            const embed = new MessageEmbed()
                .setTitle("__**Dumpster Fire Stats**__")
                .setColor(`#d0c7be`)
                .addField('**Users**', `${addCommas(totalMembers)}`, true)
                .addField('**Stored Users**', `${addCommas(storedMembers)}`, true)
                .addField(`\u200B`, `\u200B`, true)

                .addField('**Guilds**', `${addCommas(guildSize)}`, true)
                .addField('** Stored Guilds**', `${addCommas(storedGuilds)}`, true)
                .addField(`\u200B`, `\u200B`, true)
                
                .addField('**Info**', `
                    Online for: \`${days}d ${hours}h ${minutes}m ${seconds}s\`
                    Ram: \`${usedRAM}/1866MB (${percentageRAM}%)\`
                    Commands Ran: \`${addCommas(result.commands)}\`
                    Roles Returned: \`${addCommas(result.returnedRoles)}\`
                    All-time Users: \`${addCommas(result.allTimeSavedUsers)}\`
                    Owner: ${owner}
                    Version: \`1.0\`\n`
                , false)

            await interaction.reply({embeds: [embed], ephemeral: true})
        }).clone()

        function addCommas(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }

        trackCommands('stats')
    },
}