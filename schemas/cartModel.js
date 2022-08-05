const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    userEmail: {
        type: String,
        immutable: true,
    },

    idAndQuantity: {
        type:Array,
        default:[],
    },
    total:{
        type:Number
    }


})
    

module.exports = mongoose.model('userCart', cartSchema)
