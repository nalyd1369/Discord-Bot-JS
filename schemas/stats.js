const mongoose = require("mongoose");

const statsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    commands: Number,
    returnedRoles: Number,
    gussed: Number,
    allTimeSavedUsers: Number,
})

module.exports = mongoose.model("stats", statsSchema);