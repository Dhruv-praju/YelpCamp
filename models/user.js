const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose)    // this will automatically add username, hash passwd and salt

const User = new mongoose.model('User', userSchema)

module.exports = User