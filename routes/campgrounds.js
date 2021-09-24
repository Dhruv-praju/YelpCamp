const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const isLoggedIn = require('../middleware')
const multer = require('multer')    // package for parsing form data with files
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })

// view all camp grounds
router.get('/', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({}) 
    res.render('campgrounds/index.ejs', { campgrounds })
}))
// post route to submit campground comming from form
// router.post('/', isLoggedIn, catchAsync(async (req, res)=>{
//     // get data form form and add to campgrounds collection in DB
//     // redirect back to campgrounds page
//     if(!req.body.campground) throw new ExpressError(400, 'Invalid Campground data')
//     const added_campgrd = await Campground.create(req.body.campground)
//     req.flash('success','Sucessfully created new Campground')
//     res.redirect('campgrounds')
// }))
router.post('/', upload.array('image'), (req, res)=>{
    console.log(req.body, req.files)
    res.send('IT WORKED !')
})
router.get('/new', isLoggedIn, (req, res)=>{
    // make a form to get campground data
    res.render('campgrounds/new.ejs')
})
router.get('/:id', catchAsync(async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground) throw new ExpressError(400, 'Campground does not exist')
    res.render('campgrounds/show.ejs', {campground})
}))
router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground) throw new ExpressError(400, 'Campground does not exist')
    res.render('campgrounds/edit.ejs', {campground})
}))
router.put('/:id', isLoggedIn, catchAsync(async (req, res, next)=>{
        const {id} = req.params
        const upd_campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true, new:true})
        req.flash('success', 'Sucessfully updated the Campground')
        res.redirect(`/campgrounds/${upd_campground._id}`)
        
}))
router.delete('/:id', isLoggedIn, catchAsync(async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Sucessfully deleted the Campground')
    res.redirect('/campgrounds')
}))


module.exports = router;