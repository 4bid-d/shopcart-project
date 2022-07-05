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
    console.log(loginDetails);
    const checkEmailInDb = await User.findOne({ email: loginDetails.email })
    if (checkEmailInDb) {
        try {
            comparePassword = await bcrypt.compare(loginDetails.pass,checkEmailInDb.passWord)
            if(comparePassword){
                console.log("login success");
            }else{
                console.log("login failed");
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("login failed");
    }
})
module.exports = router