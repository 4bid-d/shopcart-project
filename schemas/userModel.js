const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        default: true,
        immutable: true
    },
    firstName: {
        type: String
    },
    
    LastName: String,

    email: {
        type: String
    },
    passWord: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: () => Date.now(),
        immutable: true,

    },
    updatedDate: {
        type: Date,
        default: Date.now()
    }



});


module.exports = mongoose.model('users', userSchema);
