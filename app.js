var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var userRouter = require('./routes/user');

var addProductsRouter = require('./routes/new-products-admin');
var newProductsRouter = require('./routes/addProductsForm');
var deleteProductRouter = require('./routes/deleteProducts');
//mongoose requred
var mongoose = require('mongoose');
//var db = require('./config/mongoConnection');
const { extname } = require('path');
const { engine } = require ('express-handlebars');
var fileUpload = require('express-fileupload')
require('dotenv/config');
//var hbs=require('express-handlebars');
var app = express();
mongoose.connect('mongodb://localhost:27017/shopping',()=>console.log('connected'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',engine({extname:'hbs',defaultLayout:'layout',layoutDir:__dirname+'/views/layouts/',partialsDir:__dirname+'/views/layouts/partials/',runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true}}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());



app.use('/', userRouter);
app.use('/user', userRouter);
app.use('/admin', addProductsRouter);
app.use('/admin/addproducts', addProductsRouter);
app.use('/admin/addedproducts', addProductsRouter);
app.use('/admin/newproducts', newProductsRouter);
app.use('/upload',require('./routes/addProductsForm'));
app.use('/admin/delete',require('./routes/deleteProducts'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//mongoose connection
// mongoose.connect(process.env.DB_URI,{useNewUrlParser:true, useUnifiedTopology:true})
// .then(()=>{
//   console.log('Db Connected');
// })
// .catch((err)=>{
//   console.log(err)
// });
module.exports = app;
