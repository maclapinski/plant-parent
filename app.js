const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const PASSWORD = require('./util/dbpass');
 const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: `mongodb+srv://macieklap:${PASSWORD}@plantparentdb.tfx53.mongodb.net/sessions`,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin-routes');
const mainRoutes = require('./routes/main-routes');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.userAvatar = req.user ?`https://ui-avatars.com/api/?name=${req.user.firstName}+${req.user.lastName}&rounded=true` : '';
  res.locals.isAdmin = req.user ? req.user.isAdmin : false;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(mainRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    `mongodb+srv://macieklap:${PASSWORD}@plantparentdb.tfx53.mongodb.net/plantParent?retryWrites=true&w=majority`
  )
  .then(result => {
    app.listen(3005);
  })
  .catch();
