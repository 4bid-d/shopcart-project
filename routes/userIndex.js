var express = require('express');
var app = express();
var router = express.Router();
const PRODUCT = require('../schemas/productModel');
let Products
const bcrypt = require('bcrypt');
const USERMODEL = require('../schemas/userModel')
const CART = require('../schemas/cartModel');
const { ObjectId } = require('mongodb');

//to verify the user session valid or not to find userlogin
const verifyLogin = (req, res) => {
  const session = req.session
  if (session.loggedIn) {
    return true
  } else {
    res.redirect('/login')
  }
}
const verifyLoginFetch = (req, res) => {
  const session = req.session
  if (session.loggedIn) {
    return true
  } else {
    res.json(
      {
        "redirect": "login"
      }
    )
  }
}

/* GET user page. */
router.get('/', async function (req, res, next) {


  const userSession = req.session
  const userDetail = userSession.user

  Products = await PRODUCT.find(
    {
      admin: "true"
    }
  )
  //for turn displaying user details by checking loggedin variable in session
  if (userSession.loggedIn) {
    res.render('user/userHome',
      {
        title: 'Home',
        userDetail,
        Products,
        admin: false,
        user: true,
        notSignedUser: false,
        inAnyForm: false
      }
    );
  } else {
    res.render('user/userHome',
      {
        title: 'Home',
        Products,
        user: false,
        admin: false,
        notSignedUser: true,
        inAnyForm: false
      }
    );
  }
  next
});

//cart router
router.get('/cart', async (req, res) => {

  const userDetail = req.session.user

  //  calling varify login function to verify user

  //  verifyLogin(req, res)
  if (verifyLogin(req, res)) {
    let productArray = []
    let requestedUserCart = await CART.findOne(
      {
        userEmail: userDetail.email
      }
    )
    //taking the array contains id and quantity of product
    let productsIdAndQuantityArray = requestedUserCart.idAndQuantity
    let Total = requestedUserCart.total
    //looping to find the product from the products db with the ids of productsIdAndQuantityArray[]
    for (let i = 0; i < productsIdAndQuantityArray.length; i++) {
      let product = await PRODUCT.findOne(
        {
          _id: ObjectId(productsIdAndQuantityArray[i].id)
        }
      )
      let quantity = productsIdAndQuantityArray[i].quantity
      productArray.push(product)
      productArray[i].quantity = quantity
    }

    res.render('user/cart',
      {
        title: "Cart",
        Total,
        productArray,
        userDetail,
        admin: false,
        notSignedUser: false,
        inAnyForm: false
      }
    )

  }
})

//addtocart router
router.get('/addToCart/:proId', async (req, res) => {
  //  calling varify login function to verify user 
  if (
    verifyLoginFetch(req, res)
  ) {
    //product id to add ato cart
    const productId = req.params.proId
    //user session
    const userDetail = req.session.user

    let retrivingExistedCart = await CART.findOne(
      {
        userEmail: userDetail.email,
      }
    )
    let checkingForSameProduct = await CART.findOne(
      {
        userEmail: userDetail.email,
        idAndQuantity:
        {
          $elemMatch:
          {
            id: productId
          }
        }
      })
    //checking for same product id in the "idAndQuantity" array
    if (checkingForSameProduct) {
      let cartCount = await CART.countDocuments(
        {
          userEmail: userDetail.email
        }
      )
      res.json(
        {
          "loginStatus": true,
          "message": "Product is already in cart",
          "count": cartCount
        }
      ).redirect('/user')
    }
    //checking for same email address in cart db and updating the new product to it
    else if (retrivingExistedCart) {
      const findProduct = await PRODUCT.findOne(
        {
          _id: ObjectId(productId)
        }
      )
      let findExistingCart = await CART.findOne(
        {
          userEmail: userDetail.email
        }
      )
      let newTotal = findExistingCart.total + findProduct.Price

      let idArray = retrivingExistedCart.idAndQuantity
      let obj = {}
      obj.id = productId
      obj.quantity = 1
      idArray.push(obj)
      let updateCart = await CART.updateOne(
        {
          userEmail: userDetail.email
        },
        {
          idAndQuantity: idArray,
          total: newTotal
        }
      )
      let cartCount = await CART.countDocuments(
        {
          userEmail: userDetail.email
        }
      )
      if (updateCart) res.json(
        {
          "loginStatus": true,
          "message": "successfully added to cart",
          "count": cartCount
        }
      ).redirect('/user')
    }
    // and after all we find there in no email the user is new to the cart 
    // then add the new user email and new product array to cart db  
    else {
      const findPrize = await PRODUCT.findOne(
        {
          _id: ObjectId(productId)
        }
      )
      let idQu = []
      let obj = {}
      obj.id = productId

      obj.quantity = 1
      idQu.push(obj)

      addToCart = await CART.create(
        {
          userEmail: userDetail.email,
          idAndQuantity: idQu,
          total: findPrize.Price
        }
      )
      let cartCount = await CART.countDocuments(
        {
          userEmail: userDetail.email
        }
      )
      res.json(
        {
          "loginStatus": true,
          "message": "successfully added to cart",
          "count": cartCount
        }
      ).redirect('/user')
    }
  }
})

router.get('/quantityIecrement/:id/:updateVal', async (req, res) => {

  if (verifyLogin(req, res)) {
    const productId = req.params.id
    const userDetail = req.session.user
    let updateValue = req.params.updateVal
    let updatedArray = []
    updateValue++
    let find = await CART.findOne(
      {
        userEmail: userDetail.email,
        idAndQuantity: {
          $elemMatch: {
            id: productId
          }
        }
      }
    )
    find.idAndQuantity.forEach(function (obj) {
      if (obj.id == productId) {
        obj.quantity = updateValue
        updatedArray.push(obj)
      } else updatedArray.push(obj)
    }
    )
    let updateDb = await CART.updateOne(
      {
        userEmail: userDetail.email,
        idAndQuantity:
        {
          $elemMatch:
          {
            id: productId
          }
        }
      },
      {
        idAndQuantity: updatedArray
      }
    )
    if (updateDb) res.json(
      {
        "updatedValue": updateValue
      }
    )
    else res.json(
      {
        "updatedValue": updateValue--
      }
    )

  }
})

router.get('/quantityDecrement/:id/:updateVal', async (req, res) => {
  if (verifyLogin(req, res)) {
    const productId = req.params.id
    const userDetail = req.session.user
    let updateValue = req.params.updateVal
    let updatedArray = []
    updateValue--
    let find = await CART.findOne(
      {
        userEmail: userDetail.email,
        idAndQuantity: {
          $elemMatch: {
            id: productId
          }
        }
      }
    )

    find.idAndQuantity.forEach(function (obj) {
      if (obj.id == productId) {
        obj.quantity = updateValue
        updatedArray.push(obj)
      } else updatedArray.push(obj)
    })

    let updateDb = await CART.updateOne(
      {
        userEmail: userDetail.email,
        idAndQuantity: 
        {
          $elemMatch: 
          {
            id: productId
          }
        }
      },
      {
        idAndQuantity: updatedArray
      }
    )

    if (updateDb) res.json(
      {
        "updatedValue": updateValue
      }
    )
    else res.json(
      {
        "updatedValue": updateValue--
      }
    )

  }
})

router.get('/deleteCart/:id', async (req, res) => {
  if (verifyLoginFetch(req, res)) {
    const productId = req.params.id
    const userDetail = req.session.user
    let updatedArray = []
    let deleteCart = await CART.findOne(
      {
        userEmail: userDetail.email,
        idAndQuantity: {
          $elemMatch:
          {
            id: productId
          }
        }
      }
    )
    deleteCart.idAndQuantity.forEach(function (obj) {
      if (obj.id !== productId) {
        updatedArray.push(obj)
      }
    })
    let updateDb = await CART.updateOne(
      {
        userEmail: userDetail.email,
        idAndQuantity: 
        {
          $elemMatch: 
          {
            id: productId
          }
        }
      },
      {
        idAndQuantity: updatedArray
      }
    )
    if (!updateDb) res.json(
      {
        "status": "true"
      }
    )
    else res.json(
      {
        "status": "false"
      }
    )
  }
})

router.get('/myorders', (req, res) => {
  const userDetail = req.session.user
  if (verifyLogin(req, res)) {
    res.render('user/orders', {
      title: "My orders",
      userDetail,
      admin: false,
      user: true,
      notSignedUser: false,
      inAnyForm: false
    })
  }
})

router.get('/signup', (req, res) => {
  res.render('user/signup',
    {
      title: 'profile',
      inAnyForm: true
    }
  )
})


router.get('/profile', async (req, res) => {
  let userDetail = req.session.user
  if (verifyLogin(req, res)) {
    let userData = await USERMODEL.findOne(
      {
        email: userDetail.email
      }
    )
    res.render('user/profile',
      {
        title: 'Profile',
        inAnyForm: true,
        userData
      }
    )
  }
})

router.get('/login', (req, res) => {

  const session = req.session

  if (session.user) {
    session.loggedIn = true
    res.redirect('/user')


  } else {
    res.render('user/login',
      {
        title: 'login',
        inAnyForm: true
      }
    )
  }

})

router.get("/logout", async (req, res) => {
  req.session.loggedIn = false
  req.session.destroy()
  res.redirect('/user')

})

router.post('/login', async (req, res) => {
  let loginError = {}
  const loginDetails = req.body
  let loginStatus
  let serverResponseLogin = {}
  const findAndcheckEmail = await USERMODEL.findOne(
    {
      email: loginDetails.email
    }
  )
  if (findAndcheckEmail) {
    try {
      comparePassword = await bcrypt.compare(
        loginDetails.pass,
        findAndcheckEmail.passWord
      )
      if (comparePassword) {
        serverResponseLogin.user = findAndcheckEmail
        serverResponseLogin.status = true
      } else {
        loginError = {
          "message": "invalid password"
        }
        req.session.loggedIn = false
        serverResponseLogin.status = false
      }
    } catch (err) {
      console.log(err);
    } finally {
      if (serverResponseLogin.status) {
        req.session.loggedIn = true
        req.session.user = serverResponseLogin.user
        res.json(
          {
            "login": true
          }
        )
      } else {
        req.session.loggedIn = false
        // res.redirect('login')
        res.json(
          {
            "message": "invalid password"
          }
        )
      }
    }
  } else {
    loginError = 
    {
      "message": "Invalid email ,or Please signup"
    }
    req.session.loggedIn = false
    serverResponseLogin.status = false
    res.json(
      {
        "message": "Invalid email ,or Please signup"
      }
    ).redirect("/user/login")
  }
})


router.post('/signup/signupData', async (req, res) => {

  let signInError = ""
  const signupDetails = req.body
  if (
    signupDetails.pass &&
    signupDetails.email &&
    signupDetails.fName &&
    signupDetails.lName
  ) {
    const bycryptedPass = await bcrypt.hash(signupDetails.pass, 10)
    let signupStatus = false
    let serverResponseSignup = {}
    var emailChecking = await USERMODEL.findOne(
      {
        email: signupDetails.email
      }
    )
    if (emailChecking) {
      signInError = "You are already a member please login"
      signupStatus = false
      res.render('user/signup', {
        signInError
      }
      )
    } else {
      try {
        userData = await USERMODEL.create(
          {
            firstName: signupDetails.fName,
            LastName: signupDetails.lName,
            email: signupDetails.email,
            passWord: bycryptedPass
          }
        )
        signupStatus = true

      } catch (err) {
        console.log(err)
      } finally {
        if (signupStatus) {
          let dbSession = await USERMODEL.findOne(
            {
              email: signupDetails.email
            }
          )
          req.session.loggedIn = true
          req.session.user = dbSession
          res.redirect('/user')

        }
      }

    }
  } else {
    signInError = "In sufficient details entered"
    res.json(
      {
        "message": "In sufficient details entered"
      }).render('user/signup',
        {
          signInError
        })
  }

})

router.get('/productView/:id', async (req, res) => {

  const userDetail = req.session.user
  const productId = req.params.id
  const findData = await PRODUCT.findOne(
    {
      _id: productId
    }
  )
  const foundedData = findData
  res.render('user/productView', {
    foundedData,
    title: `${findData.productName}`,
    userDetail,
    admin: false,
    user: true,
    notSignedUser: false,
    inAnyForm: false
  }
  )
})

module.exports = router;
