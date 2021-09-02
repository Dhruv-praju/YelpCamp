/**** IMPORT PACKAGES */
const express = require('express')
const app = express()
const {render} = require('ejs')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

/** ROUTES */
app.get('/', (req, res)=>{
    res.render('landing.ejs')
})

let campgrounds = [
    {name:'Salmon Lake', image:'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'},
    {name:'Granite Hill', image:'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fGNhbXBpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name:"Mountain Goat's Rest", image:'https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fGNhbXBpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name:'Night Egde', image:'https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'},
    {name:'Amazon Woods', image:'https://images.unsplash.com/photo-1562206513-6a81cfc73936?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'},
    {name:'Cold Himalayas', image:'https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80'},
    {name:'Backwater Beach', image:'https://images.unsplash.com/photo-1594272042770-4e0bc2cdc2ab?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80'}
]

// view all camp grounds
app.get('/campgrounds', (req, res)=>{ 
    res.render('campgrounds.ejs', {campgrounds:campgrounds})
})

// post route to submit campground comming from form
app.post('/campgrounds', (req, res)=>{
    // get data form form and add to campgrounds array
    // redirect back to campgrounds page
    let name = req.body.name 
    let image = req.body.image      // data is stored in req.body vairable

    campgrounds.push({name:name, image:image})

    res.redirect('campgrounds')
})

app.get('/campgrounds/new', (req, res)=>{
    // make a form to get campground data
    res.render('new.ejs')
})

app.listen(5000, (req,res)=> {
    console.log('Server started !')
    console.log('Listeninig at port 5000 ...');
})