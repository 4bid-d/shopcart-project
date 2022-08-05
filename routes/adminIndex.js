var express = require('express');
var router = express.Router();
const app = express();
const PRODUCT = require('../schemas/productModel');
const CART = require('../schemas/cartModel');
// var mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')
const fileUpload = require("express-fileupload");
const { v4: uuidv4 } = require('uuid');
const { JSONCookie } = require('cookie-parser');
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
      let productsFromDatabase = await PRODUCT.find(
        {
          userKey: `${userDetail.email}_${userDetail._id}`
        }
      )
      products = productsFromDatabase

    } catch (err) {
      console.error(err)
    }

    res.render('admin/admin-added-products',
      {
        title: 'Add products',
        userDetail,
        products,
        admin: true
      });
  }
})

router.get("/delete/:odjId", async (req, res) => {

  const deleteProductId = req.params.odjId
  deleteRequestDoc()
  deleteRequestDocFromCart()
  async function deleteRequestDoc() {

    try {
      await PRODUCT.deleteOne(
        {
          _id: deleteProductId
        }
      )
      res.redirect('/admin/addedproducts')

    } catch (err) {
      console.error(err)
    }

  }
  async function deleteRequestDocFromCart() {

    try {
      await CART.deleteMany(
        {
          productId: deleteProductId
        }
      )
      res.redirect('/admin/addedproducts')

    } catch (err) {
      console.error(err)
    }

  }
})

router.get("/edit/:objId", async (req, res) => {
  let userDetail = req.session.user
  const editProductId = req.params.objId
  if (verifyLogin(req, res)) {

    renderRequestDoc()
  }
  async function renderRequestDoc() {

    try {
      foundedDoc = await PRODUCT.findOne(
        {
          _id: editProductId
        }
      )

      res.render('user/editForm',
        {
          title: 'updateProducts',
          admin: true,
          foundedDoc,
          userDetail
        }
      )


    } catch (err) {
      console.error(err)
    }

  }
})

router.post("/edited/:objId", async (req, res) => {

  const userEditedProductId = req.params.objId
  const userEditedProduct = req.body
  const imageId = uuidv4()

  updateRequestDoc()
  async function updateRequestDoc() {

    try {

      // foundedDoc = await PRODUCT.findOne({ _id: userEditedProductId })

      const updateDoc = await PRODUCT.updateOne(
        {
          _id: userEditedProductId
        },
        {
          productName: userEditedProduct.productName,
          imgId: imageId,
          category: userEditedProduct.category,
          Price: userEditedProduct.Price,
          desc: userEditedProduct.desc,
          updatedDate: Date.now()
        }
      )
      const imageFile = req.files.image
      imageFile.mv(`public/images/${imageId}.jpg`)
      res.json(
        {
          "status": "true"
        }
      )
      res.redirect('admin/admin-added-products')

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

    let productNumber = await PRODUCT.countDocuments(
      {
        admin: "true"
      }
    )

    if (productNumber === 0) {
      Product = await PRODUCT.create(
        {
          userKey: `${userDetails.email}_${userDetails._id}`,
          number: 0,
          imgId: imgId,
          productName: productsDetails.productName,
          category: productsDetails.category,
          Price: productsDetails.Price,
          desc: productsDetails.desc,
        }
      );
    }
    else {
      Product = await PRODUCT.create(
        {
          userKey: `${userDetails.email}_${userDetails._id}`,
          number: productNumber,
          imgId: imgId,
          productName: productsDetails.productName,
          category: productsDetails.category,
          Price: productsDetails.Price,
          desc: productsDetails.desc,
        }
      );
    }

    const imageSendForProduct = req.files.image
    await imageSendForProduct.mv(`public/images/${imgId}.jpg`)
    return true
    // res.render('admin/admin-added-products',{title:'added products',userDetails,admin:true})
  }

  if (verifyLogin(req, res)) {
    if (productUpload()) {
      res.json(
        {
          "Status": true
        }
      )
    } else {
      res.json(
        {
          "Status": false
        }
      )
    }
  }
});


/* GET users listing. */
router.get('/', function (req, res) {
  let userDetail = req.session.user

  if (verifyLogin(req, res)) {
    res.render('admin/addProductForm',
      {
        title: 'Products Form',
        userDetail,
        admin: true
      }
    );
  }
})

module.exports = router;
