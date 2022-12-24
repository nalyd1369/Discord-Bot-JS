const { MessageEmbed, MessageManager } = require("discord.js")

module.exports = async (error, interaction) => {
    console.log(`Error| ${error} / ${ interaction }`)
    if (!interaction) {console.log('wtf'); return}
    const pfp = interaction.client.user.displayAvatarURL()
    let embed = null
    let color = '#d0c7be'
    if (error == 'noCall') {embed = new MessageEmbed().setAuthor(`| You're not in call`, pfp).setColor(color)}
    if (error == 'noCustom') {embed = new MessageEmbed().setAuthor(`| This isn't a custom call`, pfp).setColor(color)}
    if (error == 'noPerm') {embed = new MessageEmbed().setAuthor(`| You don't have permission to do this`, pfp).setColor(color)}
    if (error == 'ownerInCall') {embed = new MessageEmbed().setAuthor(`| The owner is still in call`, pfp).setColor(color)}
    if (error == 'areOwner') {embed = new MessageEmbed().setAuthor(`| You're already owner`, pfp).setColor(color)}
    if (error == 'selfOwner') {embed = new MessageEmbed().setAuthor(`| You cannot give owner to yourself`, pfp).setColor(color)}
    if (error == 'longName') {embed = new MessageEmbed().setAuthor(`| That name is too long`, pfp).setColor(color)}
    if (error == 'tooManyCalls') {embed = new MessageEmbed().setAuthor(`| There are too many custom calls`, pfp).setColor(color)}
    if (error == 'userlimit') {embed = new MessageEmbed().setAuthor(`| the user limit can be between 0(∞) and 99`, pfp).setColor(color)}
    if (error == 'noMention') {embed = new MessageEmbed().setAuthor(`| You didn't mention a user`, pfp).setColor(color)}
    if (error == 'tooManyCallsSetting') {embed = new MessageEmbed().setAuthor(`| The maximum is 20 custom calls`, pfp).setColor(color)}
    if (error == 'tooMuchTime') {embed = new MessageEmbed().setAuthor(`| The maximum inactive time is 15 minutes`, pfp).setColor(color)}
    if (error == 'noCallClaim') {embed = new MessageEmbed().setAuthor(`| You cannot claim a call you're not in`, pfp).setColor(color)}
    if (error == 'noCallsFound') {embed = new MessageEmbed().setAuthor(`| No calls found`, pfp).setColor(color)}
    if (error == 'tooManyCallsPerUser') {embed = new MessageEmbed().setAuthor(`| You own too many calls`, pfp).setColor(color)}
    if (error == 'noGUI') {embed = new MessageEmbed().setAuthor(`| No GUI found`, pfp).setColor(color)}
    //if (error == '') {embed = new MessageEmbed().setAuthor(`| `, pfp).setColor(color)}
    if (error == 'fatal') {embed = new MessageEmbed().setAuthor(`| Fatal error oops`, pfp).setColor(color); console.log('fatal error')}
    
    await interaction.reply({embeds: [embed], ephemeral: true})
}