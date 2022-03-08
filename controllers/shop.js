const Product = require("../models/product");
const Order = require("../models/order");

// const sequelize = require("../utils/database");

exports.getProducts = (req, res, next) => {
  // console.log("shop ",adminData.products)
  // res.sendFile(path.join(rootPath,"views","shop.html"));
  // // next()

  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",

      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(req.params);
  Product.findById(prodId)
    .then((product) => {
      console.log("hahkdfsds  ", product);
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "/products",

      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",

      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  console.log("tewtyt",req.user)
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: products,

      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("fds", result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });

  // let newQuantity = 1;

  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       //..
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }

  //     return Product.findById(prodId);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find()
    .then((orders) => {
      console.log("djlkasdjkl ", orders);
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,

      });
    })
    .catch((err) => console.log(err));
};

exports.postOrders = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      order.save();
    })
    .then((result) => {
     return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",

  });
};

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Product.findById(prodId).then(product=>{
// Cart.deleteProduct(prodId).then(()=>{
//   res.redirect('/cart')

// }).catch(err=>{console.log(err)});
