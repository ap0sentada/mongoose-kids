const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
})

module.exports = mongoose.model('main', schema)
