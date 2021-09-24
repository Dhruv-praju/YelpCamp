/** Import cloudinary and related packages */
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// configure the coludinary account
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

// make the storage object (to specify what and where to store in cloudinary)
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'YelpCamp',
        allowed_formats:['jpeg','png','jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}