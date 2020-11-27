const Discord = require("discord.js");
const snekfetch = require('snekfetch');

module.exports = {
    commands: ["spam"],
    expectedArgs: '<Memes, Femboy>',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: 1,
    callback: async (message, arguments, text) => { 
        if (arguments.toString().toLowerCase() === 'meme' || arguments.toString().toLowerCase() === 'memes') {
            try {
                const { body } = await snekfetch
                    .get('https://www.reddit.com/r/dankmemes.json?sort=top&t=week')
                    .query({ limit: 800 });
                const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
                if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
                const randomnumber = Math.floor(Math.random() * allowed.length)
                const embed = new Discord.MessageEmbed()
                    .setColor(0x00A2E8)
                    .setImage(allowed[randomnumber].data.url)
                message.channel.send(embed)
            } catch (err) {
                return console.log(err);
            }
        }
        if (arguments.toString().toLowerCase() === 'femboy' || arguments.toString().toLowerCase() === 'femboys') {
            try {
                const { body } = await snekfetch
                    .get('https://www.reddit.com/r/femboy.json?sort=top&t=year')
                    .query({ limit: 400 });
                const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
                if (!allowed.length) return message.channel.send('It seems we are out of femboys!, Try again later.');
                const randomnumber = Math.floor(Math.random() * allowed.length)
                const embed = new Discord.MessageEmbed()
                    .setColor(0x00A2E8)
                    .setImage(allowed[randomnumber].data.url)
                message.channel.send(embed)
            } catch (err) {
                return console.log(err);
            }
        }
        if (arguments.toString().toLowerCase() === 'legs' || arguments.toString().toLowerCase() === 'leg') {
            if (message.channel.nsfw) {
                try {
                    const { body } = await snekfetch
                        .get('https://www.reddit.com/r/animelegs.json?sort=top&t=alltime')
                        .query({ limit: 800 });
                    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
                    if (!allowed.length) return message.channel.send('It seems we are out of legs!, Try again later.');
                    const randomnumber = Math.floor(Math.random() * allowed.length)
                    const embed = new Discord.MessageEmbed()
                        .setColor(0x00A2E8)
                        .setImage(allowed[randomnumber].data.url)
                    message.channel.send(embed)
                } catch (err) {
                    return console.log(err);
                }
            } else {
                message.channel.send('Sorry this library is only allowed in nsfw channels!')
            }
        }
    },
    permissions: "",
    requiredRoles: [],
}