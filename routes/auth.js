const express = require("express");
const { check, body } = require("express-validator");

const authControllers = require("../controllers/auth");
const User = require('../models/user')
const router = express.Router();

//auth/login
router.get("/login", authControllers.getLogin);

router.get("/signup", authControllers.getSignup);

router.post("/login",[
    check('email')
    .isEmail()
    .withMessage('Please enter valid email address.'),
    body('password',
    'Please enter only numbers and text and atleast 5 characters').isLength({min:5}).isAlphanumeric()
], authControllers.postLogin);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid email address!")
      .custom((value, { req }) => {
       return User.findOne({ email: value  })
        .then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email already exists. Try another email address!')
          }
        })
      }),
    body(
      "password",
      "Please enter password with only numbers and text and atleast 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords has to match!");
      }
      return true;
    }),
  ],
  authControllers.postSignup
);

router.post("/logout", authControllers.postLogout);

router.get("/reset", authControllers.getresetPassword);

router.post("/reset", authControllers.postReset);

router.get("/reset/:token", authControllers.getNewPassword);

router.post("/new-password", authControllers.postNewPassword);

module.exports = router;
