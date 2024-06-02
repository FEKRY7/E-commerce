const mongoose = require('mongoose')

const {Types} = mongoose

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        
    },
    expiredAt: {
        type: Date,
    },
    discount:{
        type:Number,
        required:true,
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'user'
    }
}, { timestamps: true })


const cuponModel = mongoose.model('cupon', schema)
module.exports = cuponModel

