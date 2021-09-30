const mongoose = require('mongoose')
const {Schema, model} = mongoose

const reviewSchema = Schema({
    rating:{
        type:Number,
        min: 1,
        max: 5
    },
    text: String
})

const Review = model('Review', reviewSchema)

module.exports = Review