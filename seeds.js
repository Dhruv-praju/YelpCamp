/** Intialize Database with some fake data */
const mongoose = require('mongoose')

const Campground = require('./models/campground')

mongoose.connect("mongodb://localhost:27017/YelpcampApp", {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("CONNECTION OPEN  !");
  })
  .catch((err) => {
    console.log("ERROR !!", err);
  });

const seedCamps = [
    {
      name:'Salmon Lake',
       location:{ city:'Pulnas'} ,
       images:[{
         url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632569397/YelpCamp/photo-1508873696983-2dfd5898f08b_nqvpey.jpg',
         filename:'YelpCamp/photo-1508873696983-2dfd5898f08b_nqvpey'
       }]},
    {
      name:'Granite Hill',
       location:{ city:'Lonavala'} ,
       images:[{
         url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632568979/YelpCamp/Lonavalamh_kl6gyp.jpg',
         filename:'YelpCamp/Lonavalamh_kl6gyp'
        },
        {
          url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632568981/YelpCamp/Rajmachi_20-Jan_dkgexm.jpg',
          filename:'YelpCamp/Rajmachi_20-Jan_dkgexm'
        },
        {
          url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632568984/YelpCamp/Places-to-Visit-in-Lonavala_600-1280x720_mdob6e.jpg',
          filename:'YelpCamp/Places-to-Visit-in-Lonavala_600-1280x720_mdob6e'
        }]
      },
    {
      name:'Night Egde',
       location:{ city:'Khopoli'} ,
       images:[{
         url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632569255/YelpCamp/COVID_20CAMPING_20TN_lca6qh.jpg',
         filename:'YelpCamp/COVID_20CAMPING_20TN_lca6qh'
       },
       {
        url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632569224/YelpCamp/FamilyCamping-2021-GettyImages-948512452-2_wbi9zk.jpg',
        filename:'YelpCamp/FamilyCamping-2021-GettyImages-948512452-2_wbi9zk'
      }]
    },
    {
      name:'Amazon Woods',
       location:{ state:'Argentena', city:'upiha'} ,
       images:[{
         url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632569246/YelpCamp/solo-camping-tips_edib8a.jpg',
         filename:'YelpCamp/solo-camping-tips_edib8a'
       },
       {
        url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632569304/YelpCamp/Best-Affordable-Camping-Gear-000-Hero_bf6qpw.jpg',
        filename:'YelpCamp/Best-Affordable-Camping-Gear-000-Hero_bf6qpw'
      },
      {
        url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632569220/YelpCamp/1200px-Tent_camping_along_the_Sulayr_trail_in_La_Taha_2C_Sierra_Nevada_National_Park__28DSCF5147_29_gbcw54.jpg',
        filename:'YelpCamp/1200px-Tent_camping_along_the_Sulayr_trail_in_La_Taha_2C_Sierra_Nevada_National_Park__28DSCF5147_29_gbcw54'
      }]
    },
    {
      name:'Cold Himalayas',
       location:{ state:'Uttarakhand', city:'Dehradun'} ,
       images:[{
         url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632570350/YelpCamp/photo-1503265192943-9d7eea6fc77a_n2hsv5.jpg',
         filename:'YelpCamp/photo-1503265192943-9d7eea6fc77a_n2hsv5'
       }]
    }
]

// save the campgrounds in DB
Campground.insertMany(seedCamps)
    .then(res=>{
        console.log(res);
    })
    .catch(e=>{
        console.log(e);
    })