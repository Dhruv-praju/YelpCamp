const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn} = require('../middleware')
const Campground = require('../models/campground')
const Review = require('../models/review')

router.post('/', isLoggedIn, catchAsync(async(req, res)=>{
    const {id} = req.params
    // find the campground
    const campground = await Campground.findById(id)
    // make the review
    const review = new Review(req.body.review)
    // add review to that campground
    campground.reviews.push(review)
    // save review and campground after changing
    await review.save()
    await campground.save()

    res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete('/:reviewId', isLoggedIn, catchAsync(async(req, res)=>{
    // find and delete review obj
    const {reviewId, id} = req.params
    const review = await Review.findByIdAndDelete(reviewId)
    // delete this review reference out of array in campgrd object
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router