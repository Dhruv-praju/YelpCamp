const mongoose = require('mongoose')
const {Schema, model} = mongoose
const Review = require('./review')

// make campground schema
const campgroundSchema = new Schema({
    name:{
        type: String,
        trim:  true,
        required: [true, 'campground title must not be blank'],
        unique:true
    },
    images:[
        {
            url:String,
            filename:String
        }
    ],
    owner:{type:Schema.Types.ObjectId, ref:'User'},
    price:{
        type: Number,
        default:0,
        min:[0, 'campground price must be positive']
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
    },
    reviews:[
        {type:Schema.Types.ObjectId, ref:'Review'}
    ]
})

campgroundSchema.post('findOneAndDelete', async function(doc){
    await Review.deleteMany({
        _id:{
            $in: doc.reviews
        }
    })
})

// make a model out of schema
const Campground = new model('Campground',campgroundSchema)

// export that model
module.exports = Campground