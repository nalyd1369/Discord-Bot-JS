const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const mongoose = require("mongoose");
const callSchema = require("../schemas/call");
const errHandler = require('../snippets/errHandler')
const updateGUI = require('../snippets/updateGUISnip')
const calls = mongoose.model("calls")
//errhandler
module.exports = (client) => {
    const color = "#d0c7be"

    client.on('channelUpdate', async (oldChannel, newChannel) => {
        if (!newChannel) { return }
        updateGUI(null, newChannel)
    })

    client.on('voiceStateUpdate', async (oldState, newState) => {//check if the call name is custom
        updateGUI(null, newState.channel || oldState.channel)
    })

    client.on('presenceUpdate', async (oldPresence, newPresence) => {
        if (newPresence.member) {
            updateGUI(null, newPresence.member.voice.channel)
        }
    })

    client.on('interactionCreate', (btnInt) => {
        if (!btnInt.isButton()) { return }

        if (btnInt.customId == "heuh") {
            btnInt.reply({ content: '😨' })
        }

        calls.findOne({ GUIMessageID: btnInt.message.id }, async function (err, dbCall) {
            if (!dbCall) { return }
            const call = await client.channels.cache.get(`${dbCall.callID}`)
            if (!call) { return }

            if (btnInt.customId == "call_claim") {
                if (btnInt.member.id == dbCall.ownerID) { errHandler('areOwner', btnInt); return }
                if (btnInt.member.voice.channel == null || btnInt.member.voice.channel.id != dbCall.callID) { errHandler('noCallClaim', btnInt); return }
                const owner = await btnInt.guild.members.fetch(dbCall.ownerID)
                if (owner.voice.channelId == call.id && !btnInt.member.permissions.has('MANAGE_CHANNELS')) { errHandler('ownerInCall', btnInt); return }
                await calls.updateOne({ callID: call.id }, { $set: { "ownerID": btnInt.member.id } })
                embed = new MessageEmbed().setAuthor(`${btnInt.member.displayName} has claimed the call`, btnInt.member.displayAvatarURL()).setColor(color)
                btnInt.reply({ embeds: [embed], ephemeral: false })
                updateGUI(btnInt.message, call)
            } else {//you gotta
                if (btnInt.member.id != dbCall.ownerID && !btnInt.member.permissions.has('MANAGE_CHANNELS')) { errHandler("noPerm", btnInt); return } //only no admin

                if (btnInt.customId == "call_lock") {//update gui and buttons
                    await calls.updateOne({ callID: call.id }, { $set: { private: true } })
                    call.permissionOverwrites.edit(btnInt.member, { VIEW_CHANNEL: true });
                    call.members.forEach(member => {
                        call.permissionOverwrites.edit(member, { VIEW_CHANNEL: true });
                    })
                    call.permissionOverwrites.edit(call.guild.roles.everyone, { VIEW_CHANNEL: false });
                    updateGUI(btnInt.message, call)
                    btnInt.deferUpdate()//to silence reply
                }

                if (btnInt.customId == "call_unlock") {//update gui and buttons
                    await calls.updateOne({ callID: call.id }, { $set: { private: false } })
                    call.permissionOverwrites.edit(call.guild.roles.everyone, { VIEW_CHANNEL: null });
                    updateGUI(btnInt.message, call)
                    btnInt.deferUpdate()//to silence reply
                }

                if (btnInt.customId == "call_close") {
                    embed = new MessageEmbed().setAuthor(`${btnInt.member.displayName} has closed the call`, btnInt.member.displayAvatarURL()).setColor(color)
                    btnInt.reply({ embeds: [embed], ephemeral: false })
                    calls.deleteOne({ callID: call.id }, function (err, dbCall) { if (err) { console.log(err) } }).clone()//fix later
                    btnInt.message.delete()
                    call.delete()
                }

                if (btnInt.customId == "call_refresh") {
                    const owner = await btnInt.guild.members.fetch(dbCall.ownerID)
                    let callName = call.name
                    let ownerList = []
                    let adminList = []
                    let membersList = []
                    let maxPeople = call.userLimit
                    let userName = ""
                    const color = '#d0c7be'
                    if (maxPeople == 0) { maxPeople = "∞" }

                    btnInt.message.delete()

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

                            if (activityList.length > 0) { userName += `\`${activityList}\`` }
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
                        await btnInt.reply({ embeds: [embed], components: [buttons] }).catch(err => console.log(err))
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
                        await btnInt.reply({ embeds: [embed], components: [buttons] }).catch(err => console.log(err))
                    }
                    let GUIMessage = await btnInt.fetchReply()
                    await calls.updateOne({ callID: call.id }, { $set: { GUIMessageID: GUIMessage.id } })
                }
            }
        }).clone()//patch fix later
    })
}