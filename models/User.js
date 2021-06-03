const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    email: String,
    spices: Number,
    promo: String
})

module.exports = mongoose.model('user', userSchema)
