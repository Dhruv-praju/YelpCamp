const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')
const {cloudinary} = require('../cloudinary/index')
const getGeoData = require('../mapbox/helper')

module.exports.index = async (req, res)=>{
    const campgrounds = await Campground.find({}) 
    res.render('campgrounds/index.ejs', { campgrounds })
}
module.exports.newForm = (req, res)=>{
    // make a form to get campground data
    res.render('campgrounds/new.ejs')
}
module.exports.createCampground = async (req, res)=>{
    if(!req.body.campground) throw new ExpressError(400, 'Invalid Campground data')
    if(!req.body.campground.description) delete req.body.campground.description
    
    // make new campground obj
    const campground = new Campground(req.body.campground)
    // get geo data of location using forward geocading
    const geoData = await getGeoData(campground.location)
    // set geolocation (coordinates)
    campground.geometry = geoData.body.features[0].geometry
    // take images files
    campground.images = req.files.map(f => ({url:f.path, filename:f.filename}))
    // set the owner
    campground.owner = req.user
    // console.log(campground);
    // save it to DB
    await campground.save()
    req.flash('success','Sucessfully created new Campground')
    res.redirect('campgrounds')
}
module.exports.showCampground = async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate({path:'reviews', populate:'author'})
    if(!campground) throw new ExpressError(400, 'Campground does not exist')
    res.render('campgrounds/show.ejs', {campground})
}
module.exports.editForm = async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground) throw new ExpressError(400, 'Campground does not exist')
    res.render('campgrounds/edit.ejs', {campground})
}
module.exports.editCampground = async (req, res, next)=>{
    const {id} = req.params
    const campground = {...req.body.campground}
    // update geo location data
    const geoData = await getGeoData(campground.location)
    campground.geometry = geoData.body.features[0].geometry
    const upd_campground = await Campground.findByIdAndUpdate(id, campground, {runValidators:true, new:true})
    const imgs = req.files.map(f => ({url:f.path, filename:f.filename}))    // add images
    upd_campground.images.push(...imgs)
    // delete selected images
    const {deleteImages} = req.body
    if(deleteImages && deleteImages.length){
        // delete image objs from mongoDB
        const new_imgs = upd_campground.images.filter( img => !deleteImages.includes(img.filename) )
        upd_campground.images = new_imgs
        // delete images from cloudinary
        for(let filename of deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
    }
    await upd_campground.save()
    req.flash('success', 'Sucessfully updated the Campground')
    res.redirect(`/campgrounds/${upd_campground._id}`)
    
}
module.exports.deleteCampground = async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    // delete its images from cloudinary
    campground.images.forEach( ({ filename }) => cloudinary.uploader.destroy(filename) )
    req.flash('success', 'Sucessfully deleted the Campground')
    res.redirect('/campgrounds')
}