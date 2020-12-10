const { Guild } = require('discord.js');
const config = require('./config.json')
var cron = require('node-cron');
const mongo = require('./mongo.js')
const mongoose = require('mongoose'); 
const welcomeSchema = require('./schemas/welcome-schema.js');
const { Config } = require('git');
var day = 'a';

var id = '756714229624602767'

module.exports = async (client) => {
    var task = cron.schedule('* * 8 * * 1,2,3,4,5', () =>  {
        if(client.channels.cache.get(id)){
            if (day == 'a') {
                client.channels.cache.get(id).send(`<@&786670045283614771> Today is a A day!\nUse ${config.prefix}update to toggle updates`)
                //console.log(`@&${wantedRole}" + "\nToday is a A day!`)
                day = "b"
                return
            }
            if (day == "b") {
                client.channels.cache.get(id).send(`<@786670045283614771> Today is a B day!\nUse ${config.prefix}update to toggle updates`)
                //@&${wantedRole}" + 
                //console.log(`@&${wantedRole}" + "\nToday is a B day!`)
                day = "a"
                return
            }
        }
    }, {
        scheduled: true
    });
    
    task.start();
}