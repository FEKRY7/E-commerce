const productModel = require('../../../Database/models/product.model.js')
const reviewModel = require('../../../Database/models/review.model.js')


const averageCalc = async (productId) => {
    try {
        // Fetch product and reviews
        const product = await productModel.findById(productId)
        const reviews = await reviewModel.find({ productId })

        // Calculate average rating
        let calcRate = 0
        if (reviews.length > 0) {
            for (let i = 0; i < reviews.length; i++) {
                calcRate += reviews[i].rate
            }
            product.avergeRate = (calcRate / reviews.length).toFixed(1)
        } else {
            // If there are no reviews, set average rating to 0
            product.avergeRate = 0
        }

        // Save the updated product
        await product.save()
    } catch (error) {
        console.error("Error calculating average rating:", error)
    }
}

module.exports = averageCalc
