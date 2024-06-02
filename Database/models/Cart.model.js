const mongoose = require('mongoose')

const {Types} = mongoose

const schema=new mongoose.Schema({
 products:[{
    productId: {type:Types.ObjectId , ref:"Product"},
    quantity:{type: Number , default:1}
 }],
 user:{type:Types.ObjectId , ref:"user" ,required:true , uniqe:true}
},{timestamps:true})


const cartModel = mongoose.model("cart",schema) 
module.exports = cartModel