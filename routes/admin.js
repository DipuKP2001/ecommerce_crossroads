var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products});
  })
});

router.get('/add-product',(req,res,next)=>{
  res.render('admin/add-product')
});

router.post('/add-product',(req,res)=>{
  productHelper.addProduct(req.body,(id)=>{
    let image = req.files.image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render('admin/add-product')
      }else{
        console.log(err)
      }
    })
  })
});  


router.get('/delete/:id',(req,res)=>{
  let proId = req.params.id
  productHelper.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  }) 
})
 
module.exports = router;
