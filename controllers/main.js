const Plant = require('../models/plant');
const User = require('../models/user');

exports.getIndexPage = (req, res, next) => {
  Plant.find()
    .then((plants) => {
      res.render('main/index', {
        path: '/',
        pageTitle: 'Index',
        myPlants: plants,
        plants: plants,
      });
    })
    .catch((err) => console.log(err));
};

exports.getPlants = (req, res, next) => {
  Plant.find()
    .then((plants) => {
      res.render('main/plants', {
        path: '/plants',
        pageTitle: 'All Plants',
        plants: plants,
      });
    })
    .catch((err) => console.log(err));
};

exports.getUserPlantList = (req, res, next) => {
  req.user
    .populate('plantList.plant')
    // .execPopulate()
    .then((user) => {
      console.log('user');
      console.log(user.plantList);
      const plants = user.plantList;
      res.render('main/user-plants', {
        path: '/user-plants',
        pageTitle: 'My Plants',
        plants: plants,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddToUserPlantList = (req, res, next) => {
  const plantId = req.body.plantId;
  Plant.findById(plantId)
    .then((plant) => {
      return req.user.addToUserPlantList(plant);
    })
    .then((result) => {
      console.log(result);
      res.redirect('/user-plants');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteFromUserPlantList = (req, res, next) => {
  const plantId = req.body.plantId;
  return req.user.deleteFromUserPlantList(plantId).then((result) => {
    console.log(result);
    res.redirect('/user-plants');
  });
};
