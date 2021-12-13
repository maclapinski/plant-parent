const express = require("express");
const path = require("path");
const mainController = require("../controllers/main");
const router = express.Router();

router.get("/", mainController.getIndexPage);
router.get('/my-plants', mainController.getMyPlants)
router.get('/plants', mainController.getPlants)

router.post('/add-to-plants', mainController.postAddToPlants)
router.post('/delete-from-plant-list', mainController.postDeleteFromPlantList)


module.exports = router;
