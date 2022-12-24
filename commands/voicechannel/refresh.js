const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const mongoose = require("mongoose");
const callSchema = require('../../schemas/call')
const calls = mongoose.model("calls")
const errHandler = require('../../snippets/errHandler');
const trackCommands = require('../../snippets/trackCommands');
//needs to delete old gui

module.exports = {
    name: 'refresh',
    category: 'General',
    description: 'Refreshes your calls gui',
    slash: true,

    callback: async ({ member, interaction }) => {
        if (!member.voice.channel) { errHandler('noCall', interaction); return }
        let call = member.voice.channel
        if (call.parent.name != "Custom Calls") { errHandler('noCustom', interaction); return }
        let ownerList = []
        let adminList = []
        let membersList = []
        let maxPeople = call.userLimit
        const color = '#d0c7be'
        if (maxPeople == 0) { maxPeople = "∞" }

        await calls.findOne({ callID: await call.id }, async function (err, dbCall) {
            if (!dbCall) { errHandler('fatal'); return }
            let owner = await call.guild.members.fetch(dbCall.ownerID)
            let userName = ""
            let callName = call.name

            //delete old gui
            const GUIChannel = await call.guild.channels.cache.get(dbCall.GUIChannelID)
            if (GUIChannel) {
                const OldGUI = await GUIChannel.messages.fetch(`${dbCall.GUIMessageID}`).catch(err => console.log('WARN | failed to delete old gui'))
                if (OldGUI) { OldGUI.delete().catch(err => {console.log(err)}) }
            }

            //edit gui name
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
                    
                    if (activityList.length > 0) {userName += ` | \`${activityList}\``}
                    userName += " \n"

                    if (member.id == dbCall.ownerID) {
                        ownerList.push(userName)
                    } else if (member.permissions.has('MANAGE_CHANNELS')) {
                        adminList.push(userName)
                    } else {
                        membersList.push(userName)
                    }
                })
                ownerList = ownerList.sort((a,b) => b.length - a.length);
                ownerList = ownerList.join('')
                adminList = adminList.sort((a,b) => b.length - a.length);
                adminList = adminList.join('')
                membersList = membersList.sort((a,b) => b.length - a.length);
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
                await interaction.reply({ embeds: [embed], components: [buttons] }).catch(err => console.log(err))
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
                await interaction.reply({ embeds: [embed], components: [buttons] }).catch(err => console.log(err))
            }
        }).clone()
        let GUIMessage = await interaction.fetchReply()
        await calls.updateOne({ callID: call.id }, { $set: { GUIMessageID: GUIMessage.id } })
        trackCommands('refresh')
    }
}