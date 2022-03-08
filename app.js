const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/errors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require('connect-flash')
const MONGODB_URI =
  "mongodb+srv://Pranay:lDRSNjUdwmle0CSj@cluster0.1vdgw.mongodb.net/nodeProject?retryWrites=true&w=majority";

const csrfProtection = csrf();

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
// const mongoConnect = require("./utils/database").mongoConnect;
const User = require("./models/user");
// const expressHbs = require('express-handlebars')

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my Secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash())

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  // console.log("fddsf", req.csrfToken());
  res.locals.isAuthenticated = req.session.isLogin
    ? req.session.isLogin
    : false;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(8000);
  })
  .catch((err) => console.log(err));
