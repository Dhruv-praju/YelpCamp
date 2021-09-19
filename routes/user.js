const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

router.get('/register',(req, res)=>{
    res.render('users/register.ejs')
})
router.post('/register',catchAsync( async (req, res)=>{
    try {
        const {email, username, password} = req.body
        // make a new user instance
        const new_usr = new User({email, username})
        const registered_usr = await User.register(new_usr, password)   // this will make salt and passwd for new user
        console.log(registered_usr);
        req.flash('success', 'Welcome to Yelp Camp!')
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

module.exports = router