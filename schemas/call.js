const mongoose = require("mongoose");

const callSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    callID: String,
    guildID: String,
    GUIChannelID: String,
    GUIMessageID: String,
    ownerID: String,
    timeLeft: Number,
    private: Boolean,
})

module.exports = mongoose.model("calls", callSchema);