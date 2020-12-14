const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const schedule = require('./schedule.js')

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
//Nzc3MzI0OTg4MzE0ODEyNDU4.X7ByTw.__7qihlfemb5x2gf1SQIWQeiPyI