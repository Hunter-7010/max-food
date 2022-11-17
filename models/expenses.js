const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Suppliers = require('./suppliers')

const expensesSchema = Schema({
    items: [{ name: String, price: Number,amount:Number, quantity: Number,unit:String,id:String,_id:false}],
    date:Date,
    notes: String,
    customerId: String,
    clientName: String,
    totalAmountAll: Number,
    clientAddress: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    activties:[]
})

module.exports = mongoose.model('Expense',expensesSchema)