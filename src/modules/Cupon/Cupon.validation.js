const joi =  require('joi')

const CreateCuponSchema = joi.object({
    discount:joi.number().integer().min(1).max(100).required(),
    expiredAt:joi.date().greater(Date.now()).required()
}).required()


const updateCuponSchema = joi.object({
    discount:joi.number().integer().min(1).max(100),
    expiredAt:joi.date().greater(Date.now()),
    code:joi.string().length(3).required()

}).required()


const deleteCuponSchema = joi.object({
    code:joi.string().length(3).required()
}).required()

module.exports = {
    CreateCuponSchema,
    updateCuponSchema,
    deleteCuponSchema
}