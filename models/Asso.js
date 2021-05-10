const mongoose = require('mongoose')

const assoSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    name: String,
    email: String,
    password: String,
    members: [{
        email: String,
        promo: Number,
        job: String,
    }],
    budgets: [{
        date: String,
        budget: Number,
        description: String,
    }],
    Infos: [{
        date: String,
        body: String,
    }],
})

module.exports = mongoose.model('asso', assoSchema)