const express  = require('express')
const router = express.Router()
const { addCategory, deleteCategory, getAllCategories, upDateCategory } = require('./category.controller.js')
const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')
const fileUpload = require('../../utils/fileUpload.js')
const {validation} = require('../../middleware/validation.middleware.js')
const { addCategorySchema, deleteCategorySchema, upDateCategorySchema } = require('./category.validation.js')
const Subcategory = require('../subcategory/subCategory.routes.js')




router.use("/:categoryId/Subcategory",Subcategory)

router.post('/',
isAuthenticated,isAuthorized("admin"),
fileUpload().single("product"), 
// validation(addCategorySchema),
addCategory) 
 

router.patch('/:id',
isAuthenticated,isAuthorized("admin"),
fileUpload().single("category"),
validation(upDateCategorySchema),
upDateCategory)

 

router.delete('/:id',
isAuthenticated,isAuthorized("admin"),
validation(deleteCategorySchema),
deleteCategory)


router.get('/',getAllCategories)

module.exports = router