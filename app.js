/**** IMPORT PACKAGES */
const express = require('express')
const app = express()
const {render} = require('ejs')
const methodOverride = require('method-override')

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(methodOverride('_method'))

/** Database setup */

const mongoose = require('mongoose')
// import Model(with which we can interact with DB)
const Campground = require('./models/Campground')

mongoose.connect("mongodb://localhost:27017/YelpcampApp", {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("CONNECTION OPEN  !");
  })
  .catch((err) => {
    console.log("ERROR !!", err);
  });

/** ROUTES */

app.get('/', (req, res)=>{
    res.render('index.ejs')
})
// view all camp grounds
app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await Campground.find({}) 
    res.render('campgrounds.ejs', { campgrounds })
})
// post route to submit campground comming from form
app.post('/campgrounds', async (req, res)=>{
    // get data form form and add to campgrounds array
    // redirect back to campgrounds page
    // let new_campgrd = { ...req.body , country:'USA'}
    const {name, image, price, description, ...location} = req.body
    const added_campgrd = await Campground.create({name, image, price, description,location})
    res.redirect('campgrounds')
})
app.get('/campgrounds/new', (req, res)=>{
    // make a form to get campground data
    res.render('new.ejs')
})
app.get('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('show.ejs', {campground})
})
app.get('/campgrounds/:id/edit', async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('edit.ejs', {campground})
})
app.put('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params
    // console.log(req.body);
    const upd_campground = await Campground.findByIdAndUpdate(id, req.body, {runValidators:true, new:true})
    res.redirect(`/campgrounds/${upd_campground._id}`)
})
app.delete('/campgrounds/:id', async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.listen(5000, (req,res)=> {
    console.log('Server started !')
    console.log('Listeninig at port 5000 ...');
})