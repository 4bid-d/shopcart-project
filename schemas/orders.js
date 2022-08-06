const mongoose = require('mongoose')

const orderModel = new mongoose.Schema({

    adminKey:{
        type:String
    },
    customerEmail:{
        type:String,
    },
    delivery:{
        type:Array,
        default:[]
    },
    userDetails:{
        type:Array,
        default:[]
    },
    paymentMethod:{
        type:String
    },


})

module.exports = mongoose.model("orders",orderModel)