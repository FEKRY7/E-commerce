const joi =  require('joi')
const { isValidObjectId } = require('../../middleware/validation.middleware.js')


const createBrandSchema = joi.object({
    name:joi.string().min(2).max(20).required(),
    categories:joi.array().items(joi.string().custom(isValidObjectId)).required(),
})


const updateBrandSchema = joi.object({
    id:joi.string().custom(isValidObjectId).required(),
    name:joi.string().min(2).max(20),

})


const deleteBrandSchema = joi.object({
    id:joi.string().custom(isValidObjectId).required(),
   
})

module.exports = {
    createBrandSchema,
    updateBrandSchema,
    deleteBrandSchema   
}