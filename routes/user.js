const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

router.get('/register',(req, res)=>{
    res.render('users/register.ejs')
})
router.post('/register',catchAsync( async (req, res)=>{
    try {
        let {email, username, password} = req.body
        email = email.trim()
        username = username.trim()
        // make a new user instance
        const new_usr = new User({email, username})
        const registered_usr = await User.register(new_usr, password)   // this will make salt and passwd for new user and save in DB
        // after REGISTERING automatically login that user
        req.login(registered_usr, err =>{
            if(err) return next(err)
            console.log(registered_usr);
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res)=>{
    res.render('users/login.ejs')
})
router.post('/login',
 passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}),
 (req, res)=>{
    req.flash('success', 'Successfully logged In ')
    // before redirecting return to page user was previously requesting for before getting logged in
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo     // remove session data
    res.redirect(redirectUrl)
})
// ref :http://www.passportjs.org/docs/downloads/html/

router.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success', 'Goodbye ')
    res.redirect('/')
})
module.exports = router