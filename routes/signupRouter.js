var express = require('express');
const { route } = require('./user');
var router = express.Router();
const app = express();
const bcrpyt = require('bcrypt')
const user = require('../schemas/userModel');

router.post('/', async (req, res) => {

    var Body = req.body
    const bycryptedPass = await bcrpyt.hash(Body.pass, 10)
    var signupSuccess = false

    var emailChecking = await user.findOne({ email: Body.email })

    if (emailChecking) {
        signupSuccess = false
        res.redirect(`/user/signup/${signupSuccess}`)
    } else {
        try {
            userData = await user.create({
                firstName: Body.fName,
                LastName: Body.lName,
                email: Body.email,
                passWord: bycryptedPass
            })
            signupSuccess = true
            res.redirect(`/user/signup/${signupSuccess}`)


        } catch (err) {

            console.log(err)

        }

    }


    // await res.render('signup', { title: 'signup' })


})
router.get('/', (req, res) => {
    res.render('signup', { title: 'signup', })
})

module.exports = router