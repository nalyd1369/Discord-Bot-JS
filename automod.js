const config = require('./config.json')

module.exports = async (client) => {
    client.on('message', message => {
        if(config.FILTER_LIST.some(word => message.content.toLowerCase().includes(word))){
            message.delete()
        }
    })
}