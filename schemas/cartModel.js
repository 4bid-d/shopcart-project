const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
 
    productId:{
        type:String,
        immutable:true,
    },

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
