const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const password = require('./util/dbpass');
 const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin-routes');
const userRoutes = require('./routes/main-routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('61b8f4edc1313006019d9cd1')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(userRoutes);

mongoose
  .connect(
    `mongodb+srv://macieklap:${password}@plantparentdb.tfx53.mongodb.net/plantParent?retryWrites=true&w=majority`
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          plantList: [
          ]
        });
        user.save();
      }
    });
    app.listen(3005);
  })
  .catch();
