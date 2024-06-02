const joi =  require('joi')
const { isValidObjectId } = require('../../middleware/validation.middleware.js')


const createOrderVal = joi.object({
    address:joi.string().required(),
    payment:joi.string().valid("cash","visa"),
    phone:joi.string().required(),
    cupon:joi.string()
}).required()



const cancellOrderVal = joi.object({
    id:joi.string().custom(isValidObjectId).required()
})

module.exports = {
    createOrderVal,
    cancellOrderVal
}