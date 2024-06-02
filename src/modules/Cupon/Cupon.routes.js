const express  = require('express')
const router = express.Router()

const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')
const {validation} = require('../../middleware/validation.middleware.js')


const { CreateCuponSchema, deleteCuponSchema, updateCuponSchema } = require('./Cupon.validation.js')
const { createCupon, deleteCupon, getAllCupons, updateCupon } = require('./Cupon.controller.js') 



router.post("/", isAuthenticated,
isAuthorized("admin","user"),
validation(CreateCuponSchema),
createCupon)

router.patch("/:code", isAuthenticated,
isAuthorized("admin"),
validation(updateCuponSchema),
updateCupon)



router.delete("/:code", isAuthenticated,
isAuthorized("admin"),
validation(deleteCuponSchema),
deleteCupon)

router.get("/", isAuthenticated,
isAuthorized("admin","user"),
getAllCupons)


module.exports =  router