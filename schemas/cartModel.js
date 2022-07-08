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
    
    productName:String,
    catogory:String,
    Price: Number,
    desc:String,

    
})


module.exports = mongoose.model('userCart',cartSchema)
