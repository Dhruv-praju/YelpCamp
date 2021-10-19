const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const campgrounds = require('../controllers/campgrounds')
const {isLoggedIn, isOwner, validateSanitizeCampground} = require('../middleware')
const multer = require('multer')    // package for parsing form data with files
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateSanitizeCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, upload.array('image'), isOwner, validateSanitizeCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isOwner, catchAsync(campgrounds.deleteCampground))
    
router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(campgrounds.editForm))

module.exports = router;