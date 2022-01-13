const path = require('path');

const express = require('express');

const adminControllers = require('../controllers/admin')

const router = express.Router();

//admin/add-product
router.get('/add-product',adminControllers.getAddProduct)

//admin/products
router.get('/products',adminControllers.getProducts)

//admin/add-product
router.post('/add-product',adminControllers.postAddProduct)

router.get('/products/:productId',adminControllers.getEditProduct)


module.exports = router;
