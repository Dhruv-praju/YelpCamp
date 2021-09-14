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
    },
    price:{
        type: Number,
        default:0,
        min:0
    },
    description:{
        type: String,
        default:'Donec et nisl velit. Duis non nisi interdum, convallis arcu ut, porttitor ante. Aliquam non scelerisque tellus. Integer in odio nec mi hendrerit ornare. Pellentesque pretium et est id porttitor. Nulla hendrerit metus sed tincidunt maximus. Suspendisse neque quam, viverra eget neque eget, venenatis suscipit nisl.'
    },
    location:{
        country:{
            type: String,
            default:'India',
            required: true,
        } ,
        state:{
            type: String,
            default:'Maharashtra'
        } ,
        city:{
            type: String,
            default:'Mumbai'
        } 
    }
})

// make a model out of schema
const Campground = new mongoose.model('Campground',campgroundSchema)

// export that model
module.exports = Campground