const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const trackCommands = require('../../snippets/trackCommands')

module.exports = {
    name: 'help',
    category: 'Testing',
    description: 'Sends help embed',
    slash: true,

    callback: ({ guild, client, interaction }) => {

        const embed = new MessageEmbed()
            .setColor(`#d0c7be`)
            .setAuthor(`Dumpster Fire Commands`, `${client.user.displayAvatarURL()}`)
            .setDescription(`The prefix for \`${guild.name}\` is \`/\``)
            .addField("**General Commands**", `
                **Help** - Shows this message
                **Clean** - Deletes all inactive calls
                **Sweep** - Clear my old messages
                **Stats** - Sends some info about me
            `)
            .addField("**Voice Channel Commands**", `
                **Vc <name>** - Creates a custom call
                **Limit** - Sets a user limit on a call
                **Owner** - Sets a new owner for the call
                **Rename** - Renames the call
                **Refresh** - Refreshes a calls gui
                **Claim** - Claims owner of the call
                **Lock** - Locks a current call
                **Unlock** - Unlocks a current call
                **Invite** - Invites a user to a locked call
                **Uninvite** - Uninvites a user to a locked call
                **Deletegui** - Deletes the GUI
                **Close** - Closes the call
            `)
            .addField("**Settings Commands**", `
                **Welcome** - My welcome message
                **Welcomeback** - My welcome back message
                **Goodbye** - My goodbye message
                **Max Call Count** - Max amount of calls
                **Max Calls per User** - Max Calls one user can own
                **VC Timeout** - Call inactivity before deletion
                **Restoreroles** - Should I restore roles
            `)

        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Invite Me')
                    .setStyle('LINK')
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=777324988314812458&permissions=8&scope=bot%20applications.commands`)
            )

            .addComponents(
                new MessageButton()
                    .setLabel('Vote')
                    .setStyle('LINK')
                    .setURL(`https://top.gg/bot/777324988314812458/vote`)
            )

        interaction.reply({ embeds: [embed], components: [buttons], ephereal: true })

        trackCommands('help')
    },
}