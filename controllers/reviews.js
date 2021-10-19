const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async(req, res)=>{
    const {id} = req.params
    // find the campground
    const campground = await Campground.findById(id)
    // make the review
    const review = new Review(req.body.review)
    // set author of that
    review.author = req.user
    // add review to that campground
    campground.reviews.push(review)
    // save review and campground after changing
    await review.save()
    await campground.save()

    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteReview = async(req, res)=>{
    // find and delete review obj
    const {reviewId, id} = req.params
    const review = await Review.findByIdAndDelete(reviewId)
    // delete this review reference out of array in campgrd object
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    res.redirect(`/campgrounds/${id}`)
}