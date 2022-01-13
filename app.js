const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/errors')

const app = express();

const expressHbs = require('express-handlebars')
// const ejs = require('ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes =require('./routes/shop')
// app.set('view engine',"pug");
// app.set('views','views')

// app.engine('hbs',expressHbs({layoutsDir: 'views/layouts/', defaultLayout:'main-layout',extname:'hbs' }));
// app.set('view engine',"hbs");

app.set('view engine','ejs');
app.set('views','views')

app.use(express.static(path.join(__dirname,"public")));

app.use(bodyParser.urlencoded({extended : false}));


app.use("/admin",adminRoutes);

app.use(shopRoutes);

app.use(errorController.get404);

app.listen(8000)