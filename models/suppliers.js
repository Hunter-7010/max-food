const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Expenses = require('./expenses')


const supplierSchema = Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    nip:String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    totalDebit: Number,
    totalCredit: Number,
    balance: Number,
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Expenses'
        }
    ],
    activties:[]
})


module.exports = mongoose.model('Supplier', supplierSchema)
