const config = require('./filter.json')

module.exports = async (client) => {
    client.on('message', message => {
        if(config.FILTER_LIST.some(word => message.content.toLowerCase().includes(word))){
            message.delete()
        }
    })

    client.on('messageUpdate', message => {
        if(config.FILTER_LIST.some(word => message.content.toLowerCase().includes(word))){
            message.delete()
        }
    })
}