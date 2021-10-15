const Campground = require("./models/campground")
const Review = require('./models/review')
const ExpressError = require("./utils/ExpressError")
const {campgroundSchema, reviewSchema} = require('./schemas')

const isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        // store the URL they are requesting
        if(!req.originalUrl.includes('review')) req.session.returnTo = req.originalUrl
        // console.log(req.path, req.originalUrl);
        req.flash('error', 'Please login first ')
        return res.redirect('/login')
    }
    next()
}

const isOwner = async (req, res, next)=>{
    // campgroud owner == user who is requesting (for editing campgrnd)
    const {id} = req.params
    // get campgrd
    const campground = await Campground.findById(id)
    if(!campground.owner.equals(req.user._id)){    // throw error if not owner
        next(new ExpressError(400, "You don't have permission to do that !"))
    }
    next()
}

const isReviewAuthor = async(req, res, next)=>{
    // review author == current user
    const {reviewId} = req.params
    // get review
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        next(new ExpressError(400, "You are not authorized to do that !"))
    }
    next()
}

const validateSanitizeCampground = (req, res, next)=>{
    const {error, result} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        next(new ExpressError(400, msg))
    } 
    next()
}

const validateSanitizeReview = (req, res, next)=>{
    const {error, result} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        next(new ExpressError(400, msg))
    } 
    next()
}
module.exports = { isLoggedIn, isOwner, isReviewAuthor, validateSanitizeCampground, validateSanitizeReview }