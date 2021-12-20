const Plant = require('../models/plant');

exports.getIndexPage = (req, res, next) => {
  Plant.find()
    .then((plants) => {
      res.render('main/index', {
        path: '/',
        pageTitle: 'Index',
        plants: plants,
        errorMessage: req.flash('error'),
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
        errorMessage: req.flash('error'),
      });
    })
    .catch((err) => console.log(err));
};
exports.getSearch = (req, res, next) => {
  res.render('main/search', {
    path: '/search',
    pageTitle: 'Search',
  });
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

exports.postSearch = (req, res, next) => {
  const difficulty = req.body.difficulty;
  const light = req.body.light;
  const petSafe = req.body.pets;

  let difficultyList = [];
  let lightList = [];
  let lightQuery;
  let difficultyQuery;
  let query;

  if (typeof light === 'string') {
    lightQuery = { light: light };
  } else {
    for (item of light) {
      const object = { light: item };
      lightList.push(object);
    }
    lightQuery = { $or: lightList };
  }

  if (typeof difficulty === 'string') {
    difficultyQuery = { difficulty: difficulty };
  } else {
    for (item of difficulty) {
      const object = { difficulty: item };
      difficultyList.push(object);
    }
    difficultyQuery = { $or: difficultyList };
  }

  if (req.body.pets === 'true') {
    query = { $and: [difficultyQuery, lightQuery, { isSafeForPets: petSafe }] };
  } else {
    query = { $and: [difficultyQuery, lightQuery] };
  }

  Plant.find(query)
    .then((plants) => {
      res.render('main/plants', {
        path: '/plants',
        pageTitle: 'Search Results',
        plants: plants,
      });
    })
    .catch((err) => console.log(err));
};
