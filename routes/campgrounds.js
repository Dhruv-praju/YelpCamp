const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

// view all camp grounds
router.get('/', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({}) 
    res.render('campgrounds/index.ejs', { campgrounds })
}))
// post route to submit campground comming from form
router.post('/', catchAsync(async (req, res)=>{
    // get data form form and add to campgrounds array
    // redirect back to campgrounds page
    if(!req.body.campground) throw new ExpressError(400, 'Invalid Campground data')
    const added_campgrd = await Campground.create(req.body.campground)
    req.flash('create_success','Sucessfully created new Campground')
    res.redirect('campgrounds')
}))
router.get('/new', (req, res)=>{
    // make a form to get campground data
    res.render('campgrounds/new.ejs')
})
router.get('/:id', catchAsync(async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground) throw new ExpressError(400, 'Campground does not exist')
    res.render('campgrounds/show.ejs', {campground})
}))
router.get('/:id/edit', catchAsync(async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground) throw new ExpressError(400, 'Campground does not exist')
    res.render('campgrounds/edit.ejs', {campground})
}))
router.put('/:id', catchAsync(async (req, res, next)=>{
        const {id} = req.params
        const upd_campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true, new:true})
        req.flash('update_success', 'Sucessfully updated the Campground')
        res.redirect(`/campgrounds/${upd_campground._id}`)
        
}))
router.delete('/:id', catchAsync(async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('delete_success', 'Sucessfully deleted the Campground')
    res.redirect('/campgrounds')
}))


module.exports = router;