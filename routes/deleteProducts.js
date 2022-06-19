var express = require('express');
var router = express.Router();
const app = express();
const product = require('../schemas/productModel');
// var mongoose = require('mongoose');

router.post("/", async (req, res) => {

    const deleteRequestId = req.body.id
    deleteRequestDoc()
    async function deleteRequestDoc() {

        try {
            await product.deleteOne({ number: deleteRequestId })

        } catch (err) {
            console.error(err)
        }

    }
})
module.exports = router