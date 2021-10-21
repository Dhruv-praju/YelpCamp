if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
// u can access key values declared in .env file
// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_KEY);

/**** IMPORT PACKAGES */
const express = require('express')
const app = express()
const {render} = require('ejs')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')   // to store session data
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const campgroundRoutes = require('./routes/campgrounds')
const userRoutes = require('./routes/users')
const reviewRoutes = require('./routes/reviews')
const ExpressError = require('./utils/ExpressError')
const mongoSanitize = require('express-mongo-sanitize')   // sanitize query 
const morgan = require('morgan')              // server logs
const helmet = require("helmet")      // for protection against attacks
const cloudDbUrl = process.env.CLOUD_DB_URL   // connects to MongoDB ATLAS
const localDbUrl = "mongodb://localhost:27017/YelpcampApp"
app.engine('ejs', ejsMate)

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(methodOverride('_method'))

/** Database setup */

const mongoose = require('mongoose')
// import Model(with which we can interact with DB)
const Campground = require('./models/campground')

mongoose.connect(cloudDbUrl, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

/** Session Configuration */
const store = MongoStore.create({
  mongoUrl: cloudDbUrl,
  crypto:{
    secret:'mylittlesecret'
  },
  touchAfter: 60 * 60 * 24    // this will not update session every time user refreshes web site if the data is not changed. if it is exactly same as before it will not update continously, it will update every 24 hrs
})

store.on("error", function(e){
  console.log("SESSION STORE ERROR", e);
})

const sessionOptions = {
  store,
  name:'session',
  secret:'mylittlesecret',
  resave:false,
  saveUninitialized:false,
  cookie:{
    httpOnly:true,
    // secure:true,
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}
app.use(session(sessionOptions))
app.use(flash())
app.use(mongoSanitize())

/** Authentication configuraton */
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) // this means use the local strategy that u imported and for that local stragy authentication method on user model

passport.serializeUser(User.serializeUser())    // this is telling passport how to serialize user
// serialize means how to store user data in the session
passport.deserializeUser(User.deserializeUser())    // this is for deserializing user data
//  deserialize means to remove user data of the session

/** Middlewares */
app.use(helmet({contentSecurityPolicy:false}))
app.use(morgan('dev'))
// app.use((req, res, next)=>{
//   // console.log(req.user);
//   next()
// })
app.use((req, res, next)=>{
    // console.log(req.query);
    // make success key variable to access message to all templates
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    // every templete need
    res.locals.currentUser = req.user // req.user has info about current user which is logeed in else if not logged it is undefined
    // console.log(req.user);
    next()
})

/** ROUTES */

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

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
  // console.dir(err.name);
  const {status=500, message='SOMETHING WENT WRONG ON SERVERSIDE !!'} = err
  res.status(status).render('error.ejs', {message})
})

function handleCastError(error){
  error.message = 'Something went wrong...'
  error.status = 404
  return error
}
const port = process.env.PORT || 5000
app.listen(port, (req,res)=> {
    console.log('Server started !')
    console.log(`Listeninig at port ${port}...`);
})