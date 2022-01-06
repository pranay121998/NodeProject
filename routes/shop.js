const path = require('path');

const express = require('express');

const router = express.Router();

const rootPath = require('../utils/path')

const adminData = require('./admin')

router.get('/',(req,res,next)=>{
    // console.log("shop ",adminData.products)
    // res.sendFile(path.join(rootPath,"views","shop.html"));
    // // next()
    const products =adminData.products;
    res.render('shop',{prods: products,
        pageTitle: 'Shop', 
        path : '/', 
        hasProduct :products.length >0,
        activeShop:true,
        productCSS:true
    });
})

module.exports = router;