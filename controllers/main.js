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
      // console.log(
      //   plants[2]._id.toString() === req.user.plantList[0].plant.toString()
      // );
      // console.log(plants);
      // console.log(req.user.plantList);
      const usrPlants = [];
      for (item of req.user.plantList) {
        usrPlants.push(item.plant.toString());
      }
      res.render('main/plants', {
        path: '/plants',
        pageTitle: 'All Plants',
        plants: plants,
        userPlants: usrPlants
      });
    })
    .catch((err) => console.log(err));
};

exports.getUserPlantList = (req, res, next) => {
  req.user
    .populate('plantList.plant')
    // .execPopulate()
    .then((user) => {
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
  let errMsg = req.flash('error');
  const plants = req.body.plants ? req.body.plants : [];

  if (errMsg.length > 0) {
    errMsg = errMsg[0];
  } else {
    errMsg = null;
  }

  res.render('main/search', {
    path: '/search',
    pageTitle: 'Search',
    errMessage: errMsg,
    plants: plants,
    oldInput: {
      lowLight: '',
      mediumLight: '',
      brightLight: '',
      easy: '',
      medium: '',
      advanced: '',
      petSafe: false,
    },
  });
};

exports.getProfile = (req, res, next) => {
  const user = req.user;
  user.avatar = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&rounded=true`;
  res.render('main/profile', {
    path: '/profile',
    pageTitle: 'User Profile',
    user: user,
    errorMessage: req.flash('error'),
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
  const difficulty =
    typeof req.body.difficulty === 'string'
      ? [req.body.difficulty]
      : req.body.difficulty;
  const light =
    typeof req.body.light === 'string' ? [req.body.light] : req.body.light;
  const petSafe = req.body.petSafe ? true : false;
  const difficultyList = [];
  const lightList = [];
  let lightQuery;
  let difficultyQuery;
  let lowLight = '';
  let mediumLight = '';
  let brightLight = '';
  let easy = '';
  let medium = '';
  let advanced = '';
  let query;

  if (typeof light === 'object') {
    for (item of light) {
      switch (item) {
        case 'low':
          lowLight = 'checked';
          break;
        case 'medium':
          mediumLight = 'checked';
          break;
        case 'bright':
          brightLight = 'checked';
      }

      const object = { light: item };
      lightList.push(object);
    }
    lightQuery = { $or: lightList };
  } else {
    lightQuery = {};
  }

  if (typeof difficulty === 'object') {
    for (item of difficulty) {
      switch (item) {
        case 'easy':
          easy = 'checked';
          break;
        case 'medium':
          medium = 'checked';
          break;
        case 'advanced':
          advanced = 'checked';
      }

      const object = { difficulty: item };
      difficultyList.push(object);
    }
    difficultyQuery = { $or: difficultyList };
  } else {
    difficultyQuery = {};
  }

  if (petSafe) {
    query = { $and: [difficultyQuery, lightQuery, { isSafeForPets: petSafe }] };
  } else {
    query = { $and: [difficultyQuery, lightQuery] };
  }

  Plant.find(query)
    .then((plants) => {
      if (plants.length < 1) {
        return res.render('main/search', {
          path: '/search',
          pageTitle: 'Search',
          plants: plants,
          errMessage: 'No suitable plants found.',
          oldInput: {
            lowLight: lowLight,
            mediumLight: mediumLight,
            brightLight: brightLight,
            easy: easy,
            medium: medium,
            advanced: advanced,
            petSafe: petSafe,
          },
        });
      }
      res.render('main/search', {
        path: '/search',
        pageTitle: 'Search Results',
        errMessage: null,
        plants: plants,
        oldInput: {
          lowLight: lowLight,
          mediumLight: mediumLight,
          brightLight: brightLight,
          easy: easy,
          medium: medium,
          advanced: advanced,
          petSafe: petSafe,
        },
      });
    })
    .catch((err) => console.log(err));
};
