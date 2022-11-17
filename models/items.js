const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min:0
    },
    buyPrice: Number,
    category: {
        type: String,
    },
    quantity: {
        type: Number
    },
    amount:Number,
    createdAt: {
        type: Date,
        default: new Date()
    },
    unit: String,
    activties:[]
})

module.exports =mongoose.model('Items',itemSchema)