const mongoose = require("mongoose");
const RegisterUser = require("../schemas/user")
const RegisterGuild = require("../schemas/guild")
const RegisterStats = require("../schemas/stats");
const stats = mongoose.model("stats")
const users = mongoose.model("users")
const guilds = mongoose.model("guilds")
//when leaving it updates the db, glitched i think
//concerned about lack of async on mongodb

module.exports = async (client) => {
    client.on('guildCreate', g => {
        console.log(`Info | Bot has joined ${g.name} : ${g.memberCount}`)
        guilds.findOne({ guildID: g.id }, function (err, dbGuild) {
            if (dbGuild) {//checks if already existing
                guilds.updateOne({ gBelongsID: g.id }, { $set: { guildName: g.name } })
                g.members.fetch().then(members => {
                    members.forEach(member => {
                        checkUser(member)
                    })
                })
            } else {//makes new obj
                const guildObject = new RegisterGuild({
                    _id: mongoose.Types.ObjectId(),
                    guildName: g.name,
                    guildID: g.id,
                    loggingID: null,
                    joinMessage: "Welcome to the server {member.name}, hope you enjoy your stay",
                    leaveMessage: "{member.name} has left the server",
                    rejoinMessage: "Welcome back {member.name}, I'm returning your roles",
                    maxVcCount: 10,
                    maxUserCalls: 2,
                    vcTimeout: 5,
                    restoreRoles: true
                })
                guildObject.save()

                g.members.fetch().then(members => {
                    members.forEach(member => {
                        checkUser(member)
                    })
                })
            }
        }).clone
    })

    //Updates guild name when changed
    client.on('guildUpdate', (oldGuild, newGuild) => {
        gID = newGuild.id
        guilds.updateOne({ guildID: gID }, { $set: { guildName: newGuild.name } })
        users.updateMany({ gBelongsID: gID }, { $set: { gBelongsName: newGuild.name } })
    })

    client.on('guildDelete', (guild) => {
        console.log(`Info | Kicked from ${guild.name}`)
    })

    client.on('guildMemberRemove', member => {
        checkUser(member)
        stats.updateOne({allTimeSavedUsers: {$gte: 0}}, {$inc:{allTimeSavedUsers: 1}}) //might not update
    })

    //updates userName
    client.on('userUpdate', (oldMember, newMember) => {
        users.updateMany({ uID: newMember.id }, { $set: { uName: newMember.name } })
    })

    function checkUser(member) {
        const guild = member.guild
        let memberRolesName = []
        let memberRolesID = []

        member.roles.cache.forEach(role => {
            if (role.name != "@everyone") {
                memberRolesName.push(role.name)
                memberRolesID.push(role.id)
            }
        })

        console.log(`Info | ${member.displayName} has left ${guild.name} with ${memberRolesID.length} roles`)

        users.findOne({ uID: member.id, gBelongsID: guild.id }, async function (err, foundUser) {
            if (foundUser) {//check if user exists
                await users.updateOne({ uID: member.id, gBelongsID: guild.id }, {
                    $set: {
                        uRolesName: memberRolesName,
                        uRolesID: memberRolesID,
                        createdAt: new Date,
                    }, function(err, user) { if (err) { console.log(err) }; if (user) { console.log(user) } }
                })
            } else {//if user got missed
                const userObject = new RegisterUser({
                    _id: mongoose.Types.ObjectId(),
                    uName: member.user.username,
                    uID: member.id,
                    gBelongsName: guild.name,
                    gBelongsID: guild.id,
                    uRolesName: memberRolesName,
                    uRolesID: memberRolesID,
                    createdAt: new Date,
                })
                userObject.save()
            }
        }).clone()
    }
}