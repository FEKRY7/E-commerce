const express = require("express");
const router = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");

const { addToCartVal,deleteItemval,getCartUserVal,updateCartVal } = require("./cart.validation.js");
const { addToCart, clearCart, deleteItem, updateCart, userCart,} = require("./cart.controller.js");

router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(addToCartVal),
  addToCart 
);  

router.get(
  "/",
  isAuthenticated,
  isAuthorized("user", "admin"),
  validation(getCartUserVal),
  userCart
);

router.patch(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(updateCartVal),
  updateCart
);

router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(deleteItemval),
  deleteItem
);

router.put("/", isAuthenticated, isAuthorized("user"), clearCart);

module.exports = router;
