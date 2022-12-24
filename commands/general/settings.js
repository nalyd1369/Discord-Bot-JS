const { MessageEmbed } = require('discord.js')
const mongoose = require('mongoose')
const guildSchema = require('../../schemas/guild')
const guilds = mongoose.model('guilds')
const errHandler = require('../../snippets/errHandler')
const trackCommands = require('../../snippets/trackCommands')

module.exports = {
    name: 'settings',
    category: 'Testing',
    description: 'Change my settings',
    slash: true,
    options: [{
        name: 'about',
        description: 'Show settings info',
        type: 'SUB_COMMAND',
    },
    {
        name: 'join',
        description: 'Edit welcome message',
        type: 'SUB_COMMAND',
        options: [{
            name: 'message',
            description: 'New welcome message',
            type: 'STRING',
            required: true,
        }]
    },
    {
        name: 'rejoin',
        description: 'Edit welcome back message',
        type: 'SUB_COMMAND',
        options: [{
            name: 'message',
            description: 'New welcome back message',
            type: 'STRING',
            required: true,
        }]
    },
    {
        name: 'leave',
        description: 'Edit leave messsage',
        type: 'SUB_COMMAND',
        options: [{
            name: 'message',
            description: 'New leave message',
            type: 'STRING',
            required: true,
        }]
    },
    {
        name: 'maxcalls',
        description: 'Edit max calls',
        type: 'SUB_COMMAND',
        options: [{
            name: 'number',
            description: 'Max amount of custom calls',
            type: 'NUMBER',
            required: true,
        }]
    },
    {
        name: 'time',
        description: 'Edit inactive call time',
        type: 'SUB_COMMAND',
        options: [{
            name: 'number',
            description: 'New inactive time',
            type: 'NUMBER',
            required: true,
        }]
    },
    {
        name: 'restoreroles',
        description: 'Edit role restoration',
        type: 'SUB_COMMAND',
        options: [{
            name: 'boolean',
            description: 'Should I restore roles',
            type: 'BOOLEAN',
            required: true,
        }]
    }],

    callback: async ({ client, interaction, guild, member }) => {
        let command = await interaction.options.getSubcommand()

        if (command == "about") {
            guilds.findOne({ guildID: guild.id }, async function (err, dbGuild) {
                const settings = new MessageEmbed()
                    .setAuthor(`${guild.name} settings`, `${client.user.displayAvatarURL()}`)
                    .setColor(`#d0c7be`)
                    .addFields(
                        { name: `Join Message`, value: `\`${dbGuild.joinMessage}\`` },
                        { name: `Rejoin Message`, value: `\`${dbGuild.rejoinMessage}\`` },
                        { name: `Leave Message`, value: `\`${dbGuild.leaveMessage}\`` },
                        { name: `Max Amount of Calls`, value: `\`${dbGuild.maxVcCount}\`` },
                        { name: `Max Calls per Person`, value: `\`${dbGuild.maxUserCalls}\`` },
                        { name: `Call Inactivity Before Delete`, value: `\`${dbGuild.vcTimeout}\`` },
                        { name: `Restore Roles`, value: `\`${dbGuild.restoreRoles}\`` },
                    )
                    .setFooter(`Use {member.name}, {guild.name}, {guild.membercount} in a message to have that appear \n(ex. hello {member.name}!)\nSet a message to "off" to turn it off`)
    
                await interaction.reply({ embeds: [settings], ephemeral: true })
            }).clone
        }

        if (command == "join") {
            const setting = await interaction.options.getString('message')
            if (setting.length > 100) {errHandler("longName", interaction); return}
            await guilds.updateOne({ guildID: guild.id }, { $set: { joinMessage: setting }})
            sendMessage(member, setting);
        }

        if (command == "rejoin") {
            const setting = await interaction.options.getString('message')
            if (setting.length > 100) {errHandler("longName", interaction); return}
            await guilds.updateOne({ guildID: guild.id }, { $set: { rejoinMessage: setting }})
            sendMessage(member, setting);
        }

        if (command == "leave") {
            const setting = await interaction.options.getString('message')
            if (setting.length > 100) {errHandler("longName", interaction); return}
            await guilds.updateOne({ guildID: guild.id }, { $set: { leaveMessage: setting }})
            sendMessage(member, setting);
        }

        if (command == "maxcalls") {
            const setting = await interaction.options.getNumber('number')
            if (setting > 20) {errHandler("tooManyCallsSetting", interaction); return}
            await guilds.updateOne({ guildID: guild.id }, { $set: { maxVcCount: setting }})
            sendMessage(member, setting);
        }

        if (command == "maxusercalls") {
            const setting = await interaction.options.getNumber('number')
            await guilds.updateOne({ guildID: guild.id }, { $set: { maxUserCalls: setting }})
            sendMessage(member, setting);
        }

        if (command == "time") {
            const setting = await interaction.options.getNumber('number')
            if (setting > 15) {errHandler("tooMuchTime", interaction); return}
            await guilds.updateOne({ guildID: guild.id }, { $set: { vcTimeout: setting }})
            sendMessage(member, setting);
        }

        if (command == "restoreroles") {
            const setting = await interaction.options.getBoolean('boolean')
            await guilds.updateOne({ guildID: guild.id }, { $set: { restoreRoles: setting }})
            sendMessage(member, setting);
        }


        function sendMessage(member, setting) {
            const embed = new MessageEmbed()
                .setAuthor(` | Set ${command} to "${setting}"`, `${member.displayAvatarURL()}`)
                .setColor(`#d0c7be`)
            interaction.reply({embeds: [embed], ephemeral: true})
        }

        trackCommands('settings')
    }
}