const joi =  require('joi')
const { isValidObjectId } = require('../../middleware/validation.middleware.js')



const addToCartVal = joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
    quantity:joi.number().integer().min(1)
}).required()

const getCartUserVal = joi.object({
 cartId:joi.string().custom(isValidObjectId)
}).required()


const updateCartVal = joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
    quantity:joi.number().integer().min(1)
})

const deleteItemval = joi.object({
    id:joi.string().custom(isValidObjectId).required(),
})

module.exports = {
    addToCartVal,
    getCartUserVal,
    updateCartVal,
    deleteItemval
}