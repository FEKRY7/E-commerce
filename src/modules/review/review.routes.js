const express  = require('express')
const router = express.Router({mergeParams:true})

const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')
const {validation} = require('../../middleware/validation.middleware.js')

const { addReviewVal, updateReviewVal } = require('./review.validiation.js')
const { addReview, updateReview } = require('./review.controler.js')



router.post("/",
isAuthenticated,
isAuthorized("user","admin"),
validation(addReviewVal),
addReview)


router.patch("/:id",isAuthenticated,isAuthorized("user","admin"), validation(updateReviewVal),updateReview)

module.exports = router 