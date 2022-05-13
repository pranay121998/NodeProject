const path = require("path");

const express = require("express");
const { check, body } = require("express-validator");

const adminControllers = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

//admin/add-product
router.get("/add-product", isAuth, adminControllers.getAddProduct);

//admin/products
router.get("/products", isAuth, adminControllers.getProducts);

//admin/add-product
router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    check("description").isString().trim().isLength({ min: 5, max: 500 }),
  ],
  isAuth,
  adminControllers.postAddProduct
);

router.get("/products/:productId", isAuth, adminControllers.getEditProduct);

router.get("/edit-product/:productId", isAuth, adminControllers.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    check("description").isString().trim().isLength({ min: 5, max: 500 }),
  ],
  isAuth,
  adminControllers.postEditProduct
);

router.delete("/delete-product/:productId", isAuth, adminControllers.deleteProduct);
module.exports = router;
