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

module.exports = isLoggedIn