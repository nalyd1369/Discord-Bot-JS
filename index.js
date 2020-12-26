const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const schedule = require('./schedule.js')
const automod = require('./automod')
const voiceChannelClean = require('./voiceChannelClean')

client.on('ready', async () => {

	const baseFile = 'command-base.js'
	const commandBase = require(`./commands/${baseFile}`)

  	const readCommands = (dir) => {
    	const files = fs.readdirSync(path.join(__dirname, dir))
    	for (const file of files) {
      		const stat = fs.lstatSync(path.join(__dirname, dir, file))
      		if (stat.isDirectory()) {
        		readCommands(path.join(dir, file))
      		} else if (file !== baseFile) {
        		const option = require(path.join(__dirname, dir, file))
        		commandBase(client, option)
      		}
    	}
	}
 
	console.log(`${client.guilds.cache.size} servers`)

	readCommands('commands')
	automod(client)

	client.user.setPresence({
		activity: {
		  name: `${config.prefix}help`,
		},
		status: "online"
	})
	.catch(console.error);

	schedule(client)
	console.log('The client is ready!')
})

client.login(config.token)
//NzgzODQyNzU5MDQzNDQ4ODMy.X8godA.9whLcyzejOB0wyke_xsvLOOrVZo