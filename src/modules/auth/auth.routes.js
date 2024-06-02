const express  = require('express')
const router = express.Router()
const {validation}  =  require('./../../middleware/validation.middleware.js') 
const { SignUpSchema, activateAcountSchema, signInSchema } = require ("./auth.schema..js")
const {SignUp, activeAccount, signIn}  = require('./auth.controller.js')


 
router.post("/SignUp",validation(SignUpSchema),SignUp)
  
router.get('/auth/activat_account/:token',validation(activateAcountSchema),activeAccount)

router.post('/signIn',validation(signInSchema),signIn)


module.exports = router