const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', isAuth, isAdmin, adminController.getAdminPage);
router.get('/edit-plant/:plantId', isAuth, isAdmin, adminController.getEditPlant);
router.get('/edit-plant/', isAuth, isAdmin, adminController.getEditPlant);

router.post('/add-plant', isAuth, isAdmin, adminController.postAddPlant);
router.post('/edit-plant', isAuth, isAdmin, adminController.postEditPlant);
router.delete('/delete-plant/:plantId', isAuth, isAdmin, adminController.deletePlant);

module.exports = router;
