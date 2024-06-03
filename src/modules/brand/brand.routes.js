const express  = require('express')
const router = express.Router()

const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')
const fileUpload = require('../../utils/fileUpload.js')
const {validation} = require('../../middleware/validation.middleware.js')

const { createBrandSchema, deleteBrandSchema, updateBrandSchema } = require('./brand.validation.js') 
const { createBrand, deleteBrand, getBrands, updateBrand } = require('./brand.controller.js') 




router.post('/',
isAuthenticated,
isAuthorized("admin"),
fileUpload().single("brand"),
validation(createBrandSchema),
createBrand)

router.patch('/:id',
isAuthenticated,
isAuthorized("admin"),
fileUpload().single("brand"),
validation(updateBrandSchema),
updateBrand)
 

router.delete('/:id',
isAuthenticated,
isAuthorized("admin"),
validation(deleteBrandSchema),
deleteBrand)



router.get('/',getBrands)


module.exports =  router
