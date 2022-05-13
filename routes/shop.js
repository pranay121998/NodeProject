const path = require('path');

const express = require('express');

const router = express.Router();

const shopControllers= require('../controllers/shop')
const isAuth = require('../middleware/isAuth')


router.get('/',shopControllers.getIndex)

router.get('/products',shopControllers.getProducts)

router.get('/products/:productId',shopControllers.getProduct);

router.get('/cart',isAuth,shopControllers.getCart)

router.post('/cart',isAuth,shopControllers.postCart)

router.post('/cart-delete-item',isAuth,shopControllers.postDeleteCartItem)

router.get('/checkout',isAuth,shopControllers.getCheckout)

router.get('/checkout/success',shopControllers.postOrders)

router.get('/checkout/cancel',shopControllers.getCheckout)

router.get('/orders',isAuth,shopControllers.getOrders)

// router.post('/create-order',isAuth,shopControllers.postOrders)


router.get('/order/:orderId',isAuth,shopControllers.getInvoice)

module.exports = router;