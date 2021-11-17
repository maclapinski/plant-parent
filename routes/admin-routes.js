const express = require('express');
const path = require('path');
const adminController = require('../controllers/admin');
const router = express.Router();

router.get('/', adminController.getAdminPage);
router.get('/edit-plants', adminController.getEditPlants);
router.get('/edit-plant/:plantId', adminController.getEditPlant);
router.get('/edit-plant/', adminController.getEditPlant);

router.post('/add-plant', adminController.postAddPlant);
router.post('/edit-plant', adminController.postEditPlant);
router.post('/delete-plant', adminController.postDeletePlant);

module.exports = router;
