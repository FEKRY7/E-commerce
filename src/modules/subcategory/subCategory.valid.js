const joi =  require('joi')
const { isValidObjectId } = require('../../middleware/validation.middleware.js')


const addSubcategorySchema = joi.object({
    name:joi.string().min(2).max(20).required(),
    categoryId:joi.string().custom(isValidObjectId).required()
}).required()

const upDateSubcategorySchema = joi.object({
    name:joi.string().min(2).max(20),
    id:joi.string().custom(isValidObjectId).required(), //sub category id
    categoryId:joi.string().custom(isValidObjectId).required() //category id

}).required()



const deleteSubcategorySchema = joi.object({
    categoryId:joi.string().custom(isValidObjectId).required() ,//category id
    id:joi.string().custom(isValidObjectId).required() // subcategory id
}).required()

const getAllSubcategorySchema = joi.object({
    categoryId:joi.string().custom(isValidObjectId) ,//category id
    
}).required()

module.exports = {
    addSubcategorySchema,
    upDateSubcategorySchema,
    deleteSubcategorySchema,
    getAllSubcategorySchema   
}