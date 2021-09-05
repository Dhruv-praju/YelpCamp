/** Intialize Database with some fake data */
const mongoose = require('mongoose')

const Campground = require('./models/Campground')

mongoose.connect("mongodb://localhost:27017/YelpcampApp", {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("CONNECTION OPEN  !");
  })
  .catch((err) => {
    console.log("ERROR !!", err);
  });

const seedCamps = [
    {name:'Salmon Lake', location:{ city:'Pulnas'} ,image:'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'},
    {name:'Granite Hill', location:{ city:'Lonavala'} ,image:'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fGNhbXBpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name:"Mountain Goat's Rest", location:{ city:'Pune'} ,image:'https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fGNhbXBpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name:'Night Egde', location:{ city:'Khopoli'} ,image:'https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'},
    {name:'Amazon Woods', location:{ state:'Argentena', city:'upiha'} ,image:'https://images.unsplash.com/photo-1562206513-6a81cfc73936?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'},
    {name:'Cold Himalayas', location:{ state:'Uttarakhand', city:'Dehradun'} ,image:'https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80'},
    {name:'Backwater Beach', location:{ city:'Kalwa'} ,image:'https://images.unsplash.com/photo-1594272042770-4e0bc2cdc2ab?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80'}
]

// save the campgrounds in DB
Campground.insertMany(seedCamps)
    .then(res=>{
        console.log(res);
    })
    .catch(e=>{
        console.log(e);
    })