/**** IMPORT PACKAGES */
const express = require('express')
const app = express()
const {render} = require('ejs')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const campgroundRoutes = require('./routes/campgrounds')
const userRoutes = require('./routes/user')
const ExpressError = require('./utils/ExpressError')

app.engine('ejs', ejsMate)

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

/** Middleware */

app.use((req, res, next)=>{
    console.log(req.session);
    // make success key variable to access message to all templates
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    // every templete need
    res.locals.currentUser = req.user // req.user has info about current user which is logeed in else if not logged it is undefined
    // console.log(req.user);
    next()
})

// app.get('/fakeUser', async (req, res)=>{
//     const usr = new User({email:'dhruv@gmail.com', username:'dhru'})
//     const passwd = 'chicken'
//     const newUser = await User.register(usr, passwd)  // this will hash and store user obj in DB
//     res.send(newUser)
// })

/** ROUTES */

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)

app.get('/', (req, res)=>{
    res.render('home.ejs')
})
app.all('*', (req, res, next)=>{  // if it didn't match any of above routes, send 404
  // res.status(404).send('404   NOT FOUND!!')
  next(new ExpressError(404, 'Page not found'))
})

/** Error Handler middleware */ 
app.use((err, req, res, next)=>{
  // console.log(err.name);
  if(err.name === 'CastError') err = handleCastError(err)
  next(err)
})
app.use((err, req, res, next)=>{
  const {status=500, message='SOMETHING WENT WRONG ON SERVERSIDE !!'} = err
  res.status(status).render('error.ejs', {message})
})

function handleCastError(error){
  error.message = 'Something went wrong...'
  error.status = 404
  return error
}
app.listen(5000, (req,res)=> {
    console.log('Server started !')
    console.log('Listeninig at port 5000 ...');
})