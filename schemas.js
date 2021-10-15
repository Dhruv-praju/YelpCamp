const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')

// for HTML sanitization
const extension = (joi)=>({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules:{
        escapeHTML:{
            validate(value, helpers){
                const clean = sanitizeHtml(value, {
                    allowedTags:[],
                    allowedAttributes:{}
                })
                if(clean!==value) return helpers.error('string.escapeHTML', {value})
                return clean
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)

const campgroundSchema = Joi.object({
    campground: Joi.object({
        name: Joi.string().trim().required().escapeHTML(),
        price: Joi.number().min(0).required(),
        description: Joi.string().allow(''),
        location: Joi.object({
            country: Joi.string().trim().required().escapeHTML(),
            state: Joi.string().trim().required().escapeHTML(),
            city: Joi.string().trim().required().escapeHTML()
        }).required()

    }).required()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        text: Joi.string().trim().required().escapeHTML()
    }).required()
})
module.exports = {campgroundSchema, reviewSchema}