var express = require('express');  
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products', { products,admin:false });
  })
});
  
module.exports = router;
