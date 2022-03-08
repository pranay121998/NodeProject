const path = require('path');

const express = require('express');

const adminControllers = require('../controllers/admin')
const isAuth = require('../middleware/isAuth')

const router = express.Router();



//admin/add-product
router.get('/add-product',isAuth,adminControllers.getAddProduct)



//admin/products
router.get('/products',isAuth,adminControllers.getProducts)

//admin/add-product
router.post('/add-product',isAuth,adminControllers.postAddProduct)

router.get('/products/:productId',isAuth,adminControllers.getEditProduct)

router.get('/edit-product/:productId',isAuth,adminControllers.getEditProduct);

router.post('/edit-product',isAuth,adminControllers.postEditProduct)

router.post('/delete-product',isAuth,adminControllers.postDeleteProduct)
module.exports = router;
