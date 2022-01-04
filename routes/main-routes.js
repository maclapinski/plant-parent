const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main');
const isAuth = require('../middleware/is-auth');

router.get('/', mainController.getIndexPage);
router.get('/user-plants', isAuth, mainController.getUserPlantList);
router.get('/plants', mainController.getPlants);
router.get('/search', mainController.getSearch);
router.get('/profile', mainController.getProfile);

router.post(
  '/add-to-plant-list',
  isAuth,
  mainController.postAddToUserPlantList
);
router.post(
  '/delete-from-plant-list',
  isAuth,
  mainController.postDeleteFromUserPlantList
);
router.post('/search', mainController.postSearch);

module.exports = router;
