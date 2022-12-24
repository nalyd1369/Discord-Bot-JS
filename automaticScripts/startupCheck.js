const mongoose = require("mongoose");
const RegisterUser = require("../schemas/user")
const RegisterGuild = require("../schemas/guild")
const RegisterCalls = require("../schemas/call")
const users = mongoose.model("users")
const guilds = mongoose.model("guilds")
const calls = mongoose.model('calls')

module.exports = async (client) => {
    let totalUsers = 0
    let onUser = 0
    let createdUser = 0
    let createdGuilds = 0
    await client.guilds.cache.forEach(g => {totalUsers += g.memberCount})

    client.guilds.cache.forEach(guild => {
        guilds.findOne({ guildID: guild.id }, function (err, dbguild) {
            if (dbguild) {//check if guild exists
                guilds.updateOne({ gBelongsID: guild.id }, { $set: { guildName: guild.name } })//update existing guild

                guild.members.fetch().then(members => {
                    members.forEach(member => {
                        checkUser(member, guild)//update users
                    })
                })
            } else {//if guild got missed
                const guildObject = new RegisterGuild({
                    _id: mongoose.Types.ObjectId(),
                    guildName: guild.name,
                    guildID: guild.id,
                    loggingID: null,
                    joinMessage: "Welcome to the server {member.name}, hope you enjoy your stay",
                    leaveMessage: "{member.name} has left the server",
                    rejoinMessage: "Welcome back {member.name}, I'm returning your roles",
                    maxVcCount: 5,
                    maxUserCalls: 2,
                    vcTimeout: 5,
                    restoreRoles: true
                })
                guildObject.save()
                createdGuilds += 1;

                guild.members.fetch().then(members => {
                    members.forEach(member => {
                        checkUser(member, guild)//update users
                    })
                })
            }
        })

        function checkUser(member, guild) {
            onUser += 1
            console.log(`Updating ( ${onUser}/${totalUsers} ) - Created users(${createdUser}) / Created guilds(${createdGuilds}) - ${member.displayName} from ${member.guild.name}(${member.guild.memberCount})`)

            users.findOne({ uID: member.id, gBelongsID: guild.id }, function (err, foundUser) {
                if (foundUser) {//check if user exists
                    users.updateOne({ uID: member.id, gBelongsID: guild.id }, {
                        $set: {
                            uName: member.user.username,
                            gBelongsName: guild.name,
                            createdAt: new Date,
                        }
                    })
                }
            })
        }
    })

    calls.find({}, async function(err, found) {
        found.forEach(call => {
            if (!client.channels.cache.has(call.callID)) {
                calls.deleteOne({callID: call.callID}).then(console.log(`Info | Cleaned database of an unlinked call`))
            }
        })
    })
}