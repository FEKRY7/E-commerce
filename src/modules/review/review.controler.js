const orderModel  = require('../../../Database/models/orderModel.js')
const  reviewyModel  = require('../../../Database/models/review.model.js')
const  averageCalc =  require('./review.service.js')
const http = require('../../folderS,F,E/S,F,E.JS')
const {Firest,Schand,Thered} = require('../../utils/httperespons.js')

const addReview = async (req, res) => {
    try {
       
        // Find the order
        const {comment , rate}= req.body
    
    const order=await orderModel.find({
        user:req.user._id,
        status:"deliverd",
        "products.productId":req.params.productId
    })

        if (!order) {
            return Firest(res,"The order needs to be delivered before you can add a review",400,http.FAIL)
        }

        // Check if the user has already reviewed this product
        const existingReview = await reviewyModel.findOne({ createdBy: req.user._id, productId: req.params.productId })
        if (existingReview) {
            return Firest(res,"You can't add more than one review for the same product",400,http.FAIL)
        }

        // Create the review
        const review = await reviewyModel.create({
            comment,
            createdBy: req.user._id,
            productId: req.params.productId,
            rate,
            orderId: order._id
        })

        // Recalculate the average rating for the product
        await averageCalc(req.params.productId)

        Schand(res,"Your review has been added",200,http.SUCCESS)
    }catch (error) {
        console.error(error);
        return Thered(res, 'Internal Server Error', 500, http.ERROR);    
    }
}


const updateReview = async(req,res)=>{
try{
    const { productId , id}= req.params
 
    const review = await reviewyModel.findOneAndUpdate({productId:req.params.productId , _id:req.params.id},{...req.body},{new:true})
   if(!review){
    return Firest(res,"cant find the review",400,http.FAIL)
   } 

    averageCalc(productId)
   
    Schand(res,"review is updated",200,http.SUCCESS)
}catch (error) {
    console.error(error);
    return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}
}

module.exports = {
    addReview,
    updateReview
}