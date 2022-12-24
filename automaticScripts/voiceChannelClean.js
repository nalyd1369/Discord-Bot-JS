const mongoose = require("mongoose");
const RegisterCall = require("../schemas/call")
var cron = require('node-cron');
const updateGUI = require("./../snippets/updateGUISnip");
const calls = mongoose.model("calls")

module.exports = async (client) => {
    var task = cron.schedule('*/1 * * * *', async () => {
        client.guilds.cache.forEach(async (guild) => {
            const voiceChannels = await guild.channels.cache.filter(c => c.type === 'GUILD_VOICE');
            var wantedChannel = await guild.channels.cache.find(channels => channels.name === "Custom Calls");
            for (const [id, voiceChannel] of voiceChannels) {
                if (voiceChannel.parent === wantedChannel) {
                    if (voiceChannel.members.size != 0) { await calls.updateOne({ callID: voiceChannel.id }, { $set: { timeLeft: 5 } }); return }
                    else {await calls.updateOne({ callID: voiceChannel.id }, { $inc: { timeLeft: -1 } })}
                    updateGUI(null, voiceChannel)

                    await calls.findOne({ callID: voiceChannel.id, timeLeft: { $lte: 0 } }, async function (err, dbCall) {
                        if (!dbCall) { return }
                        console.log(`Info | ${voiceChannel.name} from ${guild.name} has been destroyed`)
                        if (dbCall.GUIChannelID != null || dbCall.GUIChannelID != '') {
                            const GUIChannel = voiceChannel.guild.channels.cache.get(dbCall.GUIChannelID)
                            if (GUIChannel) {
                                const GUI = await GUIChannel.messages.fetch(`${dbCall.GUIMessageID}`).catch(err=>console.log(err))
                                if (GUI) { GUI.delete().catch(err => console.log(err)) }
                            }
                        }
                        await calls.deleteOne({ callID: voiceChannel.id })
                        voiceChannel.delete().catch(err => console.log(err))
                    }).clone()
                }
            }
        })
    })
    task.start()
};//probs unoptimized but idgaf 