const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const mongoose = require("mongoose");
const guildSchema = require("../schemas/guild")
const userSchema = require("../schemas/user");
const statSchema = require('../schemas/stats')
const guilds = mongoose.model("guilds")
const users = mongoose.model("users")
const stats = mongoose.model('stats')
const errHandler = require('../snippets/errHandler')
//error handler is not allowed here
//returned rejected needs limit to not exceed amount of roles
//what the fuck is happening spaghetti code

module.exports = async (client) => {
    client.on('guildMemberAdd', (member) => {
        guild = member.guild
        given = []
        restricted = []
        if (!member.guild.systemChannel) { return }

        guilds.findOne({ guildID: guild.id }, async function (err, dbGuild) {
            if (!dbGuild) { errHandler('fatal'); return }
            await users.findOne({ uID: member.id, gBelongsID: member.guild.id }, async function (err, user) {
                if (!user) { sendMessage(member, dbGuild, "join"); return }//no user in db
                if (!user.uRolesID || dbGuild.restoreRoles == false) { sendMessage(member, dbGuild, "rejoin"); return }

                await user.uRolesID.forEach(async (role) => {
                    fullRole = guild.roles.fetch(role).then(fullRole => {
                        if (!fullRole) { errHandler('fatal'); return }
                        if (fullRole.position < guild.me.roles.highest.position) {
                            member.roles.add(role).catch(err => console.log("Couldn't add back role"))
                            given.push(` ${fullRole}`)
                        } else {
                            restricted.push(` ${fullRole}`)
                        }
                    })
                })

                sendMessage(member, dbGuild, "rejoinroles", given, restricted)

                await stats.updateOne({ commands: { $gte: 0 } }, { $inc: { returnedRoles: given.length } })
            }).clone()
        }).clone()
    })

    client.on('guildMemberRemove', (member) => {
        if (member.id == "777324988314812458") { return }
        guilds.findOne({ guildID: member.guild.id }, async function (err, dbGuild) {
            if (!dbGuild) { errHandler('fatal'); return }
            sendMessage(member, dbGuild, 'leave')
        }).clone()
    })

    const getMessage = (message, member) => {
        message = message.replace("{member.name}", member.displayName)
        message = message.replace("{guild.name}", member.guild.name)
        message = message.replace("{guild.membercount}", member.guild.memberCount)

        return message
    }

    const sendMessage = (member, dbGuild, action, given, restricted) => {
        let message = "off"
        let embed = new MessageEmbed().setColor('#d0c7be')
        if (action === "join") {message = getMessage(dbGuild.joinMessage, member)}
        if (action === "rejoin") {message = getMessage(dbGuild.rejoinMessage, member)}
        if (action === "rejoinroles") {message = getMessage(dbGuild.rejoinMessage, member)}
        if (action === "leave") {message = getMessage(dbGuild.leaveMessage, member)}

        if (message.toLowerCase() == "off") {return}

        if (action == "rejoinroles") {
            embed.setAuthor(`${message}`, member.displayAvatarURL())
            if (given.length > 0) {
                if (given.length > 20) {
                    let total = given.length
                    given.splice(19);
                    embed.addField(":scroll: Returned Roles:", `${given} + ${total - 20}`)
                } else {
                    embed.addField(":scroll: Returned Roles:", `${given}`)
                }
            }
            if (restricted.length > 0) {
                if (restricted.length > 20) {
                    let total = restricted.length
                    restricted.splice(19);
                    embed.addField(":x: Rejected Roles:", `${restricted} + ${total - 20}`)
                } else {
                    embed.addField(":x: Rejected Roles:", `${restricted}`)
                }
                embed.setFooter(`I can only return roles with lower permissions than me`)
            }
            member.guild.systemChannel.send({ embeds: [embed] }).catch(err => {console.log('No perm to send RR embed')})
            console.log(`Restore Roles| ${member.displayName} has roles ${given.length} returned and ${restricted.length} rejected`)
        } else {
            embed.setAuthor(`${message}`, member.displayAvatarURL())
        }
    }
}