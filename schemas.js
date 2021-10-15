const Joi = require('joi')

const campgroundSchema = Joi.object({
    campground: Joi.object({
        name: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().allow(''),
        location: Joi.object({
            country: Joi.string().trim().required(),
            state: Joi.string().trim().required(),
            city: Joi.string().trim().required()
        }).required()

    }).required()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        text: Joi.string().trim().required()
    }).required()
})
module.exports = {campgroundSchema, reviewSchema}