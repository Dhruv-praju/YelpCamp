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

module.exports = getGeoData