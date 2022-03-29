const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");
const stripe = require("stripe")(
  "sk_test_51JPpHoSBqqFf02XzS3O0gKbPPXqEkVLcokJkncvnNLagonqbcZ9jSiK3mhGMRaT8cD2Dkul1HZm9aXPh6G6UsDBH00QpSD7FIt"
);

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 1;
// const sequelize = require("../utils/database");

exports.getProducts = (req, res, next) => {
  // console.log("shop ",adminData.products)
  // res.sendFile(path.join(rootPath,"views","shop.html"));
  // // next()
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .count()
    .then((numProduct) => {
      totalItems = numProduct;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        currentPage: page,
        totalProducts: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .count()
    .then((numProduct) => {
      totalItems = numProduct;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        totalProducts: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  console.log("tewtyt", req.user);
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log(user.cart);
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let totalPrice = 0;

  console.log("USER", req.user);
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log("fdsjfriutor", user.cart);
      products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      console.log("productss ", products);

      products.forEach((p) => {
        totalPrice = totalPrice + p.quantity * p.product.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            name: p.product.title,
            description: p.product.description,
            amount: p.product.price * 100,
            currency: "INR",
            quantity: p.quantity,
          };
        }),
        success_url:req.protocol + '://' + req.get('host') +'/checkout/success',
        cancel_url:req.protocol + '://' + req.get('host') +'/checkout/cancel'
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout",
        products: products,
        totalPrice: totalPrice,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      console.log(err);
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
    });
};

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .removeFromCart(prodId)
    .then((result) => {
      console.log("dsjldflasdl", result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  //  console.log(invoicePath)
  console.log(orderId);
  Order.findById(orderId)
    .then((order) => {
      console.log(order);
      if (!order) {
        return next(new Error("No order found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized."));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      let totalPrice = 0;

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });

      pdfDoc.text("-----------------------------");
      order.products.forEach((prod) => {
        console.log(
          totalPrice,
          typeof prod.quantity,
          typeof prod.product.price
        );

        totalPrice = totalPrice + prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            `${prod.product.title} - ${prod.quantity} * $${prod.product.price}`
          );
      });

      pdfDoc.text("-----------------------");
      pdfDoc.fontSize(23).text(`Total Amount - $${totalPrice}`);

      pdfDoc.end();

      //  fs.readFile(invoicePath,(err,data)=>{
      //   if(err){
      //     return next(err);
      //   }
      //   console.log(data.toString())
      //   res.setHeader('content-type','application/pdf');
      //   res.setHeader('content-disposition','inline; filename="' +invoiceName +'"')
      //   res.send(data.toString())
      // })

      //  const file = fs.createReadStream(invoicePath);
      //   file.pipe(res)
    })
    .catch((err) => next(err));
};

// Product.findById(prodId).then(product=>{
// Cart.deleteProduct(prodId).then(()=>{
//   res.redirect('/cart')

// }).catch(err=>{console.log(err)});
