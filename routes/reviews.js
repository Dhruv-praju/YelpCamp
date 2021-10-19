const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isReviewAuthor, validateSanitizeReview} = require('../middleware')

const reviews = require('../controllers/reviews')

router.post('/', isLoggedIn, validateSanitizeReview, catchAsync(reviews.createReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router