const mongoose = require("mongoose");
const statsSchema = require("./../schemas/stats")
const stats = mongoose.model('stats')

module.exports = async (name) => {
    console.log(`Ran | ${name}`)
    await stats.updateOne({commands: {$gte: 0}}, {$inc:{commands: 1}})
}