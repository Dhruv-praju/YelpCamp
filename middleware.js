const Campground = require("./models/campground")
const ExpressError = require("./utils/ExpressError")

const isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        // store the URL they are requesting
        req.session.returnTo = req.originalUrl
        // console.log(req.path, req.originalUrl);
        req.flash('error', 'Please login first ')
        return res.redirect('/login')
    }
    next()
}

const isAuthor = async (req, res, next)=>{
    // campgroud author == user who is requesting(for editing campgrnd)
    const {id} = req.params
    // get campgrd
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){    // throw error if not author
        next(new ExpressError(400, "You don't have permission to do that !"))
    }
    next()
}
module.exports = { isLoggedIn, isAuthor }