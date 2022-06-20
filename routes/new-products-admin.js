var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
const product = require('../schemas/productModel');

/* GET users listing. */
router.get('/', async function (req, res) {
  let products
  try {
    let productsFromDatabase = await product.find({ admin: "true" })
    products = productsFromDatabase

  } catch (err) {
    console.error(err)
  }
  await res.render('admin-added-products', { title: 'Add products', products, admin: true });
})



module.exports = router;
