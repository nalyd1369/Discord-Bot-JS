const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildName: String,
    guildID: String,
    loggingID: String,
    joinMessage: String,
    rejoinMessage: String,
    leaveMessage: String,
    restoreRoles: Boolean,
    maxUserCalls: Number,
    maxVcCount: Number,
    vcTimeout: Number,
})

module.exports = mongoose.model("guilds", guildSchema);