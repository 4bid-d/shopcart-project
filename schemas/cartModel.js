const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    cartKey:{
        type:String,
        immutable:true
    },
    productId:String,
    userEmail :{
        type:String,
        immutable:true,
    },

    quantity:{
        type:Number,
        default:1
    }

    
})


module.exports = mongoose.model('userCart',cartSchema)
