var express = require('express');
var router = express.Router();
const product = require('../schemas/productModel');

/* GET home page. */
router.get('/', async function(req, res, next) {
  
   let products = await product.find({admin:"true"})
  console.log(products)
  res.render('user', { title: 'abid', products,admin:false });
});


module.exports = router;
