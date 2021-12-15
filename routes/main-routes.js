const express = require("express");
const path = require("path");
const mainController = require("../controllers/main");
const router = express.Router();

router.get("/", mainController.getIndexPage);
 router.get('/user-plants', mainController.getUserPlantList)
 router.get('/plants', mainController.getPlants)

 router.post('/add-to-plant-list', mainController.postAddToUserPlantList)
 router.post('/delete-from-plant-list', mainController.postDeleteFromUserPlantList)


module.exports = router;
