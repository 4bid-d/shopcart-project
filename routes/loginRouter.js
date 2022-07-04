var express = require('express');
var router = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const User = require('../schemas/userModel')

router.get("/", (req, res) => {

    res.render('login', { title: 'login', inAnyForm: true },)
})

router.post('/', async (req, res) => {

    const loginDetails = req.body
    const emailChecking = await User.findOne({ email: loginDetails.email })
    if (emailChecking) {
        try {
            
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("login failed");
    }
})
module.exports = router