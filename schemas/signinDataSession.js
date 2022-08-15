const mongoose = require('mongoose');

const demoUserSchema = new mongoose.Schema({
    user: {
        type: String,
        default: true,
        immutable: true,
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

});


module.exports = mongoose.model('demoUsers', demoUserSchema);
