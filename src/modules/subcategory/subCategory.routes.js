const express  = require('express')
const router = express.Router({ mergeParams:true })

const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')
const fileUpload = require('../../utils/fileUpload.js')
const {validation} = require('../../middleware/validation.middleware.js')

const { addSubcategorySchema, deleteSubcategorySchema, getAllSubcategorySchema, upDateSubcategorySchema } = require("./subCategory.valid.js") 
const { AllSubcategories, addSubcategory, deleteSubcategory, upDateSubcategory } = require("./subcategory.controller.js");



router.post('/')

router.post('/:categoryId',
isAuthenticated,isAuthorized("admin"),
fileUpload().single("Subcategory"),
 validation(addSubcategorySchema),
addSubcategory)


 
   
router.patch('/:id',
isAuthenticated,isAuthorized("admin"),
fileUpload().single("Subcategory"),
 validation(upDateSubcategorySchema),
upDateSubcategory)
 

router.delete('/:id',
isAuthenticated,isAuthorized("admin"),
validation(deleteSubcategorySchema),
deleteSubcategory)



router.get('/',
validation(getAllSubcategorySchema),
AllSubcategories)

module.exports =  router 
