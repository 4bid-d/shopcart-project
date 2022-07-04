var express = require('express');
var router = express.Router();
const product = require('../schemas/productModel');
let Products

/* GET home page. */
router.get('/', async function (req, res, next) {
  
  Products = await product.find({ admin: "true" })
  
  res.render('user', { title: 'Home', Products, admin: false ,notSignedUser:true,inAnyForm: false });
});


router.get('/user/signup/true',async (req,res)=>{
  Products = await product.find({ admin: "true" })
  res.render(`user`, { title: 'Home', Products, admin: false, user: true ,notSignedUser:false,inAnyForm: false });
})
router.get('/user/signup/false',(req,res)=>{
  res.send("you already signind")
})

module.exports = router;
