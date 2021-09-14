/**** IMPORT PACKAGES */
const express = require('express')
const app = express()
const {render} = require('ejs')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(methodOverride('_method'))

/** Database setup */

const mongoose = require('mongoose')
// import Model(with which we can interact with DB)
const Campground = require('./models/campground')

mongoose.connect("mongodb://localhost:27017/YelpcampApp", {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("CONNECTION OPEN  !");
  })
  .catch((err) => {
    console.log("ERROR !!", err);
  });
  
const sessionOptions = {secret:'mylittlesecret', resave:false, saveUninitialized:false}
app.use(session(sessionOptions))
app.use(flash())

/** Authentication configuraton */
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) // this means use the local strategy that u imported and for that local stragy authentication method on user model

passport.serializeUser(User.serializeUser())    // this is telling passport how to serialize user
// serialize means how to store user data in the session
passport.deserializeUser(User.deserializeUser())    // this is for deserializing user data
//  deserialize means to remove user data of the session

app.use((req, res, next)=>{
    res.locals.create_success = req.flash('create_success')   //make success key variable to access message
    res.locals.update_success = req.flash('update_success')
    res.locals.delete_success = req.flash('delete_success')
    res.locals.error = req.flash('error')
    next()
})


app.get('/fakeUser', async (req, res)=>{
    const usr = new User({email:'dhruv@gmail.com', username:'dhru'})
    const passwd = 'chicken'
    const newUser = await User.register(usr, passwd)  // this will hash and store user obj in DB
    res.send(newUser)
})

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