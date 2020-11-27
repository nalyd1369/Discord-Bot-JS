const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const firstMessage = require('./first-message.js')
const roleClaim = require('./role-claim.js')
const createChannel = require('./commands/misc/createChannel.js')

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
	readCommands('commands')

	client.user.setPresence({
		activity: {
		  name: `${config.prefix}help`,
		},
		status: "online"
	})
	.catch(console.error);

	console.log('The client is ready!')
	//firstMessage(client, '779039138870722591', "This bot is still in an extreme beta. Please DM Dylan with any bugs, feature requests, or improvements!\nThis bot is very experimental and will take a while to get nailed down, please be patient as he's being developed", ['👍'])
	//roleClaim(client)
})

client.login(config.token)