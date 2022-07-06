const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    admin:{
        type:String,
        default:true,
        immutable:true
    },
    number:{
        type:Number,
        immutable:true
    },
    productName:String,
    category:String,
    Price:Number,
    desc:String,
    dateCreated:{
        type:Date,
        default:()=>Date.now(),
        immutable:true,
    },
    updatedDate:{
        type:Date,
        default:Date.now(),
    }

})
db = 'shopping'

module.exports = mongoose.model('products', productSchema);



