var express = require('express');
var app = express();
var router = express.Router();
const product = require('../schemas/productModel');
let Products
const bcrypt = require('bcrypt');
const User = require('../schemas/userModel')

//to verify the user session valid or not to find userlogin
const verifyLogin = (req, res) => {
  const session = req.session
  if (session.loggedIn) {
    return true
  } else {
    res.redirect('login')
  }
}

/* GET user page. */
router.get('/', async function (req, res, next) {

  
  const userSession = req.session
  const userDetail = userSession.user

  Products = await product.find({ admin: "true" })
  //for turn displaying user details by checking loggedin variable in session
  if (userSession.loggedIn) {
    res.render('user/userHome', { title: 'Home', userDetail, Products, admin: false, user: true, notSignedUser: false, inAnyForm: false });
  } else {
    res.render('user/userHome', { title: 'Home', Products, user: false, admin: false, notSignedUser: true, inAnyForm: false });
  }
  next
});

//cart router
router.get('/cart', (req, res) => {
 
  const userDetail = req.session.user
//  calling varify login function to verify user
  const verifyUser = verifyLogin(req, res)
  if (verifyUser) {

    res.render('user/cart', { title: "Cart", userDetail, admin: false, user: true, notSignedUser: false, inAnyForm: false })
  }
})

router.get('/myorders', (req, res) => {

  const userDetail = req.session.user
  const verifyUser = verifyLogin(req, res)
  if (verifyUser) {
    res.render('user/orders', { title: "My orders", userDetail, admin: false, user: true, notSignedUser: false, inAnyForm: false })
  }
})

router.get('/signup', (req, res) => {

  res.render('user/signup', { title: 'signup', inAnyForm: true })
})

router.get('/login', (req, res) => {

  const session = req.session

  if (session.user) {
    session.loggedIn = true
    res.redirect('/user')


  } else {
    res.render('user/login', { title: 'login', inAnyForm: true },)
  }

})
router.get("/logout", async (req, res) => {
  req.session.loggedIn = false
  res.redirect('/user')

})

router.post('/login', async (req, res) => {
  let loginError = ""
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
        loginError = "invalid password"
        req.session.loggedIn = false
        serverResponseLogin.status = false
        console.log("login failed1");

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
        // res.redirect('login')
        res.render('user/login', { loginError })
      }
    }
  } else {
    loginError = "Invalid email ,or Please signup"
    req.session.loggedIn = false
    serverResponseLogin.status = false
    res.render('user/login', { loginError })
  }
})


router.post('/signup/signupData', async (req, res) => {
  let signInError = ""
  const signupDetails = req.body
  const bycryptedPass = await bcrypt.hash(signupDetails.pass, 10)
  let signupStatus = false
  let serverResponseSignup = {}
  var emailChecking = await User.findOne({ email: signupDetails.email })

  if (emailChecking) {
    signInError = "You are already a member please login"
    signupStatus = false
    res.render('user/signup', { signInError })
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
        let dbSession = await User.findOne({ email: signupDetails.email })
        req.session.loggedIn = true
        req.session.user = dbSession
        res.redirect('/user')

      }
    }

  }
})

module.exports = router;
