const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    name: String,
    date: String,
    asso: String,
    staffs: [{
        mail: String,
        spices: Number
    }],
})

module.exports = mongoose.model('event', eventSchema)
