var express = require('express');
var router = express.Router();
const app = express();
const product = require('../schemas/productModel');
// var mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')
const mv =

router.post("/", async function (req, res) {
  let productsDetails = req.body
  async function run() {
    // let product 

    try {
      let productNumber = await product.countDocuments({ admin: "true" })

      if (productNumber === 0) {
        Product = await product.create({
          number: 0,
          productName: productsDetails.productName,
          category: productsDetails.category,
          Price: productsDetails.Price,
          desc: productsDetails.desc,
        });
      }
      else {
        Product = await product.create({
          number: productNumber,
          productName: productsDetails.productName,
          category: productsDetails.category,
          Price: productsDetails.Price,
          desc: productsDetails.desc,
        });
      }
      await Product.save()
      const imageSendForProduct = await req.files.image
      const productGeneratedId = await Date.now()
       try {
        // fs.writeFile("../public/images/" + productGeneratedId + ".jpg", imageSendForProduct, () => {
        //   console.log("file insertion completed")
  
        // })
        await imageSendForProduct.mv(`./public/images/product-images/${productGeneratedId}.jpg`,async ()=>{
          await console.log('file uploaded')
        })
      } catch (err) {
        console.log(err)
      }
    } catch (err) {
      console.log(err)
    }
  }
  run()

  await res.render('addProductForm', { title: 'Products Form', admin: true });

});


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('addProductForm', { title: 'Products Form', admin: true });
})

module.exports = router;
