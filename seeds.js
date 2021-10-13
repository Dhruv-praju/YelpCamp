/** Delete all Existing Data and Intialize Database with some fake data */
require('dotenv').config()
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const User = require('./models/user')

const cloudDbUrl = process.env.CLOUD_DB_URL
const localDbUrl = "mongodb://localhost:27017/YelpcampApp"

mongoose.connect(cloudDbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("CONNECTION OPEN  !");
  })
  .catch((err) => {
    console.log("ERROR !!", err);
  });

// Import mapbox service u want
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mbxToken = process.env.MAPBOX_TOKEN
// create a client
const geocoder = mbxGeocoding({accessToken:mbxToken})

const getGeoData = async(location)=>{
    const {state, city} = location
    const geoData = await geocoder.forwardGeocode({
        query:`${city}, ${state}`,
        limit:1
    }).send()
    return geoData
}

const seedCamps = [
    {
      name:'Salmon Lake',
       location:{ city:'Mulshi'} ,
       images:[{
         url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1632569397/YelpCamp/photo-1508873696983-2dfd5898f08b_nqvpey.jpg',
         filename:'YelpCamp/photo-1508873696983-2dfd5898f08b_nqvpey'
       }]},
    {
      name:'Granite Hill',
       location:{ city:'Lonavala'} ,
       images:[{
         url:'https://res.cloudinary.com/dkqoek2p3/image/upload/v1634144449/YelpCamp/Lonavalamh_nteiks.jpg',
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
       location:{ state:'Argentena', city:'rosario'} ,
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

const seedDB = async(data)=>{
  // delete all existing users
  await User.deleteMany({})
  // make a new user and register it
  const username='spencer'
  const email='spencer@gmail.com'
  const password='spencer'

  const usr = new User({email, username})
  const registered_usr = await User.register(usr, password)
  // delete all campgrounds in DB
  await Campground.deleteMany({})
  // save fake campgrounds in DB
  for(camp of data){
    const campground = new Campground(camp)
    // make above registed user as owner
    campground.owner = registered_usr
    // get geodata
    const geoData = await getGeoData(campground.location)
    campground.geometry = geoData.body.features[0].geometry
    // save to DB
    await campground.save()
  } 

  console.log('DONE');
}
seedDB(seedCamps)
  .then(()=>{mongoose.connection.close()
  })