const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const {isLoggedIn, isOwner} = require('../middleware')
const multer = require('multer')    // package for parsing form data with files
const {storage, cloudinary} = require('../cloudinary/index')
const upload = multer({ storage })
const Review = require('../models/review')

// view all camp grounds
router.get('/', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({}) 
    res.render('campgrounds/index.ejs', { campgrounds })
}))
// post route to submit campground comming from form
router.post('/', isLoggedIn, upload.array('image'), catchAsync(async (req, res)=>{
    if(!req.body.campground) throw new ExpressError(400, 'Invalid Campground data')
    if(!req.body.campground.description) delete req.body.campground.description
    // make new campground obj
    const campground = new Campground(req.body.campground)
    // take images files
    campground.images = req.files.map(f => ({url:f.path, filename:f.filename}))
    // set the owner
    campground.owner = req.user
    console.log(campground);
    // save it to DB
    await campground.save()
    console.log("DONE SAVING");
    req.flash('success','Sucessfully created new Campground')
    res.redirect('campgrounds')
}))
/** all the uploaded files can be accessed using 'req.files' object
 *  to accept form data with files add 'upload' middleware of multer */ 
// router.post('/', isLoggedIn, upload.array('image'), (req, res)=>{
//     // console.log(req.body, req.files)
//     res.send('IT WORKED !')
// })
router.get('/new', isLoggedIn, (req, res)=>{
    // make a form to get campground data
    res.render('campgrounds/new.ejs')
})
router.get('/:id', catchAsync(async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate('reviews')
    if(!campground) throw new ExpressError(400, 'Campground does not exist')
    res.render('campgrounds/show.ejs', {campground})
}))
router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground) throw new ExpressError(400, 'Campground does not exist')
    res.render('campgrounds/edit.ejs', {campground})
}))
router.put('/:id', isLoggedIn, upload.array('image'), isOwner, catchAsync(async (req, res, next)=>{
        const {id} = req.params
        const campground = {...req.body.campground}
        const upd_campground = await Campground.findByIdAndUpdate(id, campground, {runValidators:true, new:true})
        const imgs = req.files.map(f => ({url:f.path, filename:f.filename}))    // add images
        upd_campground.images.push(...imgs)
        // delete selected images
        const {deleteImages} = req.body
        if(deleteImages && deleteImages.length){
            // delete image objs from mongoDB
            const new_imgs = upd_campground.images.filter( img => !deleteImages.includes(img.filename) )
            upd_campground.images = new_imgs
            // delete images from cloudinary
            for(let filename of deleteImages){
                await cloudinary.uploader.destroy(filename)
            }
        }
        await upd_campground.save()
        req.flash('success', 'Sucessfully updated the Campground')
        res.redirect(`/campgrounds/${upd_campground._id}`)
        
}))
router.delete('/:id', isLoggedIn, isOwner, catchAsync(async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    // delete its images from cloudinary
    campground.images.forEach( ({ filename }) => cloudinary.uploader.destroy(filename) )
    req.flash('success', 'Sucessfully deleted the Campground')
    res.redirect('/campgrounds')
}))

// router.post('/:id/reviews', isLoggedIn, catchAsync(async(req, res)=>{
//     const {id} = req.params
//     // find the campground
//     const campground = await Campground.findById(id)
//     // make the review
//     const review = new Review(req.body.review)
//     // add review to that campground
//     campground.reviews.push(review)
//     // save review and campground after changing
//     await review.save()
//     await campground.save()

//     res.redirect(`/campgrounds/${campground._id}`)
// }))
// router.delete('/:id/reviews/:reviewId', isLoggedIn, catchAsync(async(req, res)=>{
//     // find and delete review obj
//     const {reviewId, id} = req.params
//     const review = await Review.findByIdAndDelete(reviewId)
//     // delete this review reference out of array in campgrd object
//     await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
//     res.redirect(`/campgrounds/${id}`)
// }))
module.exports = router;