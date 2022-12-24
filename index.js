const DiscordJS = require('discord.js')
const mongoose = require('mongoose')
const { Intents } = DiscordJS
const WOKCommands = require('wokcommands')
const path = require('path')
const config = require('./config.json')
const voiceChannelClean = require('./automaticScripts/voiceChannelClean')
const startupCheck = require('./automaticScripts/startupCheck')
const updateDatabase = require('./automaticScripts/updateDatabase')
const restoreRoles = require('./automaticScripts/restoreroles')
const joinMessage = require('./automaticScripts/joinMessage')
const buttonGUI = require('./automaticScripts/buttonGUI')

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
})

client.on('ready', async () => {
  voiceChannelClean(client)
  buttonGUI(client)
  updateDatabase(client)
  restoreRoles(client)
  joinMessage(client)
  startupCheck(client)

  client.user.setPresence({ activities: [{ name: '/help' }], status: 'online' });

  await mongoose.connect(
    config.mongoPath || '',
    { keepAlive: true }
  )

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    ignoreBots: true,
    mongoUri: config.mongoPath,
    botOwners: ["344873889505083392", "744028002442281050", "607278720855834624"],
    testServers: ['757055975357415567', '906789828924936213'],
    disabledDefaultCommands: [
      'help',
      'command',
      'language',
      'prefix',
      'requiredrole',
      'channelonly'
    ],
  })

  client.guilds.cache.forEach(guild => {
    console.log(`${guild.memberCount} | ${guild.name} -- ${guild.id}`)
  })
})
client.login(config.token)