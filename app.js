/**** IMPORT PACKAGES */
const express = require('express')
const app = express()
const {render} = require('ejs')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(methodOverride('_method'))

const sessionOptions = {secret:'mylittlesecret', resave:false, saveUninitialized:false}
app.use(session(sessionOptions))
app.use(flash())

app.use((req, res, next)=>{
    res.locals.create_success = req.flash('create_success')   //make success key variable to access message
    res.locals.update_success = req.flash('update_success')
    res.locals.delete_success = req.flash('delete_success')
    res.locals.error = req.flash('error')
    next()
})
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
    req.flash('create_success','Sucessfully created new Campground')
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
    req.flash('update_success', 'Sucessfully updated the Campground')
    res.redirect(`/campgrounds/${upd_campground._id}`)
})
app.delete('/campgrounds/:id', async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('delete_success', 'Sucessfully deleted the Campground')
    res.redirect('/campgrounds')
})

app.listen(5000, (req,res)=> {
    console.log('Server started !')
    console.log('Listeninig at port 5000 ...');
})