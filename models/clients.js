const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Orders = require('./orders')


const clientSchema = Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    route: String,
    nip:String,
    specialPrice:[{name:String,itemId: String, price:Number,_id:false}],
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
            ref: 'Orders'
        }
    ],
    activties:[]
})


module.exports = mongoose.model('Clients', clientSchema)

