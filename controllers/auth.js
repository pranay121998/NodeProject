const crypto = require("crypto");
const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

let account;
const User = require("../models/user");
const user = require("../models/user");
// transport;

// nodemailer.createTestAccount().then((testAccount) => {
account = {
  user: "as3wseiddwlyl3nm@ethereal.email",
  pass: "qYcTTBNmxeMzrXa69t",
  smtp: { host: "smtp.ethereal.email", port: 587, secure: false },
  imap: { host: "imap.ethereal.email", port: 993, secure: true },
  pop3: { host: "pop3.ethereal.email", port: 995, secure: true },
  web: "https://ethereal.email",
};
console.log(account)
transport = nodemailer.createTransport({
  host: account.smtp.host,
  port: account.smtp.port,
  secure: account.smtp.secure,
  auth: {
    user: account.user,
    pass: account.pass,
  },
});
// });

exports.getLogin = (req, res, next) => {
  console.log(req.get("Cookie"));
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    csrfToken: req.csrfToken(),
    errorMessage: message,
    oldInput:{
      email:'',
      password:""
    },
    validationErrors:[]
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email:email?email:'',
        password:password
      },
      validationErrors:errors.array()
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password!");
        // return res.redirect("/login");
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage:'Invalid email.',
          oldInput:{
            email:email,
            password:password
          },
          validationErrors:[{param:'email'}]
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLogin = true;
            req.session.user = user;
            return req.session.user.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage:'Invalid Password.',
            oldInput:{
              email:email,
              password:password
            },
            validationErrors:[{param:'password'}]
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err=>{
      const error = new Error(err)
      error.httpStatusCode=500;
      return next(error)
    });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput:{
      email:'',
      password:'',
      confirmPassword:''
    },
    validationErrors:[]
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());

    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email:email,
        password:password,
        confirmPassword:confirmPassword
      },
      validationErrors:errors.array()
    });
  }

  // User.findOne({ email: email })
  //   .then((userDoc) => {
  //     if (userDoc) {
  //       req.flash("error", "Email already in use.Try another email.");

  //       return res.redirect("/signup");
  //     }

   bcrypt.hash(password, 12).then((hashPassword) => {
    const user = new User({
      email: email,
      password: hashPassword,
      cart: { items: [] },
    });

    user
      .save()
      .then((result) => {
        console.log(account, user);
        res.redirect("/login");
        return transport
          .sendMail({
            to: email,
            from: account.user, //" testAccount.user",
            subject: "Suceed succesful!",
            html: "<h1>Signup succesful </h2>",
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch(err=>{
        const error = new Error(err)
        error.httpStatusCode=500;
        return next(error)
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getresetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "reset",
    csrfToken: req.csrfToken(),
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found ");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        user
          .save()
          .then((result) => {
            transport.sendMail({
              to: req.body.email,
              from: account.email,
              subject: "Reset Password",
              html: `
        <p>You requested for reset password.</p>
        <p>Click this <a href="http://localhost:8000/reset/${token}">link</a> to set a new password</p>
        `,
            });

            res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch(err=>{
        const error = new Error(err)
        error.httpStatusCode=500;
        return next(error)
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  user
    .findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    })
    .then((user) => {
      console.log(user);
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch(err=>{
      const error = new Error(err)
      error.httpStatusCode=500;
      return next(error)
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch(err=>{
      const error = new Error(err)
      error.httpStatusCode=500;
      return next(error)
    });
};
