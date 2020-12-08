const { Guild } = require('discord.js');
var cron = require('node-cron');
const mongo = require('./mongo.js')
const mongoose = require('mongoose'); 
const welcomeSchema = require('./schemas/welcome-schema.js');
var day = 'b';

var id = '757055975801749625'

module.exports = async (client) => {

    var task = cron.schedule('1 * * * * 1,2,3,4,5', () =>  {
        if(client.channels.cache.get(id)){
            if (day == 'a') {
                client.channels.cache.get(id).send(`<@&784301968688545802> Today is a A day!`)
                //console.log(`@&${wantedRole}" + "\nToday is a A day!`)
                day = "b"
                return
            }
            if (day == "b") {
                client.channels.cache.get(id).send(`<@&784301968688545802> Today is a B day!`)
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