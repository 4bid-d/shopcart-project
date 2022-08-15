const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({

    otp: {
        type: String,
        immutable: true,
    },

    email: {
        type: String,
        immutable: true,
    },

})
    

module.exports = mongoose.model('otps', otpSchema)