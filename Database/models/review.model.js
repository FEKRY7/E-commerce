const mongoose = require('mongoose')

const {Types} = mongoose


const schema = new mongoose.Schema({

comment: {
    type: String,
    trim: true,
    minLength: [2, 'too short review text']
},
createdBy:{
    type:Types.ObjectId,
    ref:'user',
    required:true,
},
productId:{
    type:Types.ObjectId,
    ref:'product',
},
rate:{
    type:Number,
    min:0,
    max:5,
    required:true,
},
orderId:{
    type:Types.ObjectId,
    ref:'order'
}
    
}, { timestamps: true })


const reviewyModel = mongoose.model('review', schema)
module.exports = reviewyModel