const cartModel = require("../../../Database/models/Cart.model.js");
const productModel = require("../../../Database/models/product.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { Firest, Schand, Thered } = require("../../utils/httperespons.js");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await productModel.findById(req.body.productId);
    if (!product) {
      return Firest(res, "Product not found", 404, http.FAIL);
    }

    const isProductInCart = await cartModel.findOne({
      user: req.user._id,
      "products.productId": productId,
    });
    if (isProductInCart) {
      const theProduct = isProductInCart.products.find(
        (pro) => pro.productId.toString() === productId.toString()
      );

      if (+theProduct.quantity + +quantity > +product.quantity) {
        return Firest(
          res,
          `not enough quantity , only  ${product.quantity} are  avilable`,
          400,
          http.FAIL
        );
      } else {
        theProduct.quantity = +theProduct.quantity + +quantity;
        await isProductInCart.save();
        Schand(res, isProductInCart, 200, http.SUCCESS);
      }
    }

    if (product.quantity < req.body.quantity) {
      return Firest(
        res,
        `not enough quatity is the stock  the avilable quantity is ${product.quantity}`,
        400,
        http.FAIL
      );
    }

    const cart = await cartModel.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          products: {
            productId: req.body.productId,
            quantity: req.body.quantity,
          },
        },
      },
      { new: true }
    );
    if (!cart) {
      return Firest(res, "error in cart", 400, http.FAIL);
    }
    return Schand(res, cart, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Thered(res, "Internal Server Error", 500, http.ERROR);
  }
};

const userCart = async (req, res) => {
  try {
    if (req.user.role == "user") {
      const cart = await cartModel.findOne({ user: req.user._id });
      return Schand(res, cart, 200, http.SUCCESS);
    }
    if (req.user.role == "admin" && !req.body.cartId) {
      return Firest(res, "Cart id is required", 400, http.FAIL);
    }
    const cart = await cartModel.findById(req.body.cartId);
    return Schand(res, cart, 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Thered(res, "Internal Server Error", 500, http.ERROR);
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
      return Firest(res,"Product Not found",404,http.FAIL)
    }
    if (product.quantity < quantity) {
      return Firest(res,`sorry, not enough quatity in stock the avilble quantity is ${quantity}`,400,http.FAIL)
    }
    const cart = await cartModel.findOneAndUpdate(
      { user: req.user._id, "products.productId": productId },
      { "products.$.quantity": quantity },
      { new: true }
    );
    if (!cart) {
      return Firest(res,"Cart not found",404,http.FAIL)
    }
    return Schand(res,cart,200,http.SUCCESS)

  } catch (error) {
    console.error(error);
    return Thered(res, "Internal Server Error", 500, http.ERROR);
  }
};

const deleteItem = async (req, res) => {
  try{
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return Firest(res,"Product Not found",404,http.FAIL)
    }
  
    const cart = await cartModel.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: { productId: req.params.id } } }
    );
  
    return Schand(res,cart,200,http.SUCCESS)
  }catch (error) {
    console.error(error);
    return Thered(res, "Internal Server Error", 500, http.ERROR);
  }
};

const clearCart = async (req, res) => {
try{
    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        { products: [] },
        { new: true }
      );
    
      return Schand(res,cart,200,http.SUCCESS)

}catch (error) {
    console.error(error);
    return Thered(res, "Internal Server Error", 500, http.ERROR);
}
};

module.exports = {
  addToCart,
  userCart,
  updateCart,
  deleteItem,
  clearCart,
};
