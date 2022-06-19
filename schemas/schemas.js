const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    productName: {type:String,default:''},
    category: {type:String,default:''},
    Price: {type:Number,default:''},
    desc: {type:String,default:''}
})

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    journal: [{type: mongoose.Schema.Types.ObjectId, ref: 'Journal'}]
});

module.exports.userSchema = mongoose.model('users', userSchema);
module.exports.journalSchema = mongoose.model('journals', journalSchema);










// getting-started.js
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost27017', {useNewUrlParser: true});
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
// })

// const Tank = mongoose.model('Tank', yourSchema);

// const small = new Tank({ size: 'small' });
// small.save(function (err) {
//   if (err) return handleError(err);
//   // saved!
// });

// // or

// Tank.create({ size: 'small' }, function (err, small) {
//   if (err) return handleError(err);
//   // saved!
// });
// // or, for inserting large batches of documents
// Tank.insertMany([{ size: 'small' }], function(err) {

// });
















// const db= require('../config/mongoConnection.js')


// module.exports={

//     addProduct:(product,callback)=>{
//             db.insertOne({
//             // name: req.body.name,
//             // category: req.body.category,
//             // price: req.body.price,
//             // des: req.body.des,
//             product

//         }).then((Result)=> {
//             if (err) throw err;
//             else
//             console.log("1 document inserted");
//             db.close();
         
//                 })
//             }
//         }





 //dbo.collection("customers").find({}).toArray(function(err, result)
//dbo.createCollection.insertOne(product).then((data)=>{