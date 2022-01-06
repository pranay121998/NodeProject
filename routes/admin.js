const path = require('path');

const express = require('express');

const rootPath = require('../utils/path')

const router = express.Router();

const products = [];

router.get('/add-product',(req,res,next)=>{

    // res.sendFile(path.join(rootPath,"views","add-product.html"));
    res.render('add-product',{pageTitle: 'Add Product',path: "/admin/add-product",productCSS:true,formsCSS:true,activePath:true});
})

router.post('/add-product',(req,res,next)=>{
products.push({title: req.body.title});
res.redirect('/');
})

exports.routes = router;
exports.products = products;