const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    journal: [{type: mongoose.Schema.Types.ObjectId, ref: 'Journal'}]
});


module.exports.userSchema = mongoose.model('users', userSchema);
