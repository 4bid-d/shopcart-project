const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    productId: {
        type: String,
        immutable: true,
    },

    comments: {
        type:Array,
        default:[],
    }

})
    

module.exports = mongoose.model('comments', commentSchema)