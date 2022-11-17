const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ledgerSchema = Schema({
    name: String,
    customerId:String,
    amount:Number,
    note:String,
    method: String,
    date:Date,
    createdAt: {
        type: Date,
        default: new Date()
    },
    activties:[]
})

module.exports = mongoose.model('Ledger',ledgerSchema)