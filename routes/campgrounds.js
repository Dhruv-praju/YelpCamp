const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')

// view all camp grounds
router.get('/', async (req, res)=>{
    const campgrounds = await Campground.find({}) 
    res.render('campgrounds.ejs', { campgrounds })
})
// post route to submit campground comming from form
router.post('/', async (req, res)=>{
    // get data form form and add to campgrounds array
    // redirect back to campgrounds page
    // let new_campgrd = { ...req.body , country:'USA'}
    const {name, image, price, description, ...location} = req.body
    const added_campgrd = await Campground.create({name, image, price, description,location})
    req.flash('create_success','Sucessfully created new Campground')
    res.redirect('campgrounds')
})
router.get('/new', (req, res)=>{
    // make a form to get campground data
    res.render('new.ejs')
})
router.get('/:id', async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('show.ejs', {campground})
})
router.get('/:id/edit', async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('edit.ejs', {campground})
})
router.put('/:id', async (req, res)=>{
    const {id} = req.params
    // console.log(req.body);
    const upd_campground = await Campground.findByIdAndUpdate(id, req.body, {runValidators:true, new:true})
    req.flash('update_success', 'Sucessfully updated the Campground')
    res.redirect(`/campgrounds/${upd_campground._id}`)
})
router.delete('/:id', async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('delete_success', 'Sucessfully deleted the Campground')
    res.redirect('/campgrounds')
})


module.exports = router;