const mongoose = require('mongoose')
const {Schema, model} = mongoose

const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email:{
        type: String,
        trim: true,
        required: [true, 'Email Id cannot be blank'],
        unique: [true, 'Please enter a different Email Id']
    }
})

userSchema.plugin(passportLocalMongoose)    // this will automatically add username, hash passwd and salt

const User = new model('User', userSchema)

module.exports = User