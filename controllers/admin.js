const Product = require("../models/product");
// const Cart = require('../models/cart');

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootPath,"views","add-product.html"));
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.price,
    req.body.imageUrl,
    req.body.description,
    null,
    req.user._id
  );

  product
    .save()
    .then((result) => {
      console.log("Product Created!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });

  //  Product.create({
  //   title:req.body.title,
  //   imageUrl:req.body.imageUrl,
  //   price:req.body.price,
  //   description:req.body.description,
  //   userId:req.user.id
  // }).then((result)=>{
  //   console.log("Product Created!")
  //   res.redirect("/admin/products")
  // }).catch(err=>{
  //   console.log(err)
  // });

  // // res.redirect("/");
  // product.save().
  // then(()=>res.redirect("/")).
  // catch(err=> console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log("jdfsjsdlkj", editMode, req.params);
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  // Product.findByPk(prodId).
  // req.user.getProducts({where:{id:prodId}}).
  Product.findById(prodId).then((product) => {
    // console.log("edit -----",product)
    if (!product) {
      res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  product = new Product(
    updatedTitle,
    updatedPrice,
    updatedImageUrl,
    updatedDesc,
    prodId
  );

  product
    .save()
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(rootPath,"views","add-product.html"));
  Product.fetchAll()
    // Product.findAll().
    .then((products) => {
      // console.log(products)
      res.render("admin/products", {
        prods: products,
        pageTitle: "All Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(req.body);

  Product.DeleteById(prodId)
    .then(() => {
      console.log("DELETED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
