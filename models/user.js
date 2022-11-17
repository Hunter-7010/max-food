const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    activties:[]
})
UserSchema.plugin(passportLocalMongoose)//this adds functions to it like register
module.exports = mongoose.model('User', UserSchema)