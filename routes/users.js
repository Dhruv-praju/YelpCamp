const express = require('express')
const passport = require('passport')
const router = express.Router()
const users = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), users.loginUser)

router.get('/logout', users.logoutUser)

module.exports = router