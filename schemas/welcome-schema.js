const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const welcomeSchema = mongoose.Schema({
  _id: reqString,
  channelID: reqString,
})

const Model = mongoose.model
const schedule = Model('welcome-channels', welcomeSchema)