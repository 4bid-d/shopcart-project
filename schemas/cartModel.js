const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    userEmail: {
        type: String,
        immutable: true,
    },

    quantity: {
        type: Number,
        default: 1
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
