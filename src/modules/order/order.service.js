const cartModel = require('../../../Database/models/Cart.model.js')
const productModel = require('../../../Database/models/product.model.js')

const updateStock = async(products , createOrder)=>{
    if(createOrder){
    for(const product of products){
        await productModel.findByIdAndUpdate(product.productId , {
            $inc:{
                sold:product.quantity,
                quantity:-product.quantity
            }
        })
    }
} else {
    for(const product of products){
        await productModel.findByIdAndUpdate(product.productId , {
            $inc:{
                sold:-product.quantity,
                quantity:product.quantity
            }
        })
    }
    
}
}

const clearCart = async(userId)=>{
    await cartModel.findOneAndUpdate({user: userId} , {products:[]})
}

module.exports = {
    updateStock,
    clearCart
}