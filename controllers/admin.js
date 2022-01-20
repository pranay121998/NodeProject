const Product = require("../models/product");
const Cart = require('../models/cart')
exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootPath,"views","add-product.html"));
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing : false
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.id,
    req.body.title,
    req.body.imageUrl,
    req.body.price,
    req.body.description
  );

  // res.redirect("/");
  product.save().
  then(()=>res.redirect("/")).
  catch(err=> console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(editMode,req.params);
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  Product.findById(prodId).then(([product]) => {
    console.log("edit -----",product)
    if (!product[0]) {
      res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product[0],
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDesc
  );

  updatedProduct.save(prodId).then(()=>{
    res.redirect("/admin/products")

  }).catch(err=>{
    console.log(err)
  })
  
};

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(rootPath,"views","add-product.html"));
  Product.fetchAll().then(([rows,fieldData])=>{
    res.render("admin/products", {
      prods: rows,
      pageTitle: "All Products",
      path: "/admin/products",
    });
  }).catch(err=>{
    console.log(err);
  })
  
};

exports.postDeleteProduct =(req,res,next)=>{
    const prodId = req.body.productId;
    console.log(req.body)
    Product.deleteById(prodId).then(()=>{
        Cart.deleteProduct(prodId)
        .then(()=>{
          res.redirect('/admin/products')
        })
        .catch(err=>{console.log(err)});
    })
    .catch(err=>{console.log(err)});
       
}