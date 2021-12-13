const Plant = require('../models/plant');
const User = require('../models/user');

exports.getIndexPage = (req, res, next) => {
  Plant.fetchAll()
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

exports.getPlants = (req,res,next) => {
  Plant.fetchAll()
    .then((plants) => {
      res.render('main/plants', {
        path: '/plants',
        pageTitle: 'All Plants',
        plants: plants,
      });
    })
    .catch((err) => console.log(err));
}

exports.getMyPlants = (req,res,next) => {
  req.user.getMyPlants().then((plants) => {
    res.render('main/my-plants', {
      path: '/my-plants',
      pageTitle: 'My Plants',
      plants: plants,
    });
  })
  .catch((err) => console.log(err));
}

exports.postAddToPlants = (req, res, next) => {
  const plantId = req.body.plantId;
  req.user
    .addToPlantList(plantId)
    .then(() => {
      res.redirect('/my-plants');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteFromPlantList = (req, res, next) => {
  const plantId = req.body.plantId;
  req.user
    .deleteFromMyPlants(plantId)
    .then((result) => {
      res.redirect('/my-plants');
    });
};
