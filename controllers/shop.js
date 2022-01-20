const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  // console.log("shop ",adminData.products)
  // res.sendFile(path.join(rootPath,"views","shop.html"));
  // // next()

  Product.fetchAll().then(([rows,fieldData])=>{
    res.render("shop/product-list", {
      prods: rows,
      pageTitle: "All Products",
      path: "/products",
    });
  }).catch(err=>{
    console.log(err);
  })
 
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // console.log(prodId)
  Product.findById(prodId).then(([row,field])=>{
    res.render("shop/product-detail", {
      pageTitle: row[0].title,
      product: row[0],
      path: "/products",
    });
  }).catch(err=>{
    console.log(err);
  })
   
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(([rows,fieldData])=>{
    res.render("shop/index", { 
      prods: rows, 
      pageTitle: "Shop", 
      path: "/" });
  }).catch(err=>{
    console.log(err);
  })
  
};

exports.getCart = (req, res, next) => {
  Cart.getCart().then(([carts,fieldData])=>{
      console.log("----------------",carts)
    res.render("shop/cart", {
          pageTitle: "Cart",
          path: "/cart",
          products : carts
        });
   
  }).catch(err=>console.log(err));

 
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  //    console.log("dgfgf",prodId);
  Product.findById(prodId).then(([row,field])=>{
    Cart.addProduct(row[0].id, row[0].price);
  }).then(()=>{
    res.redirect("/cart");
  }).catch(err=>{
    console.log(err);
  })
  // Product.findById(prodId, (products) => {
    
  // });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};


exports.postDeleteCartItem = (req,res,next )=>{
  const prodId = req.body.productId;
  // Product.findById(prodId).then(product=>{
    Cart.deleteProduct(prodId).then(()=>{
      res.redirect('/cart')

    }).catch(err=>{console.log(err)});
}