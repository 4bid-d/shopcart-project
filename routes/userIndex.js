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
  
  Products = await product.find({ admin: "true" })
  
  res.render('user', { title: 'Home', Products, admin: false ,notSignedUser:true,inAnyForm: false });
});

router.get('/user/signup/true',async (req,res)=>{
  Products = await product.find({ admin: "true" })
  res.render(`user`, { title: 'Home', Products, admin: false, user: true ,notSignedUser:false,inAnyForm: false });
})

router.get('/user/signup/false',async(req,res)=>{
  res.send("you already signind please login <a href='/user/login' > login </a>")

})
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'signup',inAnyForm:true })
})

router.get("/login", (req, res) => {

  res.render('login', { title: 'login', inAnyForm: true },)

})
router.post('/login', async (req, res) => {

  const loginDetails = req.body
  let loginStatus
  let response = {}
  const checkEmailInDb = await User.findOne({ email: loginDetails.email })
  if (checkEmailInDb) {
      try {
          comparePassword = await bcrypt.compare(loginDetails.pass, checkEmailInDb.passWord)
          if (comparePassword) {
              console.log("login success");
              response = checkEmailInDb
              response.status = true
          } else {
              response.status = false
              console.log("login failed");
          }
      } catch (err) {
          console.log(err);
      }finally{
          if(response.status){
              res.redirect('/user')
          }else{
              res.redirect('login')
          }
      }
  } else {
      response.status = false
      console.log("login failed");
  }
})


router.post('/signup/signupData', async (req, res) => {

  var Body = req.body
  const bycryptedPass = await bcrypt.hash(Body.pass, 10)
  var signupSuccess = false

  var emailChecking = await User.findOne({ email: Body.email })

  if (emailChecking) {
      signupSuccess = false
      res.redirect(`/user/signup/${signupSuccess}`)
  } else {
      try {
          userData = await User.create({
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
module.exports = router;
