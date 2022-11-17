const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = Schema({
    items: [{ name: String, price: Number,amount: Number, quantity: Number,unit:String,id:String,_id:false}],
    date:Date,
    route:String,
    notes: String,
    customerId: String,
    clientName: String,
    totalAmountAll: Number,
    clientAddress: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    activties:[],
    preBalance: Number,
    nip: String,
    buyPrice: Number,
})

module.exports = mongoose.model('Orders',orderSchema)
