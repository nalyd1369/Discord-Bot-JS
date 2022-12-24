const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const mongoose = require('mongoose')
const Schema = require('../../schemas/guild')
const callSchema = require('../../schemas/call');
const errHandler = require('../../snippets/errHandler');
const trackCommands = require("../../snippets/trackCommands");
const guilds = mongoose.model("guilds")
const calls = mongoose.model("calls")

module.exports = {
    name: 'vc',
    category: 'General',
    description: 'Creates a custom call',
    expectedArgs: '<Name>',
    slash: true,
    options: [{
        name: 'name',
        description: 'Name of call',
        type: 'STRING',
        required: true,
    }],

    callback: async ({ interaction, text, guild, member }) => {
        let wantedChannel = await guild.channels.cache.find(channels => channels.name === "Custom Calls");
        if (!wantedChannel) { await guild.channels.create('Custom Calls', { type: 'GUILD_CATEGORY' }).then((newChannel) => { wantedChannel = newChannel }) }
        if (text.length > 100) { errHandler("longName", interaction); return }

        await guilds.findOne({ guildID: guild.id }, async function (err, dbGuild) {
            if (!guild) { await errHandler('fatal', interaction); return }
            const maxVcCount = dbGuild.maxVcCount || 10
            const maxUserCalls = dbGuild.maxUserCalls || 2
            const vcTimeout = dbGuild.vcTimeout || 5
            const callName = text || `${member.displayName}'s call`
            if (await wantedChannel.children.size >= maxVcCount) { errHandler('tooManyCalls', interaction); return }

            await calls.find({ ownerID: member.id, guildID: guild.id }, async function (err, dbCalls) {
                if (dbCalls.length >= maxUserCalls) { errHandler('tooManyCallsPerUser', interaction); return }
                console.log(dbCalls)

                await guild.channels.create(callName, {
                    type: 'GUILD_VOICE',
                    permissionOverwrites: [{
                        id: guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"],
                    }]
                }).then(async (call) => {
                    await call.setParent(wantedChannel.id)
                    await call.permissionOverwrites.edit(call.guild.roles.everyone, { VIEW_CHANNEL: null });

                    await createGUI(interaction, call, member, vcTimeout)
                    let GUIMessage = await interaction.fetchReply()

                    const callObject = new callSchema({
                        _id: mongoose.Types.ObjectId(),
                        callID: call.id,
                        guildID: guild.id,
                        GUIChannelID: interaction.channel.id,
                        GUIMessageID: await GUIMessage.id,
                        ownerID: member.id,
                        timeLeft: vcTimeout,
                        private: false,
                    })
                    callObject.save()
                })
            }).clone()
        }).clone()


        async function createGUI(interaction, call, owner, vcTimeout) {
            let ownerList = []
            let adminList = []
            let membersList = []
            let maxPeople = call.userLimit
            const color = '#d0c7be'
            if (maxPeople == 0) { maxPeople = "∞" }

            //modifying name of gui
            let callName = call.name
            if (callName.length > 28) {
                callName = callName.slice(0, 25)
                callName = callName += "..."
            }

            //creating the list of members
            await call.members.forEach(member => {
                if (member.id == owner.id) {
                    ownerList.push(`-👑${member}\n`)
                } else if (member.permissions.has('MANAGE_CHANNELS')) {
                    adminList.push(`-🛡${member}\n`)
                } else {
                    membersList.push(`-${member}\n`)
                }
            })
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
                .addField(`:speaking_head:${call.members.size}/${maxPeople || '?'}         :crown:${owner.displayName || '?'}         :clock1030:${vcTimeout || '?'} min`, `------------------------------------------`)
                .addField(`Users:`, `${all}`)
            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('call_refresh')
                        .setEmoji('🔁')
                        .setLabel('Refresh')
                        .setStyle('PRIMARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('call_lock')
                        .setEmoji('🔒')
                        .setLabel('Lock')
                        .setStyle('PRIMARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('call_close')
                        .setEmoji('❌')
                        .setLabel('Close Call')
                        .setStyle('DANGER')
                )
            await interaction.reply({ embeds: [embed], components: [buttons] }).catch(err => console.log(err))
        }
        trackCommands('vc')
    },
}