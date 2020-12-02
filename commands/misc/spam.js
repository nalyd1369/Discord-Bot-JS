/* const Discord = require("discord.js");
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
                const randomnumber1 = Math.floor(Math.random() * allowed.length)
                const randomnumber2 = Math.floor(Math.random() * allowed.length)
                message.channel.send(allowed[randomnumber].data.url).delete({ timeout: 5000 })
                //message.channel.send(allowed[randomnumber1].data.url)
                //message.channel.send(allowed[randomnumber2].data.url)
            } catch (err) {
                return console.log(err);
            }
        }
        if (arguments.toString().toLowerCase() === 'cringe' || arguments.toString().toLowerCase() === 'cringy') {
            try {
                const { body } = await snekfetch
                    .get('https://www.reddit.com/r/okaybuddyretard.json?sort=top&t=week')
                    .query({ limit: 400 });
                const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
                if (!allowed.length) return message.channel.send('It seems we are out of femboys!, Try again later.');
                const randomnumber = Math.floor(Math.random() * allowed.length)
                const randomnumber1 = Math.floor(Math.random() * allowed.length)
                const randomnumber2 = Math.floor(Math.random() * allowed.length)
                message.channel.send(allowed[randomnumber].data.url)
                message.channel.send(allowed[randomnumber1].data.url)
                message.channel.send(allowed[randomnumber2].data.url)
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
                    const randomnumber1 = Math.floor(Math.random() * allowed.length)
                    const randomnumber2 = Math.floor(Math.random() * allowed.length)
                    message.channel.send(allowed[randomnumber].data.url)
                    message.channel.send(allowed[randomnumber1].data.url)
                    message.channel.send(allowed[randomnumber2].data.url)
                } catch (err) {
                    return console.log(err);
                }
            } else {
                message.channel.send('Sorry this library is only allowed in nsfw channels!')
            }
        }
        if (arguments.toString().toLowerCase() === 'joseph' || arguments.toString().toLowerCase() === 'hot man') {
            try {
                message.channel.send("https://youtu.be/3IrqSADCxH8")
                message.channel.send("https://youtu.be/3IrqSADCxH8")
                message.channel.send("https://youtu.be/3IrqSADCxH8")
            } catch (err) {
                return console.log(err);
            }
        }
    },
    permissions: "",
    requiredRoles: [],
} */