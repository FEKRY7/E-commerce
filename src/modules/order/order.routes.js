const express  = require('express')
const router = express.Router()

const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')
const {validation} = require('../../middleware/validation.middleware.js')

const {cancellOrderVal, createOrderVal } =require('./oreder.validitaion.js') 
const { cancelOrder, createOrder, orderWebhook } =require('./order.controller.js') 



router.post("/", 
isAuthenticated , 
isAuthorized("user"),
// validation(createOrderVal),
createOrder
)
 

router.patch("/:id",isAuthenticated,isAuthorized("user"),validation(cancellOrderVal), cancelOrder)


router.post('/Webhook', express.raw({type: 'application/json'}), orderWebhook)

module.exports =  router







