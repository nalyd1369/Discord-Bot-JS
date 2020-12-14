const config = require('./config.json')
var cron = require('node-cron');
var day = 'a';

var id = '756714229624602767'

module.exports = async (client) => {
    /* var task = cron.schedule('0 0 14 * * 1-5', () =>  {
        if(client.channels.cache.get(id)){
            if (day == 'a') {
                client.channels.cache.get(id).send(`<@&786670045283614771> Today is a A day!\nUse ${config.prefix}update to toggle updates`)
                //console.log(`@&${wantedRole}" + "\nToday is a A day!`)
                day = "b"
                return
            }
            if (day == "b") {
                client.channels.cache.get(id).send(`<@&786670045283614771> Today is a B day!\nUse ${config.prefix}update to toggle updates`)
                //@&${wantedRole}" + 
                //console.log(`@&${wantedRole}" + "\nToday is a B day!`)
                day = "a"
                return
            }
        }
    }, {
        scheduled: true
    }); */
    var tuesday = cron.schedule('0 0 14 * * 2', () =>  {
        if(client.channels.cache.get(id)){
            client.channels.cache.get(id).send(`<@&786670045283614771> Today is a testing day, Today will be connections then 3rd period. Good luck!\nUse ${config.prefix}update to toggle updates`)
        }
    }, {
        scheduled: true
    });
    var wendsday = cron.schedule('0 0 14 * * 3', () =>  {
        if(client.channels.cache.get(id)){
            client.channels.cache.get(id).send(`<@&786670045283614771> Today is a testing day, Today will be 2nd then 6th period. Good luck!\nUse ${config.prefix}update to toggle updates`)
        }
    }, {
        scheduled: true
    }); 
    var thursday = cron.schedule('0 0 14 * * 4', () =>  {
        if(client.channels.cache.get(id)){
            client.channels.cache.get(id).send(`<@&786670045283614771> Today is a testing day, Today will be 1st then 4th period. Good luck!\nUse ${config.prefix}update to toggle updates`)
        }
    }, {
        scheduled: true
    }); 
    var friday = cron.schedule('0 0 14 * * 5', () =>  {
        if(client.channels.cache.get(id)){
            client.channels.cache.get(id).send(`<@&786670045283614771> Today is the final testing day, Today will be 7th then 8th period. Good luck and have good break!\nUse ${config.prefix}update to toggle updates`)
        }
    }, {
        scheduled: true
    }); 
    
    //task.start();
    tuesday.start();
    wendsday.start();
    thursday.start();
    friday.start();
}