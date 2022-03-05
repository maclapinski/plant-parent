const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main');
const isAuth = require('../middleware/is-auth');

router.get('/', mainController.getIndexPage);
router.get('/new', mainController.getNewIndexPage);
router.get('/user-plant-list', isAuth, mainController.getUserPlantList);
router.get('/user-wish-list', isAuth, mainController.getUserWishList);
router.get('/plants', mainController.getPlants);
router.get('/plants/:plantId', mainController.getPlant);
router.get('/subscribe', mainController.getSubscribe);
router.get('/unsubscribe/:token', mainController.getUnsubscribe);
router.get('/search', mainController.getSearch);
router.get('/profile', mainController.getProfile);
router.get('/premium', mainController.getPremium);
 router.get('/premium/success/:token', mainController.getPremiumSuccess);
 router.get('/privacy-policy', mainController.getPrivacyPolicy);
// router.get('/premium/cancel', mainController.getPremium);

router.post(
  '/add-to-plant-list/:plantId',
  isAuth,
  mainController.postAddToUserPlantList
);
router.post(
  '/add-to-wish-list/:plantId',
  isAuth,
  mainController.postAddToUserWishList
);
// router.post(
//   '/delete-from-plant-list',
//   isAuth,
//   mainController.postDeleteFromUserPlantList
// );
router.delete(
  '/delete-from-plant-list/:plantId',
  isAuth,
  mainController.deleteFromUserPlantList
);
router.delete(
  '/delete-from-wish-list/:plantId',
  isAuth,
  mainController.deleteFromUserWishList
);
router.post('/search', mainController.postSearch);
router.post('/subscribe', mainController.postSubscribe);

module.exports = router;
