const mongoose = require('mongoose')

const orderModel = new mongoose.Schema({

    customerEmail:{
        type:String,
    },
    delivery:{
        type:Array,
        default:[]
    },
    userDetails:{
        type:String   
    },
    paymentMethod:{
        type:String
    },
    total:String,
    productDetail:{
        type:Array,
        default:[]
    },
    displayOrderTo:{
        type:Array,
        default:[]
    }


})

module.exports = mongoose.model("orders",orderModel)