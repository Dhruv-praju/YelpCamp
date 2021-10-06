const mongoose = require('mongoose')
const {Schema, model} = mongoose

const reviewSchema = Schema({
    rating:{
        type:Number,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        trim: true,
        required:[true, 'Review text must not be empty']
    },
    author:{type:Schema.Types.ObjectId, ref:'User'}
})

const Review = model('Review', reviewSchema)

module.exports = Review