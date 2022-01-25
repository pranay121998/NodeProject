const path = require('path');

const express = require('express');

const router = express.Router();

const shopControllers= require('../controllers/shop')


router.get('/',shopControllers.getIndex)

router.get('/products',shopControllers.getProducts)

router.get('/products/:productId',shopControllers.getProduct);

router.get('/cart',shopControllers.getCart)

router.post('/cart',shopControllers.postCart)

router.post('/cart-delete-item',shopControllers.postDeleteCartItem)

router.get('/orders',shopControllers.getOrders)

router.post('/create-order',shopControllers.postOrders)

router.get('/checkout',shopControllers.getCheckout)


module.exports = router;