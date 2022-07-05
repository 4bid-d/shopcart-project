var express = require('express');
var app = express();
var router = express.Router();
const product = require('../schemas/productModel');
let Products
const bcrypt = require('bcrypt');
const User = require('../schemas/userModel')

// app.use('/signup/signupData',signupRouter)

/* GET home page. */
router.get('/', async function (req, res, next) {
  let userSession = req.session
  let userDetail = userSession.user

  console.log(userDetail)
  Products = await product.find({ admin: "true" })

  if (userSession.loggedIn) {
    res.render('user', { title: 'Home', userDetail, Products, user: true, admin: false, notSignedUser: false, inAnyForm: false });
  } else {
    res.render('user', { title: 'Home', Products, user: false, admin: false, notSignedUser: true, inAnyForm: false });
  }
  next
});

// router.get('/signup/true', async (req, res) => {
//   console.log("t function called");
//   Products = await product.find({ admin: "true" })
//   res.render(`user`, { title: 'Home', Products, admin: false, user: true, notSignedUser: false, inAnyForm: false });
// })

// router.get('/signup/false', async (req, res) => {

//   console.log("f function called");
//   res.send("you already signind please login <a href='/user/login' > login </a>")

// })

router.get('/signup', (req, res) => {

  res.render('signup', { title: 'signup', inAnyForm: true })
})

router.get("/login", (req, res) => {

  res.render('login', { title: 'login', inAnyForm: true },)

})
router.get("/logout", (req, res) => {
  console.log(req.session)
  req.session.loggedIn = false
  res.redirect('/user')

})

router.post('/login', async (req, res) => {

  const loginDetails = req.body
  let loginStatus
  let serverResponseLogin = {}
  const findAndcheckEmail = await User.findOne({ email: loginDetails.email })
  if (findAndcheckEmail) {
    try {
      comparePassword = await bcrypt.compare(loginDetails.pass, findAndcheckEmail.passWord)
      if (comparePassword) {
        console.log("login success");
        serverResponseLogin.user = findAndcheckEmail
        serverResponseLogin.status = true
      } else {
        req.session.loggedIn = false
        serverResponseLogin.status = false
        console.log("login failed1");
        res.redirect('login')
      }
    } catch (err) {
      console.log(err);
    } finally {
      if (serverResponseLogin.status) {
        req.session.loggedIn = true
        req.session.user = serverResponseLogin.user
        res.redirect('/user')
      } else {
        req.session.loggedIn = false
        res.redirect('login')
      }
    }
  } else {
    req.session.loggedIn = false
    serverResponseLogin.status = false
    res.redirect('login')
  }
})


router.post('/signup/signupData', async (req, res) => {

  const signupDetails = req.body
  const bycryptedPass = await bcrypt.hash(signupDetails.pass, 10)
  let signupStatus = false
  let serverResponseSignup = {}
  var emailChecking = await User.findOne({ email: signupDetails.email })
 
  if (emailChecking) {
    signupStatus = false
    res.send("you already signind please login <a href='/user/login' > login </a>")
  } else {
    try {
      userData = await User.create({
        firstName: signupDetails.fName,
        LastName: signupDetails.lName,
        email: signupDetails.email,
        passWord: bycryptedPass
      })
      signupStatus = true

    } catch (err) {
      console.log(err)
    } finally {
      if (signupStatus) {
        let dbSession = await User.findOne({email:signupDetails.email})
          
        
        req.session.loggedIn = true
        req.session.user = dbSession
        res.redirect('/user')

      }
    }

  }
})

module.exports = router;
