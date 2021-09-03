const mongoose = require('mongoose')

// make campground schema
const campgroundSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    image:{
        type: String,
        required: true,
        unique:true
    }
})

// make a model out of schema
const Campground = new mongoose.model('Campground',campgroundSchema)

// export that model
module.exports = Campground