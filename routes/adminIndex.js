var express = require('express');
var router = express.Router();
const app = express();
const PRODUCT = require('../schemas/productModel');
const CART = require('../schemas/cartModel');
// var mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')
const fileUpload = require("express-fileupload");
const { v4: uuidv4 } = require('uuid')
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
  let userDetail = req.session.user
  if (verifyLogin(req, res)) {

    try {
      let productsFromDatabase = await PRODUCT.find({ userKey: `${userDetail.email}_${userDetail._id}` })
      products = productsFromDatabase

    } catch (err) {
      console.error(err)
    }

    res.render('admin/admin-added-products', { title: 'Add products', userDetail, products, admin: true });
  }
})

router.get("/delete/:odjId", async (req, res) => {

  const deleteProductId = req.params.odjId
  deleteRequestDoc()
  deleteRequestDocFromCart()
  async function deleteRequestDoc() {

    try {
      await PRODUCT.deleteOne({ _id: deleteProductId })
      res.redirect('/admin/addedproducts')

    } catch (err) {
      console.error(err)
    }

  }
  async function deleteRequestDocFromCart() {

    try {
      await CART.deleteMany({ productId: deleteProductId })
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
      foundedDoc = await PRODUCT.findOne({ _id: editProductId })
      res.render('user/editForm', { title: 'updateProducts', admin: true, foundedDoc })

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

      foundedDoc = await PRODUCT.findOne({ _id: userEditedProductId })

      updateDoc = await PRODUCT.updateOne({ _id: userEditedProductId }, {
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
  let userDetails = req.session.user
  async function productUpload() {
    let imgId = uuidv4()

    let productNumber = await PRODUCT.countDocuments({ admin: "true" })

    if (productNumber === 0) {
      Product = await PRODUCT.create({
        userKey: `${userDetails.email}_${userDetails._id}`,
        number: 0,
        imgId: imgId,
        productName: productsDetails.productName,
        category: productsDetails.category,
        Price: productsDetails.Price,
        desc: productsDetails.desc,
      });
    }
    else {
      Product = await PRODUCT.create({
        userKey: `${userDetails.email}_${userDetails._id}`,
        number: productNumber,
        imgId: imgId,
        productName: productsDetails.productName,
        category: productsDetails.category,
        Price: productsDetails.Price,
        desc: productsDetails.desc,
      });
    }

    const imageSendForProduct = req.files.image
    await imageSendForProduct.mv(`public/images/${imgId}.jpg`)
    res.json({"status":"success"})
  }

  if (verifyLogin(req, res)) {
    productUpload()
  }
});


/* GET users listing. */
router.get('/', function (req, res) {
  let userDetail = req.session.user

  if (verifyLogin(req, res)) {
    res.render('admin/addProductForm', { title: 'Products Form', userDetail, admin: true });
  }
})

module.exports = router;
