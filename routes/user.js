var express = require('express');
var router = express.Router();
const product = require('../schemas/productModel');
let products
/* GET home page. */
router.get('/', async function (req, res, next) {

  products = await product.find({ admin: "true" })
  res.render('user', { title: 'User Page', products, admin: false ,notSignedUser:true,notInAnyForm: false });
});


router.get('/user/signup/true',(req,res)=>{
  res.render(`user`, { title: 'User Page', products, admin: false, user: true ,notSignedUser:false,notInAnyForm: false });
})
router.get('/user/signup/false',(req,res)=>{
  res.send("you already signind")
})

module.exports = router;
