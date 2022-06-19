var express = require('express');
var router = express.Router();
const app = express();
const product = require('../schemas/productModel');
// var mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')
const mv =

router.post("/", async function (req, res) {
  let Body = req.body
  async function run() {
    // let product 

    try {
      let productNumber = await product.countDocuments({ admin: "true" })

      if (productNumber === 0) {
        Product = await product.create({
          number: 0,
          productName: Body.productName,
          category: Body.category,
          Price: Body.Price,
          desc: Body.desc,
        });
      }
      else {
        Product = await product.create({
          number: productNumber,
          productName: Body.productName,
          category: Body.category,
          Price: Body.Price,
          desc: Body.desc,
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

  await res.send('Your Product Have Been SuccessFully Added');

});


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('addProductForm', { title: 'Express', admin: true });
})

module.exports = router;
