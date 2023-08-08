var createError = require('http-errors');
var express = require('express');
require('dotenv/config');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var userRouter = require('./routes/userIndex');
var adminRouter = require('./routes/adminIndex');
var mongoose = require('mongoose');
const { engine } = require ('express-handlebars');
var fileUpload = require('express-fileupload')
var session = require('express-session')

//middleware for image upload
const filesPayloadExists = require('./uploadMiddlewares/filesPayloadExists');
const fileExtLimiter = require('./uploadMiddlewares/fileExtLimiter');
const fileSizeLimiter = require('./uploadMiddlewares/fileSizeLimiter');
  
var app = express();

mongoose.connect(`mongodb+srv://abidpp1212:${process.env.PASSWORD}@cluster0.coote.mongodb.net/?retryWrites=true&w=majority`,()=>console.log('connected'))
//mongoose.connect('mongodb://localhost:27017/shopping',()=>console.log('connected'))

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
app.use(session({secret:"key",cookie:{maxAge:6000000}}))


app.use('^/$|(user)?', userRouter);
app.use('/(/)$|(/user)/', userRouter);
app.use('/admin', adminRouter);
// app.use("/user/signup/signupData",userRouter)


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
// Set Port
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
    console.log('Server started on port '+app.get('port'));
});
module.exports = app;
