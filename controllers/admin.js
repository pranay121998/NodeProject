const { validationResult } = require("express-validator/check");

const Product = require("../models/product");
// const Cart = require('../models/cart');
const fileHelper = require("../utils/file");

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootPath,"views","add-product.html"));
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasErrors: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  // console.log(req.body)
  const title = req.body.title;
  const price = req.body.price;
  const image = req.file;
  const description = req.body.description;
  const userId = req.session.user;
  console.log("iange ", image);

  const errors = validationResult(req);
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add Product",
      hasErrors: true,
      editing: false,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: "Please,Add file with png,jpg or jpeg formate.", //errors.array()[0].msg,
      validationErrors: [],
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add Product",
      errorMessage: errors.array()[0].msg,
      hasErrors: true,
      editing: false,
      product: {
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
      },
      validationErrors: errors.array(),
    });
  }
  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: userId,
  });

  product
    .save()
    .then((result) => {
      console.log("Product Created!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // console.log(err);
      // res.redirect('/500')
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log("jdfsjsdlkj", editMode, req.params);
  if (!editMode) {
    return res.redirect("/");
  }
  // throw new Error("dummy")
  const prodId = req.params.productId;
  console.log(prodId);
  // Product.findByPk(prodId).
  // req.user.getProducts({where:{id:prodId}}).
  Product.findById(prodId)
    .then((product) => {
      // console.log("edit -----",product)
      if (!product) {
        res.redirect("/");
      }
      console.log("log  ", product);
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        hasErrors: true,
        errorMessage: null,
        product: product,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);

  console.log("errrors", errors.array());

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Product",
      errorMessage: errors.array()[0].msg,
      hasErrors: true,
      editing: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      validationErrors: errors.array(),
    });
  }
  console.log("==<>", req.body, req.user._id);
  Product.findById(prodId)
    .then((product) => {
      console.log("dfsda", product);

      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.description = updatedDesc;
      console.log("agerter ", product);
      return product.save().then((result) => {
        console.log("UPDATED PRODUCT!");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(rootPath,"views","add-product.html"));
  Product.find({ userId: req.user._id })
    // Product.findAll().
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "All Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // console.log("fdsasdffdsa",req.params,prodId);

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then((data) => {
      console.log(data)
      console.log("DELETED PRODUCT!");
      // req.user.removeFromCart(prodId).then((result) => {
        // console.log(result)
        res.status(200).json({message:'success'})
      // });
    })
    .catch((err) => {
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
        res.status(500).json({message:'delete product failed.'})
    });
};
