const joi =  require('joi')
const { isValidObjectId } = require('../../middleware/validation.middleware.js')

const addReviewVal = joi.object({
    comment:joi.string().min(2).required(),
    productId:joi.string().custom(isValidObjectId).required(),
    rate:joi.number().min(1).max(5).required()
})


const updateReviewVal = joi.object({
    productId:joi.string().custom(isValidObjectId),
    comment:joi.string().min(2),
    rate:joi.number().min(1).max(5),
    id:joi.string().custom(isValidObjectId).required(),

})

module.exports = {
    addReviewVal,
    updateReviewVal
}