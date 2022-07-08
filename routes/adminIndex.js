var express = require('express');
var router = express.Router();
const app = express();
const product = require('../schemas/productModel');
// var mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')
// const mv = require()
//to verify the user session valid or not to find userlogin
const verifyLogin = (req, res) => {
  const session = req.session
  if (session.loggedIn) {
    return true
  } else {
    res.redirect('/login')
  }
}
  /* GET users listing. */
  router.get('/addedproducts', async function (req, res) {
    let products
    try {
      let productsFromDatabase = await product.find({ admin: "true" })
      products = productsFromDatabase

    } catch (err) {
      console.error(err)
    }
    await res.render('admin/admin-added-products', { title: 'Add products', products, admin: true });
  })

router.get("/delete/:odjId", async (req, res) => {

  const deleteProductId = req.params.odjId
  deleteRequestDoc()
  async function deleteRequestDoc() {

    try {
      await product.deleteOne({ _id: deleteProductId })
      res.redirect('/admin/addedproducts')

    } catch (err) {
      console.error(err)
    }

  }
})

router.get("/edit/:objId", async (req, res) => {

  const editProductId = req.params.objId
  renderRequestDoc()
  async function renderRequestDoc() {

    try {
      foundedDoc = await product.findOne({ _id: editProductId })
      res.render('user/editForm', { title: 'updateProducts', admin: true, foundedDoc })
      console.log("get");
    } catch (err) {
      console.error(err)
    }

  }
})

router.post("/edited/:objId", async (req, res) => {

  const userEditedProductId = req.params.objId
  const userEditedProduct = req.body

  updateRequestDoc()
  async function updateRequestDoc() {

    try {

      foundedDoc = await product.findOne({ _id: userEditedProductId })
      console.log(foundedDoc)
      updateDoc = await product.updateOne({ _id: userEditedProductId }, {
        productName: userEditedProduct.productName,
        category: userEditedProduct.category,
        Price: userEditedProduct.Price,
        desc: userEditedProduct.desc,
        updatedDate: Date.now()
      })
      /*WRITE FUNCTION FOR UPDATING IMAGEFILE */
      res.redirect('/admin/addedproducts')


    } catch (err) {
      console.error(err)
    }

  }
})

router.post("/upload", async function (req, res) {
  let productsDetails = req.body
  async function productUpload() {
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

        /* FOR UPLOADING IMAGEFILE */
        // fs.writeFile("../public/images/" + productGeneratedId + ".jpg", imageSendForProduct, () => {
        //   console.log("file insertion completed")

        // })
        await imageSendForProduct.mv(`./public/images/product-images/${productGeneratedId}.jpg`, async () => {

        })
      } catch (err) {
        console.log(err)
      }
    } catch (err) {
      console.log(err)
    }
  }
  productUpload()

  await res.render('admin/addProductForm', { title: 'Products Form', admin: true });

});


/* GET users listing. */
router.get('/', function (req, res) {
  let userDetails =req.session.user
  let verifyUser = verifyLogin(req,res)
  if(verifyUser){
  res.render('admin/addProductForm', { title: 'Products Form',userDetails, admin: true });
  }
})

module.exports = router;
