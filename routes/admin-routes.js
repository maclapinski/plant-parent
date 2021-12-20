const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, adminController.getAdminPage);
router.get('/edit-plant/:plantId', isAuth, adminController.getEditPlant);
router.get('/edit-plant/', isAuth, adminController.getEditPlant);

router.post('/add-plant', isAuth, adminController.postAddPlant);
router.post('/edit-plant', isAuth, adminController.postEditPlant);
router.post('/delete-plant', isAuth, adminController.postDeletePlant);

module.exports = router;
