const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/register',(req, res)=>{
    res.render('users/register.ejs')
})
router.post('/register',async (req, res)=>{
    const {email, username, password} = req.body
    // make a new user instance
    const new_usr = new User({email, username})
    const registered_usr = await User.register(new_usr, password)
    console.log(registered_usr);
    // req.flash( )
    res.redirect('/')
})

module.exports = router