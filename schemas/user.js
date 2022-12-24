const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uName: String,
    uID: String,
    gBelongsName: String,
    gBelongsID: String,
    uRolesName: Array,
    uRolesID: Array,
    createdAt: Date,
})

module.exports = mongoose.model("users", userSchema);