const Product = require("../models/product");
const Cart = require("../models/cart");

const sequelize = require("../utils/database");

exports.getProducts = (req, res, next) => {
  // console.log("shop ",adminData.products)
  // res.sendFile(path.join(rootPath,"views","shop.html"));
  // // next()

  Product.findAll()
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
  // console.log(prodId)
  Product.findByPk(prodId)
    .then((product) => {
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
  Product.findAll()
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
  req.user
    .getCart()
    .then((carts) => {
      return carts
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            pageTitle: "Cart",
            path: "/cart",
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

  // Cart.getCart().then(([carts,fieldData])=>{
  //     console.log("----------------",carts)
  //   res.render("shop/cart", {
  //         pageTitle: "Cart",
  //         path: "/cart",
  //         products : carts
  //       });

  // }).catch(err=>console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  //    console.log("dgfgf",prodId);
  let newQuantity = 1;

  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        //..
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));

  // Product.findByPk(prodId).then((product)=>{
  //   Cart.addProduct(product.id, product.price);
  // }).then(()=>{
  //
  // }).catch(err=>{
  //   console.log(err);
  // })
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include:['products']})
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrders = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      req.user.createOrder().then((order) => {
        return order.addProduct(
          products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
      });
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
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
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
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
