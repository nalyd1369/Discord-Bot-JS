const config = require('./config.json')
var cron = require('node-cron');
var day = 'a';

var id = '756714229624602767'

module.exports = async (client) => {
    var task = cron.schedule('0 0 14 * * 1-5', () =>  {
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
    });
    
    task.start();
}