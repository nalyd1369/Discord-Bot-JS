const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const mongoose = require("mongoose");
const callSchema = require('../schemas/call');
const errHandler = require("./errHandler");
const calls = mongoose.model("calls")

module.exports = async (interaction, call) => {
    if (!call) { return }
    let ownerList = []
    let adminList = []
    let membersList = []
    let maxPeople = call.userLimit
    const color = '#d0c7be'
    if (maxPeople == 0) { maxPeople = "∞" }

    if (interaction) {
        await calls.findOne({ interactionID: await interaction.id }, async function (err, dbCall) {
            if (!dbCall) { errHandler('fatal'); return }
            if (dbCall.GUIMessageID == '' || dbCall.GUIMessageID == null) { return }
            update(dbCall, interaction)
        }).clone()
    } else {
        await calls.findOne({ callID: await call.id }, async function (err, dbCall) {
            if (!dbCall) { return }
            if (dbCall.GUIMessageID == '' || dbCall.GUIMessageID == null) { return }
            const GUIChannel = await call.guild.channels.cache.get(dbCall.GUIChannelID)
            if (!GUIChannel) { return }
            const GUI = await GUIChannel.messages.fetch(`${dbCall.GUIMessageID}`).catch(err => console.log(err))
            if (!GUI) { return }
            update(dbCall, GUI)
        }).clone()
    }

    async function update(dbCall, GUI) {
        let owner = await call.guild.members.fetch(dbCall.ownerID)
        let callName = call.name
        let userName = ""
        if (callName.length > 37) {
            callName = callName.slice(0, 34)
            callName = callName += "..."
        }

        if (dbCall.private == false) {
            await call.members.forEach(member => {
                let activityList = []
                userName = "-"
                if (member.id == dbCall.ownerID) {
                    userName += `👑`
                } else if (member.permissions.has('MANAGE_CHANNELS')) {
                    userName += `🛡`
                }

                userName += `${member}`

                if (member.presence) {
                    member.presence.activities.forEach(activity => {
                        if (member.user.bot == false) {
                            if (activity.type != "CUSTOM") {
                                activityList.push(`${activity.name}`)
                            }
                        }
                    })
                }

                if (activityList.length > 0) { userName += ` | \`${activityList}\`` }
                userName += " \n"

                if (member.id == dbCall.ownerID) {
                    ownerList.push(userName)
                } else if (member.permissions.has('MANAGE_CHANNELS')) {
                    adminList.push(userName)
                } else {
                    membersList.push(userName)
                }
            })
            ownerList = ownerList.sort((a, b) => b.length - a.length);
            ownerList = ownerList.join('')
            adminList = adminList.sort((a, b) => b.length - a.length);
            adminList = adminList.join('')
            membersList = membersList.sort((a, b) => b.length - a.length);
            membersList = membersList.join('')
            let all = [ownerList, adminList, membersList]
            if (all.length > 10) {
                let extra = all.length - 9
                all = all.splice(9)
                all = all.push(`+ **${extra}** others`)
            }
            all = all.join("")
            if (all.length < 1) {
                all = "-"
            }

            const embed = new MessageEmbed()
                .setTitle(`:loud_sound: ${callName || '?'}`)
                .setColor(color)
                .addField(`:speaking_head:${call.members.size}/${maxPeople || '?'}                  :crown:${owner.displayName || '?'}                  :clock1030:${dbCall.timeLeft || '?'} min`, `-----------------------------------------------------`)
                .addField(`Users:`, `${all}`)
            const buttons = new MessageActionRow()

            if (!call.members.has(owner.id)) {
                buttons.addComponents(
                    new MessageButton()
                        .setCustomId('call_claim')
                        .setEmoji('👑')
                        .setLabel('Claim')
                        .setStyle('SUCCESS')
                )
            }

            buttons.addComponents(
                new MessageButton()
                    .setCustomId('call_refresh')
                    .setEmoji('🔁')
                    .setLabel('Refresh')
                    .setStyle('PRIMARY')
            )
            buttons.addComponents(
                new MessageButton()
                    .setCustomId('call_lock')
                    .setEmoji('🔒')
                    .setLabel('Lock')
                    .setStyle('PRIMARY')
            )
            buttons.addComponents(
                new MessageButton()
                    .setCustomId('call_close')
                    .setEmoji('❌')
                    .setLabel('Close Call')
                    .setStyle('DANGER')
            )
            await GUI.edit({ embeds: [embed], components: [buttons] }).catch(err => console.log(err))
        }

        if (dbCall.private == true) {
            const embed = new MessageEmbed()
                .setTitle(`:loud_sound: ${callName || '?'}`)
                .setColor(color)
                .addField(`:speaking_head:🔒/${maxPeople || '?'}                  :crown:${owner.displayName || '?'}                  :clock1030:${dbCall.timeLeft || '?'} min`, `-----------------------------------------------------`)
                .addField(`Users:`, `🔒`)
            const buttons = new MessageActionRow()

            if (!call.members.has(owner.id)) {
                buttons.addComponents(
                    new MessageButton()
                        .setCustomId('call_claim')
                        .setEmoji('👑')
                        .setLabel('Claim')
                        .setStyle('SUCCESS')
                )
            }

            buttons.addComponents(
                new MessageButton()
                    .setCustomId('call_refresh')
                    .setEmoji('🔁')
                    .setLabel('Refresh')
                    .setStyle('PRIMARY')
            )
            buttons.addComponents(
                new MessageButton()
                    .setCustomId('call_unlock')
                    .setEmoji('🔓')
                    .setLabel('Unlock')
                    .setStyle('PRIMARY')
            )
            buttons.addComponents(
                new MessageButton()
                    .setCustomId('call_close')
                    .setEmoji('❌')
                    .setLabel('Close Call')
                    .setStyle('DANGER')
            )
            await GUI.edit({ embeds: [embed], components: [buttons] }).catch(err => console.log(err))
        }
    }
}